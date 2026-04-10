import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { logApiCall } from "@/lib/api-logger";

const anthropic = new Anthropic();

const SPEAKING_SYSTEM_PROMPT = `You are an IELTS speaking examiner. Evaluate the candidate's response and return your assessment as valid JSON only — no markdown, no code fences, no extra text.

Return this exact JSON structure:
{
  "estimated_band": <number 0-9, can use .5>,
  "fluency_coherence": "<brief assessment>",
  "lexical_resource": "<brief assessment>",
  "grammar_range": "<brief assessment>",
  "pronunciation_note": "<note that this is text-based so pronunciation cannot be assessed>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "improved_response": "<a stronger version of their answer>",
  "better_phrases": ["<phrase 1>", "<phrase 2>", "<phrase 3>"],
  "follow_up_question": "<a natural follow-up question an IELTS examiner might ask next, based on the candidate's response>"
}

Be constructive and specific. Do not claim this is an official IELTS score.`;

export async function POST(request: Request) {
  const { prompt, response, part } = await request.json();

  if (!prompt || !response) {
    return NextResponse.json(
      { error: "Missing prompt or response" },
      { status: 400 }
    );
  }

  try {
    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SPEAKING_SYSTEM_PROMPT,
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let submissionId: string | null = null;
    if (user) {
      const { data: submission } = await supabase
        .from("speaking_submissions")
        .insert({
          user_id: user.id,
          prompt,
          response_text: response,
        })
        .select("id")
        .single();

      if (submission) {
        submissionId = submission.id;
        await supabase.from("speaking_feedback").insert({
          submission_id: submission.id,
          feedback_json: feedback,
        });
      }
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
      metadata: { part },
    });

    return NextResponse.json({ ...feedback, submission_id: submissionId });
  } catch (error) {
    console.error("Speaking scoring error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate response. Please try again." },
      { status: 500 }
    );
  }
}
