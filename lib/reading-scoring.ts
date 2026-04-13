import type { ReadingQuestion } from "./reading-passages";

// ─── Band Score Conversion (Academic) ────────────────────────────────────────
// Source: publicly available IELTS band descriptor conversion tables
const ACADEMIC_BAND_TABLE: [number, number][] = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [33, 7.5],
  [30, 7.0],
  [27, 6.5],
  [23, 6.0],
  [19, 5.5],
  [15, 5.0],
  [13, 4.5],
  [10, 4.0],
  [8, 3.5],
  [6, 3.0],
  [4, 2.5],
];

export function rawToBand(rawScore: number): number {
  for (const [threshold, band] of ACADEMIC_BAND_TABLE) {
    if (rawScore >= threshold) return band;
  }
  return 2.0;
}

// ─── Answer Normalisation ─────────────────────────────────────────────────────

export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,;:!?]$/, "");
}

// ─── Deterministic Scoring ───────────────────────────────────────────────────

/**
 * Returns true/false for question types that can be scored without AI.
 * Returns null for sentence_completion / summary_completion (needs Claude).
 */
export function checkAnswerDeterministic(
  question: ReadingQuestion,
  userAnswer: string
): boolean | null {
  const ua = normalizeAnswer(userAnswer);

  switch (question.type) {
    case "mcq": {
      // Accept just the letter (e.g. "A") or the full option text
      const correctLetter = normalizeAnswer(question.answer);
      const userLetter = ua.charAt(0); // first char of trimmed answer
      return userLetter === correctLetter || ua === correctLetter;
    }

    case "tfng":
    case "ynng": {
      const correct = normalizeAnswer(question.answer);
      // Accept common abbreviations: t/f/ng/y/n
      const aliases: Record<string, string[]> = {
        true: ["true", "t"],
        false: ["false", "f"],
        "not given": ["not given", "ng", "not given"],
        yes: ["yes", "y"],
        no: ["no", "n"],
      };
      const acceptedForms = aliases[correct] ?? [correct];
      return acceptedForms.includes(ua);
    }

    case "matching_headings": {
      // Answer is a Roman numeral like "iii" or "vii"
      const correct = normalizeAnswer(question.answer);
      return ua === correct || ua === correct.toLowerCase();
    }

    case "matching_info": {
      // Answer is a paragraph letter like "B" or "E"
      const correct = normalizeAnswer(question.answer);
      return ua === correct || ua.toUpperCase() === correct.toUpperCase();
    }

    case "sentence_completion":
    case "summary_completion":
      // Defer to Claude
      return null;

    default:
      return null;
  }
}

// ─── Types for scored results ────────────────────────────────────────────────

export interface QuestionResult {
  correct: boolean;
  user_answer: string;
  correct_answer: string;
  explanation: string;
}

export type ScoredResults = Record<string, QuestionResult>;
