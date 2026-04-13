import { NextResponse } from "next/server";
import { scoreEssay } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { checkWritingUsage, incrementWritingUsage } from "@/lib/usage";
import { logApiCall } from "@/lib/api-logger";

export async function POST(request: Request) {
  const { essay, taskType, feedbackLanguage, inputType, promptTopic, promptText, timeUsedSeconds } = await request.json();

  if (!essay || !taskType) {
    return NextResponse.json(
      { error: "Missing essay or taskType" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check usage limits for authenticated users
    if (user) {
      const usage = await checkWritingUsage(supabase, user.id);
      if (!usage.allowed) {
        return NextResponse.json(
          {
            error: "daily_limit_reached",
            message: `You've used ${usage.used}/${usage.limit} free submissions today. Upgrade to Pro for unlimited access.`,
            used: usage.used,
            limit: usage.limit,
          },
          { status: 429 }
        );
      }
    }

    // Score the essay
    const startTime = Date.now();
    const feedback = await scoreEssay(essay, taskType, feedbackLanguage, promptText || undefined);
    const durationMs = Date.now() - startTime;

    // Log API usage
    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "writing_score",
      model: "claude-sonnet-4-20250514",
      inputTokens: feedback._usage?.input_tokens,
      outputTokens: feedback._usage?.output_tokens,
      durationMs,
      metadata: { taskType, feedbackLanguage, inputType: inputType || "text" },
    });

    // Save submission and feedback if user is authenticated
    let submissionId: string | null = null;
    if (user) {
      const { data: submission, error: subError } = await supabase
        .from("writing_submissions")
        .insert({
          user_id: user.id,
          input_type: inputType || "text",
          final_text: essay,
          task_type: taskType,
          prompt_topic: promptTopic || null,
          prompt_text: promptText || null,
          time_used_seconds: timeUsedSeconds || null,
        })
        .select("id")
        .single();

      if (subError) {
        console.error("Failed to save submission:", subError);
      } else {
        submissionId = submission.id;

        const { error: fbError } = await supabase
          .from("writing_feedback")
          .insert({
            submission_id: submission.id,
            overall_band: feedback.overall_band,
            task_score: feedback.task_score,
            coherence_score: feedback.coherence_score,
            lexical_score: feedback.lexical_score,
            grammar_score: feedback.grammar_score,
            feedback_json: feedback.feedback,
          });

        if (fbError) {
          console.error("Failed to save feedback:", fbError);
        }

        // Increment usage counter
        await incrementWritingUsage(supabase, user.id);
      }
    }

    return NextResponse.json({ ...feedback, submission_id: submissionId });
  } catch (error) {
    console.error("Scoring error:", error);

    // Log the failed call
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await logApiCall({
        supabase,
        userId: user?.id ?? null,
        callType: "writing_score",
        model: "claude-sonnet-4-20250514",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: { taskType, feedbackLanguage },
      });
    } catch {
      // Don't let error logging break the error response
    }

    return NextResponse.json(
      { error: "Failed to score essay. Please try again." },
      { status: 500 }
    );
  }
}
