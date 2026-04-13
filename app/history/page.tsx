import { createClient } from "@/lib/supabase/server";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <HistoryClient writingItems={[]} speakingItems={[]} readingItems={[]} authenticated={false} />;
  }

  const [writingResult, speakingResult, readingResult] = await Promise.all([
    supabase
      .from("writing_submissions")
      .select("id, task_type, input_type, prompt_topic, prompt_text, time_used_seconds, created_at, writing_feedback(overall_band)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("speaking_submissions")
      .select("id, prompt, part, created_at, speaking_feedback(estimated_band, feedback_json)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reading_submissions")
      .select("id, passage_title, passage_slug, time_used_seconds, created_at, reading_feedback(band_score, raw_score, total_questions)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const writingItems = (writingResult.data ?? []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    type: "writing" as const,
    task_type: s.task_type as string,
    input_type: s.input_type as string,
    prompt_topic: s.prompt_topic as string | null,
    prompt_text: s.prompt_text as string | null,
    time_used_seconds: s.time_used_seconds as number | null,
    created_at: s.created_at as string,
    band: Array.isArray(s.writing_feedback) && s.writing_feedback.length > 0
      ? (s.writing_feedback[0] as Record<string, unknown>).overall_band as number
      : null,
  }));

  const speakingItems = (speakingResult.data ?? []).map((s: Record<string, unknown>) => {
    const fb = Array.isArray(s.speaking_feedback) && s.speaking_feedback.length > 0
      ? s.speaking_feedback[0] as Record<string, unknown>
      : null;
    let band: number | null = fb?.estimated_band as number | null ?? null;
    if (band == null && fb?.feedback_json) {
      band = (fb.feedback_json as Record<string, unknown>).estimated_band as number | null ?? null;
    }
    return {
      id: s.id as string,
      type: "speaking" as const,
      prompt: s.prompt as string,
      part: s.part as number | null,
      created_at: s.created_at as string,
      band,
    };
  });

  const readingItems = (readingResult.data ?? []).map((s: Record<string, unknown>) => {
    const fb = Array.isArray(s.reading_feedback) && s.reading_feedback.length > 0
      ? s.reading_feedback[0] as Record<string, unknown>
      : null;
    return {
      id: s.id as string,
      type: "reading" as const,
      passage_title: s.passage_title as string,
      passage_slug: s.passage_slug as string,
      time_used_seconds: s.time_used_seconds as number | null,
      created_at: s.created_at as string,
      band: fb ? (fb.band_score as number) : null,
      raw_score: fb ? (fb.raw_score as number) : null,
      total_questions: fb ? (fb.total_questions as number) : null,
    };
  });

  return (
    <HistoryClient
      writingItems={writingItems}
      speakingItems={speakingItems}
      readingItems={readingItems}
      authenticated={true}
    />
  );
}
