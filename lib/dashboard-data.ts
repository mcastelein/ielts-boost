import type { SupabaseClient } from "@supabase/supabase-js";
import type { ScoredResults } from "./reading-scoring";

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

// PostgREST embeds 1-to-1 FK joins as an object and 1-to-many as an array.
// reading_feedback.submission_id is UNIQUE so it returns an object;
// other feedback tables don't have UNIQUE so they return arrays.
function pickFeedback<T>(fb: T | T[] | null | undefined): T | null {
  if (!fb) return null;
  if (Array.isArray(fb)) return fb[0] ?? null;
  return fb;
}

function computeTrend(scores: number[]): "up" | "down" | "flat" | null {
  if (scores.length === 0) return null;
  // Single session — nothing to compare yet, show as steady so the marker is consistent across cards
  if (scores.length === 1) return "flat";

  // 6+ sessions: stable 3-vs-3 average comparison
  // 2-5 sessions: compare latest score to average of all previous
  const [recent, previous] =
    scores.length >= 6
      ? [scores.slice(-3), scores.slice(-6, -3)]
      : [scores.slice(-1), scores.slice(0, -1)];

  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const diff = avg(recent) - avg(previous);
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
    .neq("status", "draft")
    .order("created_at", { ascending: true });

  type WritingFb = {
    overall_band: number;
    task_score: number;
    coherence_score: number;
    lexical_score: number;
    grammar_score: number;
    feedback_json: { weaknesses?: string[] };
  };
  const rows = (raw ?? []) as Array<{
    id: string;
    task_type: string;
    created_at: string;
    writing_feedback: WritingFb | WritingFb[] | null;
  }>;

  const withFeedback = rows
    .map((r) => ({ row: r, fb: pickFeedback(r.writing_feedback) }))
    .filter((x): x is { row: typeof rows[number]; fb: WritingFb } => x.fb !== null);
  const scores = withFeedback.map((x) => x.fb.overall_band);

  const submissions = rows.map((r) => {
    const fb = pickFeedback(r.writing_feedback);
    return {
      id: r.id,
      date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      label: r.task_type === "task1" ? "Task 1" : "Task 2",
      score: fb?.overall_band ?? null,
    };
  });

  const trendData: TrendPoint[] = withFeedback.map((x) => ({
    date: new Date(x.row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: x.fb.overall_band,
  }));

  const latest = withFeedback.length > 0 ? withFeedback[withFeedback.length - 1].fb : null;
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
  withFeedback.forEach((x) => {
    const ws = x.fb.feedback_json?.weaknesses ?? [];
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
    .neq("status", "draft")
    .order("created_at", { ascending: true });

  type SpeakingFb = {
    estimated_band: number | null;
    fluency_score: number | null;
    lexical_score: number | null;
    grammar_score: number | null;
    pronunciation_score: number | null;
    feedback_json: { weaknesses?: string[] };
  };
  const rows = (raw ?? []) as Array<{
    id: string;
    prompt: string;
    part: number | null;
    created_at: string;
    speaking_feedback: SpeakingFb | SpeakingFb[] | null;
  }>;

  const withFeedback = rows
    .map((r) => ({ row: r, fb: pickFeedback(r.speaking_feedback) }))
    .filter((x): x is { row: typeof rows[number]; fb: SpeakingFb } => x.fb !== null && x.fb.estimated_band != null);
  const scores = withFeedback.map((x) => x.fb.estimated_band!);

  const submissions = rows.map((r) => {
    const fb = pickFeedback(r.speaking_feedback);
    return {
      id: r.id,
      date: new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      label: r.part ? `Part ${r.part}` : "Speaking",
      score: fb?.estimated_band ?? null,
    };
  });

  const trendData: TrendPoint[] = withFeedback.map((x) => ({
    date: new Date(x.row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: x.fb.estimated_band!,
  }));

  const latest = withFeedback.length > 0 ? withFeedback[withFeedback.length - 1].fb : null;
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
  withFeedback.forEach((x) => {
    const ws = x.fb.feedback_json?.weaknesses ?? [];
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

export async function fetchReadingDashboardData(
  userId: string,
  supabase: SupabaseClient
): Promise<SectionDashboardData> {
  const { data: raw } = await supabase
    .from("reading_submissions")
    .select(
      "id, passage_title, passage_slug, created_at, reading_feedback(raw_score, total_questions, band_score)"
    )
    .eq("user_id", userId)
    .neq("status", "draft")
    .order("created_at", { ascending: true });

  type ReadingFb = {
    raw_score: number;
    total_questions: number;
    band_score: number;
  };
  const rows = (raw ?? []) as Array<{
    id: string;
    passage_title: string;
    passage_slug: string;
    created_at: string;
    reading_feedback: ReadingFb | ReadingFb[] | null;
  }>;

  const withFeedback = rows
    .map((r) => ({ row: r, fb: pickFeedback(r.reading_feedback) }))
    .filter((x): x is { row: typeof rows[number]; fb: ReadingFb } => x.fb !== null);
  const scores = withFeedback.map((x) => x.fb.band_score);

  const submissions = rows.map((r) => {
    const fb = pickFeedback(r.reading_feedback);
    return {
      id: r.id,
      date: new Date(r.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      label: r.passage_title,
      score: fb?.band_score ?? null,
    };
  });

  const trendData: TrendPoint[] = withFeedback.map((x) => ({
    date: new Date(x.row.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: x.fb.band_score,
  }));

  const latest = withFeedback.length > 0 ? withFeedback[withFeedback.length - 1].fb : null;

  const latestSubScores: SubScore[] = latest
    ? [
        { label: "Raw Score", score: latest.raw_score },
        {
          label: "Accuracy",
          score:
            Math.round((latest.raw_score / latest.total_questions) * 90) / 10,
        },
      ]
    : [];

  return {
    submissions: submissions.reverse(),
    latestScore: scores.length > 0 ? scores[scores.length - 1] : null,
    avgScore:
      scores.length > 0
        ? Math.round(
            (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
          ) / 10
        : null,
    trend: computeTrend(scores),
    trendData,
    latestSubScores,
    weaknesses: [],
  };
}

export async function fetchListeningDashboardData(
  userId: string,
  supabase: SupabaseClient
): Promise<SectionDashboardData> {
  const { data: raw } = await supabase
    .from("listening_submissions")
    .select(
      "id, track_title, track_slug, created_at, listening_feedback(raw_score, total_questions, band_score)"
    )
    .eq("user_id", userId)
    .neq("status", "draft")
    .order("created_at", { ascending: true });

  type ListeningFb = {
    raw_score: number;
    total_questions: number;
    band_score: number;
  };
  const rows = (raw ?? []) as Array<{
    id: string;
    track_title: string;
    track_slug: string;
    created_at: string;
    listening_feedback: ListeningFb | ListeningFb[] | null;
  }>;

  const withFeedback = rows
    .map((r) => ({ row: r, fb: pickFeedback(r.listening_feedback) }))
    .filter((x): x is { row: typeof rows[number]; fb: ListeningFb } => x.fb !== null);
  const scores = withFeedback.map((x) => x.fb.band_score);

  const submissions = rows.map((r) => {
    const fb = pickFeedback(r.listening_feedback);
    return {
      id: r.id,
      date: new Date(r.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      label: r.track_title,
      score: fb?.band_score ?? null,
    };
  });

  const trendData: TrendPoint[] = withFeedback.map((x) => ({
    date: new Date(x.row.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: x.fb.band_score,
  }));

  const latest = withFeedback.length > 0 ? withFeedback[withFeedback.length - 1].fb : null;

  const latestSubScores: SubScore[] = latest
    ? [
        { label: "Raw Score", score: latest.raw_score },
        {
          label: "Accuracy",
          score:
            Math.round((latest.raw_score / latest.total_questions) * 90) / 10,
        },
      ]
    : [];

  return {
    submissions: submissions.reverse(),
    latestScore: scores.length > 0 ? scores[scores.length - 1] : null,
    avgScore:
      scores.length > 0
        ? Math.round(
            (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
          ) / 10
        : null,
    trend: computeTrend(scores),
    trendData,
    latestSubScores,
    weaknesses: [],
  };
}
