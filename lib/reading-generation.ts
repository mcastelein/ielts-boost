import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type {
  AnswerExplanation,
  QuestionGroup,
  ReadingPassage,
  ReadingQuestion,
} from "./reading-passages";
import { checkAnswerDeterministic, normalizeAnswer } from "./reading-scoring";

export const GENERATION_MODEL = "claude-opus-4-8";
export const PROMPT_VERSION = 1;

const PARAGRAPH_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];

export const QUESTION_TYPES = [
  "mcq",
  "tfng",
  "ynng",
  "matching_headings",
  "matching_info",
  "sentence_completion",
  "summary_completion",
] as const;
export type GenerationQuestionType = (typeof QUESTION_TYPES)[number];

export interface GenerationOptions {
  topic: string;
  difficulty: 1 | 2 | 3;
  questionTypes: GenerationQuestionType[];
  questionCount?: number;
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const explanationSchema = z.object({
  paragraph: z.string().min(1),
  quote: z.string().min(1),
  en: z.string().min(1),
  zh: z.string().min(1),
});

const generatedQuestionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(QUESTION_TYPES),
  text: z.string().optional(),
  options: z.array(z.string()).optional(),
  paragraphLabel: z.string().optional(),
  wordLimit: z.number().int().min(1).max(4).optional(),
  answer: z.string().min(1),
  answerVariants: z.array(z.string()).optional(),
  wordBox: z.array(z.string()).optional(),
  // Optional in the schema so admin edits of legacy passages (no explanations)
  // still validate; generation enforces presence via requireExplanations.
  explanation: explanationSchema.optional(),
});

const generatedGroupSchema = z.object({
  instruction: z.string().min(1),
  sharedOptions: z.array(z.string().min(1)).optional(),
  questions: z.array(generatedQuestionSchema).min(1),
});

export const generatedPassageSchema = z.object({
  title: z.string().min(3).max(120),
  topicTags: z.array(z.string().min(1)).min(1).max(6),
  passageText: z.string().min(200),
  questionGroups: z.array(generatedGroupSchema).min(1).max(4),
});

export type GeneratedPassage = z.infer<typeof generatedPassageSchema>;

// ─── Text helpers ────────────────────────────────────────────────────────────

export function splitParagraphs(passageText: string): string[] {
  return passageText.split(/\n\n+/).filter(Boolean);
}

export function labelParagraphs(passageText: string): { label: string; text: string }[] {
  return splitParagraphs(passageText).map((text, i) => ({
    label: PARAGRAPH_LABELS[i] ?? `${i + 1}`,
    text,
  }));
}

/** Normalize for fuzzy substring comparison: collapse whitespace, straighten quotes. */
function normalizeForMatch(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, "—")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function quoteFoundInParagraph(quote: string, paragraph: string): boolean {
  return normalizeForMatch(paragraph).includes(normalizeForMatch(quote));
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateExplanation(
  explanation: AnswerExplanation,
  questionId: string,
  paragraphs: { label: string; text: string }[],
  errors: string[]
): void {
  const para = paragraphs.find((p) => p.label === explanation.paragraph.trim().toUpperCase());
  if (!para) {
    errors.push(
      `Question ${questionId}: explanation.paragraph "${explanation.paragraph}" is not a valid paragraph label (passage has ${paragraphs.length} paragraphs, A–${paragraphs[paragraphs.length - 1]?.label})`
    );
    return;
  }
  if (!quoteFoundInParagraph(explanation.quote, para.text)) {
    errors.push(
      `Question ${questionId}: explanation.quote is not a verbatim substring of paragraph ${explanation.paragraph}. Quote must be copied exactly from the passage.`
    );
  }
}

/**
 * Full structural + semantic validation of a generated passage.
 * Returns the typed passage when valid, plus a list of human/model-readable errors.
 */
export function validateGeneratedPassage(
  data: unknown,
  { requireExplanations = true }: { requireExplanations?: boolean } = {}
): {
  passage: GeneratedPassage | null;
  errors: string[];
} {
  const parsed = generatedPassageSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
    );
    return { passage: null, errors };
  }

  const passage = parsed.data;
  const errors: string[] = [];

  const paragraphs = labelParagraphs(passage.passageText);
  const validLabels = paragraphs.map((p) => p.label);
  const wordCount = countWords(passage.passageText);

  if (wordCount < 600 || wordCount > 1050) {
    errors.push(`Passage is ${wordCount} words; must be 650–1000 words.`);
  }
  if (paragraphs.length < 4 || paragraphs.length > 10) {
    errors.push(
      `Passage has ${paragraphs.length} paragraphs (blank-line separated); must have 5–8.`
    );
  }
  if (/^[A-Z][.):]\s/m.test(passage.passageText)) {
    errors.push(
      `Passage text must not contain literal paragraph labels like "A." — labels are added automatically by position.`
    );
  }

  const seenIds = new Set<string>();

  for (const [gi, group] of passage.questionGroups.entries()) {
    for (const q of group.questions) {
      if (seenIds.has(q.id)) {
        errors.push(`Duplicate question id "${q.id}".`);
      }
      seenIds.add(q.id);

      switch (q.type) {
        case "mcq": {
          if (!q.text) errors.push(`Question ${q.id} (mcq): missing "text".`);
          if (!q.options || q.options.length < 3 || q.options.length > 6) {
            errors.push(`Question ${q.id} (mcq): must have 3–6 options.`);
          } else {
            const idx = q.answer.trim().toUpperCase().charCodeAt(0) - 65;
            if (!/^[A-F]$/.test(q.answer.trim().toUpperCase()) || idx >= q.options.length) {
              errors.push(
                `Question ${q.id} (mcq): answer "${q.answer}" must be a letter A–${String.fromCharCode(64 + q.options.length)}.`
              );
            }
          }
          break;
        }
        case "tfng": {
          if (!q.text) errors.push(`Question ${q.id} (tfng): missing "text".`);
          if (!["true", "false", "not given"].includes(normalizeAnswer(q.answer))) {
            errors.push(
              `Question ${q.id} (tfng): answer must be "True", "False" or "Not Given", got "${q.answer}".`
            );
          }
          break;
        }
        case "ynng": {
          if (!q.text) errors.push(`Question ${q.id} (ynng): missing "text".`);
          if (!["yes", "no", "not given"].includes(normalizeAnswer(q.answer))) {
            errors.push(
              `Question ${q.id} (ynng): answer must be "Yes", "No" or "Not Given", got "${q.answer}".`
            );
          }
          break;
        }
        case "matching_headings": {
          if (!q.paragraphLabel || !validLabels.includes(q.paragraphLabel.trim().toUpperCase())) {
            errors.push(
              `Question ${q.id} (matching_headings): paragraphLabel "${q.paragraphLabel}" is not a valid label (A–${validLabels[validLabels.length - 1]}).`
            );
          }
          if (!group.sharedOptions || group.sharedOptions.length === 0) {
            errors.push(
              `Group ${gi + 1} (matching_headings): missing "sharedOptions" heading list.`
            );
          } else {
            const validRomans = ROMAN_NUMERALS.slice(0, group.sharedOptions.length);
            if (!validRomans.includes(q.answer.trim().toLowerCase())) {
              errors.push(
                `Question ${q.id} (matching_headings): answer "${q.answer}" must be a roman numeral i–${validRomans[validRomans.length - 1]}.`
              );
            }
          }
          break;
        }
        case "matching_info": {
          if (!q.text) errors.push(`Question ${q.id} (matching_info): missing "text".`);
          if (!validLabels.includes(q.answer.trim().toUpperCase())) {
            errors.push(
              `Question ${q.id} (matching_info): answer "${q.answer}" must be a paragraph label A–${validLabels[validLabels.length - 1]}.`
            );
          }
          break;
        }
        case "sentence_completion":
        case "summary_completion": {
          if (!q.text) errors.push(`Question ${q.id} (${q.type}): missing "text".`);
          if (!q.wordLimit) {
            errors.push(`Question ${q.id} (${q.type}): missing "wordLimit".`);
            break;
          }
          if (q.wordBox && q.wordBox.length > 0) {
            // Word-box variant: answer is a letter into sharedOptions
            if (!q.wordBox.includes(q.answer.trim().toUpperCase())) {
              errors.push(
                `Question ${q.id} (${q.type}): answer "${q.answer}" must be one of the wordBox letters [${q.wordBox.join(", ")}].`
              );
            }
            if (!group.sharedOptions || group.sharedOptions.length !== q.wordBox.length) {
              errors.push(
                `Group ${gi + 1} (${q.type}): sharedOptions must list one lettered word per wordBox letter.`
              );
            }
          } else {
            if (countWords(q.answer) > q.wordLimit) {
              errors.push(
                `Question ${q.id} (${q.type}): answer "${q.answer}" exceeds the ${q.wordLimit}-word limit.`
              );
            }
            if (!normalizeForMatch(passage.passageText).includes(normalizeForMatch(q.answer))) {
              errors.push(
                `Question ${q.id} (${q.type}): answer "${q.answer}" does not appear verbatim in the passage — completion answers must be words taken from the passage.`
              );
            }
          }
          break;
        }
      }

      if (q.explanation) {
        validateExplanation(q.explanation, q.id, paragraphs, errors);
      } else if (requireExplanations) {
        errors.push(`Question ${q.id}: missing "explanation" object.`);
      }
    }
  }

  // Distractor sanity: matching_headings needs more headings than questions
  for (const [gi, group] of passage.questionGroups.entries()) {
    const headingQs = group.questions.filter((q) => q.type === "matching_headings");
    if (headingQs.length > 0 && group.sharedOptions) {
      if (group.sharedOptions.length < headingQs.length + 2) {
        errors.push(
          `Group ${gi + 1} (matching_headings): must include at least 2 distractor headings (${group.sharedOptions.length} headings for ${headingQs.length} questions).`
        );
      }
    }
  }

  // TFNG/YNNG sets should include at least one Not Given
  for (const [gi, group] of passage.questionGroups.entries()) {
    const tfngQs = group.questions.filter((q) => q.type === "tfng" || q.type === "ynng");
    if (tfngQs.length >= 3 && !tfngQs.some((q) => normalizeAnswer(q.answer) === "not given")) {
      errors.push(
        `Group ${gi + 1} (tfng/ynng): must include at least one "Not Given" answer.`
      );
    }
  }

  return errors.length > 0 ? { passage: null, errors } : { passage, errors: [] };
}

// ─── Prompts ─────────────────────────────────────────────────────────────────

const DIFFICULTY_GUIDANCE: Record<number, string> = {
  1: "Band 5–6 level: accessible vocabulary, clear paragraph topics, mostly literal questions.",
  2: "Band 6–7 level: some academic vocabulary, denser argumentation, questions requiring paraphrase recognition.",
  3: "Band 7–9 level: sophisticated academic prose, abstract argumentation, subtle distinctions between answer options, heavy paraphrasing in questions.",
};

const QUESTION_TYPE_SPECS = `Question object shapes by type (all fields shown are REQUIRED for that type unless marked optional):

1. "mcq": { "id", "type": "mcq", "text": "<question>", "options": ["A  <option text>", "B  <option text>", "C  <option text>", "D  <option text>"], "answer": "<single uppercase letter>", "explanation": {...} }
   - Option strings are prefixed with the letter and two spaces, exactly like "A  Less than one percent".

2. "tfng": { "id", "type": "tfng", "text": "<statement>", "answer": "True" | "False" | "Not Given", "explanation": {...} }
   ("ynng" is identical but with "Yes" | "No" | "Not Given" — use for questions about the writer's claims/opinions.)

3. "matching_headings": group must have "sharedOptions": ["i    <heading>", "ii   <heading>", ...] (lowercase roman numeral prefix, padded with spaces). Each question: { "id", "type": "matching_headings", "paragraphLabel": "<A|B|C...>", "answer": "<roman numeral, e.g. iv>", "explanation": {...} }
   - Include at least 2 distractor headings beyond the number of questions.

4. "matching_info": { "id", "type": "matching_info", "text": "<description of information>", "answer": "<paragraph letter, e.g. C>", "explanation": {...} }

5. "sentence_completion": { "id", "type": "sentence_completion", "text": "<sentence with ________ blank>", "wordLimit": <1|2|3>, "answer": "<word(s) copied verbatim from the passage>", "answerVariants": ["<acceptable alternates>"], "explanation": {...} }
   - The answer MUST appear verbatim in the passage and MUST NOT exceed wordLimit words.

6. "summary_completion" (word-box variant): group has "sharedOptions": ["A  <word>", "B  <word>", ...] (8 lettered words including distractors). Each question: { "id", "type": "summary_completion", "text": "<summary sentence with ________ (Q<n>) blank>", "wordLimit": 1, "answer": "<letter>", "wordBox": ["A","B","C","D","E","F","G","H"], "explanation": {...} }

Every question carries an "explanation" object:
  { "paragraph": "<label of the paragraph containing the answer, e.g. B>",
    "quote": "<the exact sentence from that paragraph that contains/supports the answer, copied VERBATIM — character for character>",
    "en": "<2-3 sentence English explanation: how the question paraphrases the passage (name the paraphrase pairs, e.g. question says 'decline', passage says 'deteriorating'), and for mcq/tfng/ynng why each wrong option or alternative judgement fails>",
    "zh": "<the same explanation in natural Simplified Chinese, written for a Chinese IELTS learner — not a literal translation>" }`;

export function buildGenerationSystemPrompt(): string {
  return `You are an expert IELTS Academic Reading test writer producing practice material indistinguishable from official Cambridge IELTS papers.

You will be given a topic, a difficulty level, and a set of question types. Produce ONE complete reading passage with question groups.

PASSAGE REQUIREMENTS:
- 700–950 words of formal academic prose, in the style of a serious magazine or journal article.
- 5–8 paragraphs separated by ONE blank line (\\n\\n). Do NOT prefix paragraphs with letters or numbers — the app labels them A, B, C… automatically by position.
- Factually plausible, self-contained, neutral tone. Invent plausible researcher names/studies/statistics as real IELTS passages do.

QUESTION REQUIREMENTS:
- Question ids: "q1", "q2", … numbered sequentially across ALL groups.
- Group questions of the same type together with an IELTS-style instruction line.
- Questions must be answerable from the passage alone, with exactly one defensible answer each.
- Questions should test paraphrase recognition: restate passage content in different words rather than copying it.
- For tfng/ynng sets of 3+, include at least one "Not Given" — a statement that is plausible but genuinely not addressed in the passage.

${QUESTION_TYPE_SPECS}

OUTPUT FORMAT:
Return ONLY a single JSON object, no markdown fences, no commentary:
{
  "title": "<passage title>",
  "topicTags": ["<1-3 lowercase tags, e.g. science, history, environment>"],
  "passageText": "<full passage, paragraphs separated by \\n\\n>",
  "questionGroups": [ { "instruction": "<IELTS-style instruction>", "sharedOptions": [...] (only for matching_headings / summary_completion word box), "questions": [...] } ]
}`;
}

export function buildGenerationUserPrompt(opts: GenerationOptions): string {
  const count = opts.questionCount ?? 12;
  return `Topic: ${opts.topic}
Difficulty: ${opts.difficulty}/3 — ${DIFFICULTY_GUIDANCE[opts.difficulty]}
Question types to use: ${opts.questionTypes.join(", ")}
Total question count: ${count} (distribute across ${Math.min(opts.questionTypes.length, 3)} group(s))

Generate the passage and questions now. Return only the JSON object.`;
}

// ─── Claude call helpers ─────────────────────────────────────────────────────

export interface GenerationUsage {
  input_tokens: number;
  output_tokens: number;
}

function addUsage(total: GenerationUsage, usage: { input_tokens: number; output_tokens: number }) {
  total.input_tokens += usage.input_tokens;
  total.output_tokens += usage.output_tokens;
}

function extractJsonObject(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model output");
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function callClaude(
  anthropic: Anthropic,
  system: string,
  userContent: string,
  maxTokens: number
): Promise<{ text: string; usage: { input_tokens: number; output_tokens: number } }> {
  const stream = anthropic.messages.stream({
    model: GENERATION_MODEL,
    max_tokens: maxTokens,
    thinking: { type: "adaptive" },
    system,
    messages: [{ role: "user", content: userContent }],
  });
  const message = await stream.finalMessage();
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return {
    text,
    usage: {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
    },
  };
}

// ─── Generation (with one validation-feedback retry) ────────────────────────

export async function generatePassage(
  anthropic: Anthropic,
  opts: GenerationOptions
): Promise<{ passage: GeneratedPassage; usage: GenerationUsage; durationMs: number }> {
  const usage: GenerationUsage = { input_tokens: 0, output_tokens: 0 };
  const start = Date.now();
  const system = buildGenerationSystemPrompt();
  const userPrompt = buildGenerationUserPrompt(opts);

  let lastErrors: string[] = [];

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? userPrompt
        : `${userPrompt}

Your previous attempt failed validation with these errors:
${lastErrors.map((e) => `- ${e}`).join("\n")}

Fix every error and return the complete corrected JSON object.`;

    const { text, usage: callUsage } = await callClaude(anthropic, system, prompt, 32000);
    addUsage(usage, callUsage);

    let json: unknown;
    try {
      json = extractJsonObject(text);
    } catch (e) {
      lastErrors = [`Output was not valid JSON: ${e instanceof Error ? e.message : String(e)}`];
      continue;
    }

    const { passage, errors } = validateGeneratedPassage(json);
    if (passage) {
      return { passage, usage, durationMs: Date.now() - start };
    }
    lastErrors = errors;
  }

  throw new GenerationValidationError(lastErrors);
}

export class GenerationValidationError extends Error {
  errors: string[];
  constructor(errors: string[]) {
    super(`Generated passage failed validation:\n${errors.join("\n")}`);
    this.name = "GenerationValidationError";
    this.errors = errors;
  }
}

// ─── Self-check: model answers its own questions, compared against the key ──

export interface SelfCheckReport {
  agreementRate: number; // 0–1
  total: number;
  mismatches: { id: string; keyAnswer: string; modelAnswer: string }[];
}

/** Strip answers/explanations so the self-check model can't see the key. */
function stripAnswers(groups: GeneratedPassage["questionGroups"]) {
  return groups.map((g) => ({
    instruction: g.instruction,
    ...(g.sharedOptions ? { sharedOptions: g.sharedOptions } : {}),
    questions: g.questions.map((q) => {
      const { answer, answerVariants, explanation, ...rest } = q;
      void answer;
      void answerVariants;
      void explanation;
      return rest;
    }),
  }));
}

export async function runSelfCheck(
  anthropic: Anthropic,
  passage: GeneratedPassage
): Promise<{ report: SelfCheckReport; usage: GenerationUsage; durationMs: number }> {
  const start = Date.now();
  const labeled = labelParagraphs(passage.passageText)
    .map((p) => `${p.label}. ${p.text}`)
    .join("\n\n");

  const system = `You are an expert IELTS candidate. Answer every question about the passage. Return ONLY a JSON array, no commentary:
[{ "id": "<question id>", "answer": "<your answer>" }]
Answer formats: mcq → single uppercase letter; tfng → True/False/Not Given; ynng → Yes/No/Not Given; matching_headings → lowercase roman numeral; matching_info → paragraph letter; completion with a word box → the letter; other completion → the word(s) from the passage within the word limit.`;

  const userContent = `PASSAGE:
${labeled}

QUESTIONS:
${JSON.stringify(stripAnswers(passage.questionGroups), null, 2)}`;

  const { text, usage } = await callClaude(anthropic, system, userContent, 8000);

  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");
  if (arrStart === -1 || arrEnd <= arrStart) {
    throw new Error("Self-check output was not a JSON array");
  }
  const modelAnswers: { id: string; answer: string }[] = JSON.parse(
    text.slice(arrStart, arrEnd + 1)
  );
  const answerById = new Map(modelAnswers.map((a) => [a.id, String(a.answer)]));

  const mismatches: SelfCheckReport["mismatches"] = [];
  let total = 0;

  for (const group of passage.questionGroups) {
    for (const q of group.questions) {
      total++;
      const modelAnswer = answerById.get(q.id) ?? "";
      const asReadingQuestion = q as unknown as ReadingQuestion;
      let agrees = checkAnswerDeterministic(asReadingQuestion, modelAnswer);
      if (agrees === null) {
        // completion types: normalized equality against key + variants
        const ua = normalizeAnswer(modelAnswer);
        agrees =
          ua === normalizeAnswer(q.answer) ||
          (q.answerVariants ?? []).some((v) => normalizeAnswer(v) === ua);
      }
      if (!agrees) {
        mismatches.push({ id: q.id, keyAnswer: q.answer, modelAnswer });
      }
    }
  }

  return {
    report: {
      agreementRate: total === 0 ? 0 : (total - mismatches.length) / total,
      total,
      mismatches,
    },
    usage,
    durationMs: Date.now() - start,
  };
}

// ─── Backfill: explanations for existing passages (answers known) ───────────

export async function generateExplanationsForExisting(
  anthropic: Anthropic,
  passage: ReadingPassage
): Promise<{
  explanations: Record<string, AnswerExplanation>;
  errors: string[];
  usage: GenerationUsage;
}> {
  const usage: GenerationUsage = { input_tokens: 0, output_tokens: 0 };
  const paragraphs = labelParagraphs(passage.passageText);
  const labeled = paragraphs.map((p) => `${p.label}. ${p.text}`).join("\n\n");

  const system = `You are an expert IELTS reading tutor. For every question you are given (answers included), produce an answer-location explanation. Return ONLY a JSON array, no commentary:
[{ "id": "<question id>",
   "explanation": {
     "paragraph": "<label of the paragraph containing the answer, e.g. B>",
     "quote": "<the exact sentence from that paragraph containing/supporting the answer, copied VERBATIM — character for character, including punctuation>",
     "en": "<2-3 sentence English explanation: how the question paraphrases the passage (name the paraphrase pairs), and for mcq/tfng why the wrong options or judgements fail>",
     "zh": "<the same explanation in natural Simplified Chinese for a Chinese IELTS learner>"
   } }]`;

  const questionsPayload = passage.questionGroups.map((g: QuestionGroup) => ({
    instruction: g.instruction,
    ...(g.sharedOptions ? { sharedOptions: g.sharedOptions } : {}),
    questions: g.questions,
  }));

  const buildUserContent = (retryErrors?: string[]) =>
    `PASSAGE (paragraph labels shown are how the app displays them):
${labeled}

QUESTIONS WITH ANSWER KEY:
${JSON.stringify(questionsPayload, null, 2)}${
      retryErrors
        ? `

Your previous attempt had these errors — fix them and return the complete corrected array:
${retryErrors.map((e) => `- ${e}`).join("\n")}`
        : ""
    }`;

  const allIds = passage.questionGroups.flatMap((g) => g.questions.map((q) => q.id));
  let explanations: Record<string, AnswerExplanation> = {};
  let errors: string[] = [];

  for (let attempt = 0; attempt < 2; attempt++) {
    const { text, usage: callUsage } = await callClaude(
      anthropic,
      system,
      buildUserContent(attempt > 0 ? errors : undefined),
      16000
    );
    addUsage(usage, callUsage);

    errors = [];
    explanations = {};

    let items: { id: string; explanation: AnswerExplanation }[];
    try {
      const arrStart = text.indexOf("[");
      const arrEnd = text.lastIndexOf("]");
      items = JSON.parse(text.slice(arrStart, arrEnd + 1));
    } catch {
      errors = ["Output was not a valid JSON array"];
      continue;
    }

    for (const item of items) {
      const parsed = explanationSchema.safeParse(item.explanation);
      if (!parsed.success) {
        errors.push(`Question ${item.id}: malformed explanation object`);
        continue;
      }
      const itemErrors: string[] = [];
      validateExplanation(parsed.data, item.id, paragraphs, itemErrors);
      if (itemErrors.length > 0) {
        errors.push(...itemErrors);
        continue;
      }
      explanations[item.id] = parsed.data;
    }

    for (const id of allIds) {
      if (!(id in explanations) && !errors.some((e) => e.includes(`Question ${id}`))) {
        errors.push(`Question ${id}: no explanation returned`);
      }
    }

    if (errors.length === 0) break;
  }

  return { explanations, errors, usage };
}

// ─── Merge helpers ───────────────────────────────────────────────────────────

/** Convert a validated GeneratedPassage's groups into the DB question_groups shape. */
export function toQuestionGroups(passage: GeneratedPassage): QuestionGroup[] {
  return passage.questionGroups as unknown as QuestionGroup[];
}

export function mergeExplanations(
  questionGroups: QuestionGroup[],
  explanations: Record<string, AnswerExplanation>
): QuestionGroup[] {
  return questionGroups.map((g) => ({
    ...g,
    questions: g.questions.map((q) =>
      explanations[q.id] ? { ...q, explanation: explanations[q.id] } : q
    ),
  }));
}
