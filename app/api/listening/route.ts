import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { checkListeningUsage, incrementListeningUsage } from "@/lib/usage";
import { logApiCall } from "@/lib/api-logger";
import { LISTENING_TRACKS, getTotalListeningQuestions, rawToListeningBand } from "@/lib/listening-tracks";
import {
  checkAnswerDeterministic,
  normalizeAnswer,
  type QuestionResult,
  type ScoredResults,
} from "@/lib/reading-scoring";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const {
    trackId,
    answers,
    feedbackLanguage,
  }: {
    trackId: string;
    answers: Record<string, string>;
    feedbackLanguage: "en" | "zh";
  } = await request.json();

  if (!trackId || !answers) {
    return NextResponse.json(
      { error: "Missing trackId or answers" },
      { status: 400 }
    );
  }

  const track = LISTENING_TRACKS.find((t) => t.id === trackId);
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const usage = await checkListeningUsage(supabase, user.id);
      if (!usage.allowed) {
        return NextResponse.json(
          {
            error: "daily_limit_reached",
            message: `You've used ${usage.used}/${usage.limit} free listening sessions today. Upgrade to Pro for unlimited access.`,
            used: usage.used,
            limit: usage.limit,
          },
          { status: 429 }
        );
      }
    }

    // ── Step 0: Save draft ────────────────────────────────────────────────
    let submissionId: string | null = null;
    if (user) {
      const { data: submission, error: subError } = await supabase
        .from("listening_submissions")
        .insert({
          user_id: user.id,
          track_slug: track.id,
          track_title: track.title,
          section: track.section,
          answers_json: answers,
          status: "draft",
        })
        .select("id")
        .single();

      if (subError) {
        console.error("Failed to save draft listening submission:", subError);
      } else {
        submissionId = submission.id;
      }
    }

    // ── Step 1: Score all questions ───────────────────────────────────────
    const allQuestions = track.questionGroups.flatMap((g) => g.questions);
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
        const correctAnswer = q.answer;

        results[q.id] = {
          correct: correct ?? false,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          explanation: correct
            ? ""
            : buildExplanation(correctAnswer, feedbackLanguage),
        };
      }
    }

    // ── Step 2: AI scoring for fill-in questions ──────────────────────────
    let aiUsage: { input_tokens: number; output_tokens: number } | undefined;
    const startTime = Date.now();
    let durationMs = 0;

    if (fillInQuestions.length > 0) {
      const attemptedFillIn = fillInQuestions.filter(
        (q) => q.userAnswer.trim().length > 0
      );

      const systemPrompt =
        feedbackLanguage === "zh"
          ? `你是一位雅思听力考官。请根据以下规则，对每个填空题的答案进行判断，并以JSON数组形式返回结果：
[{ "id": "q_id", "correct": true/false, "explanation": "一句话说明正确答案" }]
规则：
- 接受与标准答案完全匹配的答案或可接受的同义词
- 超出字数限制的答案一律判错（即使意思正确）
- 不接受改变词性的同义词替换
- 空白答案判错`
          : `You are an IELTS listening examiner. Evaluate each fill-in-the-blank answer and return a JSON array:
[{ "id": "q_id", "correct": true/false, "explanation": "One sentence stating the correct answer" }]
Rules:
- Accept exact matches or close synonyms/alternate spellings
- Answers exceeding the word limit are WRONG even if the meaning is correct
- Do not accept paraphrases that change grammatical category
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
          max_tokens: 600,
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
      }

      // Fall back to exact match for any unscored fill-ins
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

    // ── Step 3: Compute scores ────────────────────────────────────────────
    const totalQuestions = getTotalListeningQuestions(track);
    const rawScore = Object.values(results).filter((r) => r.correct).length;
    const bandScore = rawToListeningBand(rawScore);

    // ── Step 4: Log API usage ─────────────────────────────────────────────
    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "listening_score",
      model: "claude-sonnet-4-20250514",
      inputTokens: aiUsage?.input_tokens,
      outputTokens: aiUsage?.output_tokens,
      durationMs: durationMs || Date.now() - startTime,
      metadata: {
        trackId,
        trackTitle: track.title,
        totalQuestions,
        rawScore,
        bandScore,
        hasFillIn: fillInQuestions.length > 0,
      },
    });

    // ── Step 5: Save feedback and mark completed ──────────────────────────
    if (user && submissionId) {
      await supabase.from("listening_feedback").insert({
        submission_id: submissionId,
        raw_score: rawScore,
        total_questions: totalQuestions,
        band_score: bandScore,
        question_results: results,
      });

      await supabase
        .from("listening_submissions")
        .update({ status: "completed" })
        .eq("id", submissionId);

      await incrementListeningUsage(supabase, user.id);
    }

    return NextResponse.json({
      submission_id: submissionId,
      raw_score: rawScore,
      total_questions: totalQuestions,
      band_score: bandScore,
      question_results: results,
    });
  } catch (error) {
    console.error("Listening scoring error:", error);

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await logApiCall({
        supabase,
        userId: user?.id ?? null,
        callType: "listening_score",
        model: "claude-sonnet-4-20250514",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: { trackId },
      });
    } catch {
      // Don't let error logging break the error response
    }

    return NextResponse.json(
      { error: "Failed to score listening. Please try again." },
      { status: 500 }
    );
  }
}

function buildExplanation(correctAnswer: string, lang: "en" | "zh"): string {
  if (lang === "zh") {
    return `正确答案是：${correctAnswer}。`;
  }
  return `The correct answer is: ${correctAnswer}.`;
}
