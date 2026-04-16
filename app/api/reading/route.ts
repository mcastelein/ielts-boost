import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkReadingUsage, incrementReadingUsage } from "@/lib/usage";
import { logApiCall } from "@/lib/api-logger";
import { READING_PASSAGES, getTotalQuestions } from "@/lib/reading-passages";
import {
  checkAnswerDeterministic,
  rawToBand,
  normalizeAnswer,
  type QuestionResult,
  type ScoredResults,
} from "@/lib/reading-scoring";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const {
    passageId,
    answers,
    timeUsedSeconds,
    feedbackLanguage,
  }: {
    passageId: string;
    answers: Record<string, string>;
    timeUsedSeconds: number | null;
    feedbackLanguage: "en" | "zh";
  } = await request.json();

  if (!passageId || !answers) {
    return NextResponse.json(
      { error: "Missing passageId or answers" },
      { status: 400 }
    );
  }

  const passage = READING_PASSAGES.find((p) => p.id === passageId);
  if (!passage) {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check usage limits for authenticated users
    if (user) {
      const usage = await checkReadingUsage(supabase, user.id);
      if (!usage.allowed) {
        return NextResponse.json(
          {
            error: "daily_limit_reached",
            message: `You've used ${usage.used}/${usage.limit} free reading sessions today. Upgrade to Pro for unlimited access.`,
            used: usage.used,
            limit: usage.limit,
          },
          { status: 429 }
        );
      }
    }

    // ── Step 0: Save draft immediately so the submission is never lost ──────
    let submissionId: string | null = null;
    if (user) {
      const { data: submission, error: subError } = await supabase
        .from("reading_submissions")
        .insert({
          user_id: user.id,
          passage_slug: passage.id,
          passage_title: passage.title,
          exam_type: passage.examType,
          answers_json: answers,
          time_used_seconds: timeUsedSeconds ?? null,
          status: "draft",
        })
        .select("id")
        .single();

      if (subError) {
        console.error("Failed to save draft reading submission:", subError);
      } else {
        submissionId = submission.id;
      }
    }

    // ── Step 1: Deterministic scoring ────────────────────────────────────────
    const allQuestions = passage.questionGroups.flatMap((g) => g.questions);
    const results: ScoredResults = {};
    const fillInQuestions: {
      id: string;
      userAnswer: string;
      correctAnswer: string;
      wordLimit: number;
      answerVariants: string[];
      sentenceContext: string;
    }[] = [];

    for (const q of allQuestions) {
      const userAnswer = answers[q.id] ?? "";

      if (q.type === "sentence_completion" || q.type === "summary_completion") {
        // Collect for Claude batch
        fillInQuestions.push({
          id: q.id,
          userAnswer,
          correctAnswer: q.answer,
          wordLimit: q.wordLimit,
          answerVariants: q.answerVariants ?? [],
          sentenceContext: q.text,
        });
      } else {
        const correct = checkAnswerDeterministic(q, userAnswer);
        const correctAnswer =
          q.type === "mcq" ? q.answer : q.type === "matching_headings" ? q.answer : q.answer;

        results[q.id] = {
          correct: correct ?? false,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          explanation: correct
            ? ""
            : buildDeterministicExplanation(q.type, correctAnswer, feedbackLanguage),
        };
      }
    }

    // ── Step 2: AI scoring for fill-in questions ──────────────────────────────
    let aiUsage: { input_tokens: number; output_tokens: number } | undefined;
    const startTime = Date.now();
    let durationMs = 0;

    if (fillInQuestions.length > 0) {
      const attemptedFillIn = fillInQuestions.filter(
        (q) => q.userAnswer.trim().length > 0
      );

      // Score fill-ins with Claude (single batch call)
      const systemPrompt =
        feedbackLanguage === "zh"
          ? `你是一位雅思阅读考官。请根据以下规则，对每个填空题的答案进行判断，并以JSON数组形式返回结果：
[{ "id": "q_id", "correct": true/false, "explanation": "一句话说明，引用文章中的相关段落" }]
规则：
- 接受与标准答案完全匹配的答案或可接受的同义词
- 超出字数限制的答案一律判错（即使意思正确）
- 不接受改变词性的同义词替换（如"pollution"不能替换"polluted"）
- 对于摘要填空题，答案是字母选项（如"A"、"B"），只需检查字母是否匹配
- 空白答案判错`
          : `You are an IELTS reading examiner. Evaluate each fill-in-the-blank answer and return a JSON array:
[{ "id": "q_id", "correct": true/false, "explanation": "One sentence citing the relevant part of the passage" }]
Rules:
- Accept exact matches to the answer key or close synonyms
- Answers exceeding the word limit are WRONG even if the meaning is correct
- Do not accept paraphrases that change grammatical category (e.g. "pollute" for "pollution")
- For summary completion with letter options (A, B, C...), just check if the letter matches
- Blank answers are wrong`;

      const questionsPayload = attemptedFillIn.map((q) => ({
        id: q.id,
        userAnswer: q.userAnswer,
        correctAnswer: q.correctAnswer,
        wordLimit: q.wordLimit,
        answerVariants: q.answerVariants,
        sentenceContext: q.sentenceContext,
      }));

      try {
        const aiStart = Date.now();
        const message = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `Evaluate these fill-in answers:\n${JSON.stringify(questionsPayload, null, 2)}`,
            },
          ],
        });
        durationMs = Date.now() - aiStart;
        aiUsage = message.usage;

        const rawText =
          message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const aiResults: Array<{
            id: string;
            correct: boolean;
            explanation: string;
          }> = JSON.parse(jsonMatch[0]);

          for (const r of aiResults) {
            const q = fillInQuestions.find((fq) => fq.id === r.id);
            if (q) {
              results[r.id] = {
                correct: r.correct,
                user_answer: q.userAnswer,
                correct_answer: q.correctAnswer,
                explanation: r.explanation,
              };
            }
          }
        }
      } catch (aiError) {
        console.error("AI scoring error:", aiError);
        // Fall back to exact match scoring for fill-ins
      }

      // Mark any unanswered fill-ins as incorrect
      for (const q of fillInQuestions) {
        if (!results[q.id]) {
          const ua = normalizeAnswer(q.userAnswer);
          const correct = normalizeAnswer(q.correctAnswer);
          const isCorrect =
            ua === correct ||
            q.answerVariants.some((v) => normalizeAnswer(v) === ua);
          results[q.id] = {
            correct: isCorrect,
            user_answer: q.userAnswer,
            correct_answer: q.correctAnswer,
            explanation: isCorrect
              ? ""
              : feedbackLanguage === "zh"
              ? `正确答案是：${q.correctAnswer}`
              : `The correct answer is: ${q.correctAnswer}`,
          };
        }
      }
    }

    // ── Step 3: Compute scores ────────────────────────────────────────────────
    const totalQuestions = getTotalQuestions(passage);
    const rawScore = Object.values(results).filter((r) => r.correct).length;
    const bandScore = rawToBand(rawScore);

    // ── Step 4: Log API usage ─────────────────────────────────────────────────
    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "reading_score",
      model: "claude-sonnet-4-20250514",
      inputTokens: aiUsage?.input_tokens,
      outputTokens: aiUsage?.output_tokens,
      durationMs: durationMs || Date.now() - startTime,
      metadata: {
        passageId,
        passageTitle: passage.title,
        totalQuestions,
        rawScore,
        bandScore,
        hasFillIn: fillInQuestions.length > 0,
      },
    });

    // ── Step 5: Save feedback and mark submission as completed ──────────────
    if (user && submissionId) {
      const { error: fbError } = await supabase
        .from("reading_feedback")
        .insert({
          submission_id: submissionId,
          raw_score: rawScore,
          total_questions: totalQuestions,
          band_score: bandScore,
          question_results: results,
        });

      if (fbError) {
        console.error("Failed to save reading feedback:", fbError);
      }

      // Mark as completed
      await supabase
        .from("reading_submissions")
        .update({ status: "completed" })
        .eq("id", submissionId);

      await incrementReadingUsage(supabase, user.id);
    }

    return NextResponse.json({
      submission_id: submissionId,
      raw_score: rawScore,
      total_questions: totalQuestions,
      band_score: bandScore,
      question_results: results,
    });
  } catch (error) {
    console.error("Reading scoring error:", error);

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await logApiCall({
        supabase,
        userId: user?.id ?? null,
        callType: "reading_score",
        model: "claude-sonnet-4-20250514",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: { passageId },
      });
    } catch {
      // Don't let error logging break the error response
    }

    return NextResponse.json(
      { error: "Failed to score reading. Please try again." },
      { status: 500 }
    );
  }
}

function buildDeterministicExplanation(
  type: string,
  correctAnswer: string,
  lang: "en" | "zh"
): string {
  if (lang === "zh") {
    switch (type) {
      case "tfng":
      case "ynng":
        return `正确答案是：${correctAnswer}。请再次阅读文章中的相关内容。`;
      case "matching_headings":
        return `正确标题是选项 ${correctAnswer.toUpperCase()}。`;
      case "matching_info":
        return `正确答案是段落 ${correctAnswer.toUpperCase()}。`;
      default:
        return `正确答案是：${correctAnswer}。`;
    }
  }
  switch (type) {
    case "tfng":
    case "ynng":
      return `The correct answer is ${correctAnswer}. Re-read the relevant section of the passage.`;
    case "matching_headings":
      return `The correct heading is option ${correctAnswer.toUpperCase()}.`;
    case "matching_info":
      return `The information is in paragraph ${correctAnswer.toUpperCase()}.`;
    default:
      return `The correct answer is: ${correctAnswer}.`;
  }
}
