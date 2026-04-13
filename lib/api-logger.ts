import { SupabaseClient } from "@supabase/supabase-js";

// Approximate costs per model
const COST_RATES: Record<string, { input: number; output: number }> = {
  // Claude Sonnet: $3/M input, $15/M output
  "claude-sonnet-4-20250514": { input: 3 / 1_000_000, output: 15 / 1_000_000 },
  // Whisper: ~$0.006 per minute, estimated via duration
  "whisper-1": { input: 0, output: 0 },
  // TTS: $15/M chars
  "tts-1": { input: 15 / 1_000_000, output: 0 },
};

export type ApiCallType =
  | "writing_score"
  | "ocr"
  | "speaking_score"
  | "transcribe"
  | "tts"
  | "reading_score";

interface LogApiCallParams {
  supabase: SupabaseClient;
  userId: string | null;
  callType: ApiCallType;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostUsd?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  success?: boolean;
  errorMessage?: string;
}

export async function logApiCall({
  supabase,
  userId,
  callType,
  model,
  inputTokens,
  outputTokens,
  estimatedCostUsd,
  durationMs,
  metadata,
  success = true,
  errorMessage,
}: LogApiCallParams) {
  // Calculate cost if not provided
  let cost = estimatedCostUsd;
  if (cost === undefined && inputTokens !== undefined && outputTokens !== undefined) {
    const rates = COST_RATES[model];
    if (rates) {
      cost = inputTokens * rates.input + outputTokens * rates.output;
    }
  }

  const logMetadata = {
    ...metadata,
    success,
    ...(errorMessage ? { error: errorMessage } : {}),
  };

  try {
    await supabase.from("api_usage_log").insert({
      user_id: userId,
      call_type: callType,
      model,
      input_tokens: inputTokens ?? null,
      output_tokens: outputTokens ?? null,
      estimated_cost_usd: cost ?? null,
      duration_ms: durationMs ?? null,
      metadata: logMetadata,
    });
  } catch (error) {
    // Don't let logging failures break the main flow
    console.error("Failed to log API call:", error);
  }
}

// Helper to estimate Whisper cost from audio duration in seconds
export function estimateWhisperCost(durationSeconds: number): number {
  return (durationSeconds / 60) * 0.006;
}

// Helper to estimate TTS cost from character count
export function estimateTtsCost(charCount: number): number {
  return charCount * (15 / 1_000_000);
}
