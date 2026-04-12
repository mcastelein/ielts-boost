import { createClient } from "@/lib/supabase/server";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <HistoryClient writingItems={[]} speakingItems={[]} authenticated={false} />;
  }

  const { data: writingSubmissions } = await supabase
    .from("writing_submissions")
    .select(
      "id, task_type, input_type, prompt_topic, time_used_seconds, created_at, writing_feedback(overall_band)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: speakingSubmissions } = await supabase
    .from("speaking_submissions")
    .select(
      "id, prompt, part, created_at, speaking_feedback(estimated_band, feedback_json)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const writingItems = (writingSubmissions ?? []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    type: "writing" as const,
    task_type: s.task_type as string,
    input_type: s.input_type as string,
    prompt_topic: s.prompt_topic as string | null,
    time_used_seconds: s.time_used_seconds as number | null,
    created_at: s.created_at as string,
    band: Array.isArray(s.writing_feedback) && s.writing_feedback.length > 0
      ? (s.writing_feedback[0] as Record<string, unknown>).overall_band as number
      : null,
  }));

  const speakingItems = (speakingSubmissions ?? []).map((s: Record<string, unknown>) => {
    const fb = Array.isArray(s.speaking_feedback) && s.speaking_feedback.length > 0
      ? s.speaking_feedback[0] as Record<string, unknown>
      : null;
    // Try top-level estimated_band first, then fall back to feedback_json
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

  return (
    <HistoryClient
      writingItems={writingItems}
      speakingItems={speakingItems}
      authenticated={true}
    />
  );
}
