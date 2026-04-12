import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { logApiCall, estimateWhisperCost } from "@/lib/api-logger";

const openai = new OpenAI();

export async function POST(request: Request) {
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File | null;

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const startTime = Date.now();

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: "en",
    });

    const durationMs = Date.now() - startTime;
    // Rough estimate: assume 1 second of audio per KB of file size
    const estimatedDurationSec = audioFile.size / 16000;

    await logApiCall({
      supabase,
      userId: user?.id ?? null,
      callType: "transcribe",
      model: "whisper-1",
      estimatedCostUsd: estimateWhisperCost(estimatedDurationSec),
      durationMs,
      metadata: { fileSizeBytes: audioFile.size },
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await logApiCall({
        supabase,
        userId: user?.id ?? null,
        callType: "transcribe",
        model: "whisper-1",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    } catch {
      // Don't let error logging break the error response
    }

    return NextResponse.json(
      { error: "Failed to transcribe audio. Please try again." },
      { status: 500 }
    );
  }
}
