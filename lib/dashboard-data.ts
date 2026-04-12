import type { SupabaseClient } from "@supabase/supabase-js";

export interface TrendPoint {
  date: string;
  score: number;
}

export interface SubScore {
  label: string;
  score: number;
}

export interface SectionDashboardData {
  submissions: { id: string; date: string; label: string; score: number | null }[];
  latestScore: number | null;
  avgScore: number | null;
  trend: "up" | "down" | "flat" | null;
  trendData: TrendPoint[];
  latestSubScores: SubScore[];
  weaknesses: { text: string; count: number }[];
}

function computeTrend(scores: number[]): "up" | "down" | "flat" | null {
  if (scores.length < 4) return null;
  const recent = scores.slice(-3);
  const previous = scores.slice(-6, -3);
  if (previous.length === 0) return null;
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
  const diff = recentAvg - prevAvg;
  if (diff > 0.25) return "up";
  if (diff < -0.25) return "down";
  return "flat";
}

export async function fetchWritingDashboardData(
  userId: string,
  supabase: SupabaseClient
): Promise<SectionDashboardData> {
  const { data: raw } = await supabase
    .from("writing_submissions")
    .select(
      "id, task_type, created_at, writing_feedback(overall_band, task_score, coherence_score, lexical_score, grammar_score, feedback_json)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const rows = (raw ?? []) as Array<{
    id: string;
    task_type: string;
    created_at: string;
    writing_feedback: {
      overall_band: number;
      task_score: number;
      coherence_score: number;
      lexical_score: number;
      grammar_score: number;
      feedback_json: { weaknesses?: string[] };
    }[];
  }>;

  const withFeedback = rows.filter((r) => r.writing_feedback?.length > 0);
  const scores = withFeedback.map((r) => r.writing_feedback[0].overall_band);

  const submissions = rows.map((r) => ({
    id: r.id,
    date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    label: r.task_type === "task1" ? "Task 1" : "Task 2",
    score: r.writing_feedback?.length > 0 ? r.writing_feedback[0].overall_band : null,
  }));

  const trendData: TrendPoint[] = withFeedback.map((r) => ({
    date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: r.writing_feedback[0].overall_band,
  }));

  const latest = withFeedback.length > 0 ? withFeedback[withFeedback.length - 1].writing_feedback[0] : null;
  const latestSubScores: SubScore[] = latest
    ? [
        { label: "Task", score: latest.task_score },
        { label: "Coherence", score: latest.coherence_score },
        { label: "Lexical", score: latest.lexical_score },
        { label: "Grammar", score: latest.grammar_score },
      ]
    : [];

  // Collect weaknesses
  const weaknessCounts: Record<string, number> = {};
  withFeedback.forEach((r) => {
    const ws = r.writing_feedback[0].feedback_json?.weaknesses ?? [];
    ws.forEach((w) => {
      const key = w.toLowerCase().slice(0, 60);
      weaknessCounts[key] = (weaknessCounts[key] || 0) + 1;
    });
  });
  const weaknesses = Object.entries(weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({ text, count }));

  return {
    submissions: submissions.reverse(), // most recent first for list display
    latestScore: scores.length > 0 ? scores[scores.length - 1] : null,
    avgScore: scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null,
    trend: computeTrend(scores),
    trendData,
    latestSubScores,
    weaknesses,
  };
}

export async function fetchSpeakingDashboardData(
  userId: string,
  supabase: SupabaseClient
): Promise<SectionDashboardData> {
  const { data: raw } = await supabase
    .from("speaking_submissions")
    .select(
      "id, prompt, part, created_at, speaking_feedback(estimated_band, fluency_score, lexical_score, grammar_score, pronunciation_score, feedback_json)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const rows = (raw ?? []) as Array<{
    id: string;
    prompt: string;
    part: number | null;
    created_at: string;
    speaking_feedback: {
      estimated_band: number | null;
      fluency_score: number | null;
      lexical_score: number | null;
      grammar_score: number | null;
      pronunciation_score: number | null;
      feedback_json: { weaknesses?: string[] };
    }[];
  }>;

  const withFeedback = rows.filter(
    (r) => r.speaking_feedback?.length > 0 && r.speaking_feedback[0].estimated_band != null
  );
  const scores = withFeedback.map((r) => r.speaking_feedback[0].estimated_band!);

  const submissions = rows.map((r) => ({
    id: r.id,
    date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    label: r.part ? `Part ${r.part}` : "Speaking",
    score: r.speaking_feedback?.length > 0 ? r.speaking_feedback[0].estimated_band : null,
  }));

  const trendData: TrendPoint[] = withFeedback.map((r) => ({
    date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: r.speaking_feedback[0].estimated_band!,
  }));

  const latest = withFeedback.length > 0 ? withFeedback[withFeedback.length - 1].speaking_feedback[0] : null;
  const latestSubScores: SubScore[] =
    latest && latest.fluency_score != null
      ? [
          { label: "Fluency", score: latest.fluency_score },
          { label: "Lexical", score: latest.lexical_score! },
          { label: "Grammar", score: latest.grammar_score! },
          { label: "Pronunciation", score: latest.pronunciation_score! },
        ]
      : [];

  // Collect weaknesses from feedback_json
  const weaknessCounts: Record<string, number> = {};
  withFeedback.forEach((r) => {
    const ws = r.speaking_feedback[0].feedback_json?.weaknesses ?? [];
    ws.forEach((w) => {
      const key = w.toLowerCase().slice(0, 60);
      weaknessCounts[key] = (weaknessCounts[key] || 0) + 1;
    });
  });
  const weaknesses = Object.entries(weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({ text, count }));

  return {
    submissions: submissions.reverse(),
    latestScore: scores.length > 0 ? scores[scores.length - 1] : null,
    avgScore: scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null,
    trend: computeTrend(scores),
    trendData,
    latestSubScores,
    weaknesses,
  };
}
