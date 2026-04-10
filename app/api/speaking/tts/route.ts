import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { logApiCall, estimateTtsCost } from "@/lib/api-logger";

const openai = new OpenAI();

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const startTime = Date.now();

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const arrayBuffer = await response.arrayBuffer();
    const durationMs = Date.now() - startTime;

    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "tts",
      model: "tts-1",
      estimatedCostUsd: estimateTtsCost(text.length),
      durationMs,
      metadata: { charCount: text.length },
    });

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
