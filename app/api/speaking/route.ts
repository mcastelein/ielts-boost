import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { logApiCall } from "@/lib/api-logger";
import { checkSpeakingUsage, incrementSpeakingUsage } from "@/lib/usage";

const anthropic = new Anthropic();

const SPEAKING_SYSTEM_PROMPT_EN = `You are an IELTS speaking examiner. Evaluate the candidate's response and return your assessment as valid JSON only — no markdown, no code fences, no extra text.

Return this exact JSON structure:
{
  "estimated_band": <number 0-9, can use .5>,
  "fluency_score": <number 0-9, can use .5>,
  "lexical_score": <number 0-9, can use .5>,
  "grammar_score": <number 0-9, can use .5>,
  "pronunciation_score": <number 0-9, can use .5>,
  "fluency_coherence": "<brief assessment>",
  "lexical_resource": "<brief assessment>",
  "grammar_range": "<brief assessment>",
  "pronunciation_note": "<note that this is text-based so pronunciation cannot be fully assessed, estimate based on word choice and phrasing>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "improved_response": "<a stronger version of their answer>",
  "better_phrases": ["<phrase 1>", "<phrase 2>", "<phrase 3>"],
  "follow_up_question": "<a natural follow-up question an IELTS examiner might ask next, based on the candidate's response>"
}

Be constructive and specific. Do not claim this is an official IELTS score.`;

const SPEAKING_SYSTEM_PROMPT_ZH = `你是一名雅思口语考官。请评估考生的回答，并以有效的JSON格式返回你的评估——不要使用markdown格式，不要使用代码块，只返回JSON。

返回以下JSON结构：
{
  "estimated_band": <0-9的数字，可以用.5>,
  "fluency_score": <0-9的数字，可以用.5>,
  "lexical_score": <0-9的数字，可以用.5>,
  "grammar_score": <0-9的数字，可以用.5>,
  "pronunciation_score": <0-9的数字，可以用.5>,
  "fluency_coherence": "<流利度与连贯性的简要评估>",
  "lexical_resource": "<词汇资源的简要评估>",
  "grammar_range": "<语法范围与准确性的简要评估>",
  "pronunciation_note": "<说明这是基于文字的评估，发音分数根据用词和表达方式估算>",
  "strengths": ["<优点1>", "<优点2>"],
  "weaknesses": ["<不足1>", "<不足2>"],
  "improved_response": "<一个更好的回答版本>",
  "better_phrases": ["<更好的表达1>", "<更好的表达2>", "<更好的表达3>"],
  "follow_up_question": "<考官可能会根据考生回答提出的自然追问>"
}

请用清晰、自然、适合学生理解的中文表达。不要声称这是官方雅思评分。`;

export async function POST(request: Request) {
  const { prompt, response, part, feedbackLanguage = "en", draft_id } = await request.json();

  if (!prompt || !response) {
    return NextResponse.json(
      { error: "Missing prompt or response" },
      { status: 400 }
    );
  }

  const systemPrompt = feedbackLanguage === "zh" ? SPEAKING_SYSTEM_PROMPT_ZH : SPEAKING_SYSTEM_PROMPT_EN;

  try {
    // Check usage limits
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const usage = await checkSpeakingUsage(supabase, user.id);
      if (!usage.allowed) {
        return NextResponse.json(
          {
            error: "daily_limit_reached",
            message: `You've used ${usage.used}/${usage.limit} free speaking submissions today. Upgrade to Pro for unlimited access.`,
            used: usage.used,
            limit: usage.limit,
          },
          { status: 429 }
        );
      }
    }

    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `IELTS Speaking Part ${part}\n\nQuestion: ${prompt}\n\nCandidate's Response:\n${response}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response");
    }

    const durationMs = Date.now() - startTime;
    const feedback = JSON.parse(textBlock.text);

    // Save to DB if authenticated
    let submissionId: string | null = null;
    if (user) {
      // If we have a draft, update it; otherwise insert a new row
      let finalSubmissionId: string | null = null;

      if (draft_id) {
        // Update existing draft to completed
        const { data: updated, error: updateError } = await supabase
          .from("speaking_submissions")
          .update({ response_text: response, status: "completed" })
          .eq("id", draft_id)
          .eq("user_id", user.id)
          .select("id")
          .single();

        if (updateError) {
          console.error("Failed to update draft:", updateError.message);
        } else {
          finalSubmissionId = updated.id;
        }
      }

      // If no draft or draft update failed, insert a new row
      if (!finalSubmissionId) {
        const submissionRow: Record<string, unknown> = {
          user_id: user.id,
          prompt,
          response_text: response,
          status: "completed",
        };
        if (part != null) submissionRow.part = part;

        let { data: submission, error: subError } = await supabase
          .from("speaking_submissions")
          .insert(submissionRow)
          .select("id")
          .single();

        // If insert failed (likely due to missing column), retry without optional columns
        if (subError && part != null) {
          console.warn("Speaking submission insert failed, retrying without part column:", subError.message);
          ({ data: submission, error: subError } = await supabase
            .from("speaking_submissions")
            .insert({ user_id: user.id, prompt, response_text: response, status: "completed" })
            .select("id")
            .single());
        }

        if (subError) {
          console.error("Speaking submission insert failed:", subError.message);
        }

        if (submission) {
          finalSubmissionId = submission.id;
        }
      }

      if (finalSubmissionId) {
        submissionId = finalSubmissionId;

        const feedbackRow: Record<string, unknown> = {
          submission_id: finalSubmissionId,
          feedback_json: feedback,
        };
        // Only include extra columns if they have values — they may not exist in DB yet
        if (feedback.estimated_band != null) feedbackRow.estimated_band = feedback.estimated_band;
        if (feedback.fluency_score != null) feedbackRow.fluency_score = feedback.fluency_score;
        if (feedback.lexical_score != null) feedbackRow.lexical_score = feedback.lexical_score;
        if (feedback.grammar_score != null) feedbackRow.grammar_score = feedback.grammar_score;
        if (feedback.pronunciation_score != null) feedbackRow.pronunciation_score = feedback.pronunciation_score;

        const { error: fbError } = await supabase.from("speaking_feedback").insert(feedbackRow);

        // If feedback insert failed (likely missing columns), retry with just the original columns
        if (fbError) {
          console.warn("Speaking feedback insert failed, retrying with minimal columns:", fbError.message);
          const { error: fbRetryError } = await supabase.from("speaking_feedback").insert({
            submission_id: finalSubmissionId,
            feedback_json: feedback,
          });
          if (fbRetryError) {
            console.error("Speaking feedback insert failed on retry:", fbRetryError.message);
          }
        }
      }

      // Increment speaking usage counter
      await incrementSpeakingUsage(supabase, user.id);
    }

    // Log API usage
    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "speaking_score",
      model: "claude-sonnet-4-20250514",
      inputTokens: message.usage?.input_tokens,
      outputTokens: message.usage?.output_tokens,
      durationMs,
      metadata: { part, feedbackLanguage },
    });

    return NextResponse.json({ ...feedback, submission_id: submissionId });
  } catch (error) {
    console.error("Speaking scoring error:", error);

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await logApiCall({
        supabase,
        userId: user?.id ?? null,
        callType: "speaking_score",
        model: "claude-sonnet-4-20250514",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: { part, feedbackLanguage },
      });
    } catch {
      // Don't let error logging break the error response
    }

    return NextResponse.json(
      { error: "Failed to evaluate response. Please try again." },
      { status: 500 }
    );
  }
}
