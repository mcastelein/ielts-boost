import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { getUserProfiles } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Fetch everything in parallel
  const [
    { data: settings },
    { data: writingSubs },
    { data: speakingSubs },
    { data: readingSubs },
    { data: listeningSubs },
    { data: apiLogs },
    { data: usageTracking },
    profiles,
  ] = await Promise.all([
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("writing_submissions")
      .select("*, writing_feedback(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("speaking_submissions")
      .select("*, speaking_feedback(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reading_submissions")
      .select("*, reading_feedback(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("listening_submissions")
      .select("*, listening_feedback(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("api_usage_log")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(1),
    getUserProfiles([userId]),
  ]);

  if (!settings) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // API cost breakdown by type
  const costByType: Record<string, { count: number; cost: number }> = {};
  const costByDay: Record<string, { count: number; cost: number }> = {};
  let totalCost = 0;

  for (const log of apiLogs ?? []) {
    const type = log.call_type;
    if (!costByType[type]) costByType[type] = { count: 0, cost: 0 };
    costByType[type].count++;
    costByType[type].cost += log.estimated_cost_usd ?? 0;

    const day = new Date(log.created_at).toISOString().split("T")[0];
    if (!costByDay[day]) costByDay[day] = { count: 0, cost: 0 };
    costByDay[day].count++;
    costByDay[day].cost += log.estimated_cost_usd ?? 0;

    totalCost += log.estimated_cost_usd ?? 0;
  }

  // Mistake patterns from writing feedback
  const mistakeCategories: Record<string, number> = {};
  for (const sub of writingSubs ?? []) {
    const feedback = sub.writing_feedback?.[0]?.feedback_json;
    if (feedback?.weaknesses) {
      for (const w of feedback.weaknesses) {
        const lower = (w as string).toLowerCase();
        mistakeCategories[lower] = (mistakeCategories[lower] ?? 0) + 1;
      }
    }
  }

  type SectionRow = {
    created_at: string;
    band: number | null;
  };

  const collectScores = (
    rows: Record<string, unknown>[] | null,
    feedbackKey: string,
    bandField: string
  ): { latest: number | null; previous: number | null; count: number } => {
    if (!rows) return { latest: null, previous: null, count: 0 };

    const scored: SectionRow[] = rows
      .map((r) => {
        const fb = (r[feedbackKey] as Record<string, unknown>[] | undefined)?.[0];
        const raw = fb?.[bandField];
        const band = typeof raw === "number" ? raw : raw != null ? Number(raw) : null;
        return { created_at: r.created_at as string, band };
      })
      .filter((r) => r.band != null && !Number.isNaN(r.band))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return {
      latest: scored[0]?.band ?? null,
      previous: scored[1]?.band ?? null,
      count: scored.length,
    };
  };

  const scoresBySection = {
    writing: collectScores(writingSubs as Record<string, unknown>[] | null, "writing_feedback", "overall_band"),
    speaking: collectScores(speakingSubs as Record<string, unknown>[] | null, "speaking_feedback", "estimated_band"),
    reading: collectScores(readingSubs as Record<string, unknown>[] | null, "reading_feedback", "band_score"),
    listening: collectScores(listeningSubs as Record<string, unknown>[] | null, "listening_feedback", "band_score"),
  };

  const recentErrors = (apiLogs ?? [])
    .filter((log) => {
      const meta = log.metadata as Record<string, unknown> | null | undefined;
      return meta?.success === false;
    })
    .slice(0, 20);

  // Writing score trend
  const scoreTrend = (writingSubs ?? [])
    .filter((s: Record<string, unknown>) => Array.isArray(s.writing_feedback) && s.writing_feedback.length > 0)
    .map((s: Record<string, unknown>) => ({
      date: new Date(s.created_at as string).toISOString().split("T")[0],
      overall: (s.writing_feedback as Record<string, unknown>[])?.[0]?.overall_band,
      task: (s.writing_feedback as Record<string, unknown>[])?.[0]?.task_score,
      coherence: (s.writing_feedback as Record<string, unknown>[])?.[0]?.coherence_score,
      lexical: (s.writing_feedback as Record<string, unknown>[])?.[0]?.lexical_score,
      grammar: (s.writing_feedback as Record<string, unknown>[])?.[0]?.grammar_score,
    }))
    .reverse();

  // Compute sessions (30min gap = new session)
  const SESSION_GAP_MS = 30 * 60 * 1000;
  const sortedLogs = [...(apiLogs ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const sessions: { start: string; end: string; calls: number; cost: number }[] = [];
  let currentSession: { start: string; end: string; calls: number; cost: number } | null = null;

  for (const log of sortedLogs) {
    const ts = new Date(log.created_at).getTime();
    if (!currentSession || ts - new Date(currentSession.end).getTime() > SESSION_GAP_MS) {
      if (currentSession) sessions.push(currentSession);
      currentSession = {
        start: log.created_at,
        end: log.created_at,
        calls: 1,
        cost: log.estimated_cost_usd ?? 0,
      };
    } else {
      currentSession.end = log.created_at;
      currentSession.calls++;
      currentSession.cost += log.estimated_cost_usd ?? 0;
    }
  }
  if (currentSession) sessions.push(currentSession);

  const avgSessionCost = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.cost, 0) / sessions.length
    : 0;

  const profile = profiles[userId];

  return NextResponse.json({
    user: {
      ...settings,
      email: profile?.email ?? null,
      display_name: profile?.name ?? null,
      last_sign_in_at: profile?.last_sign_in_at ?? null,
    },
    writingSubmissions: writingSubs ?? [],
    speakingSubmissions: speakingSubs ?? [],
    apiUsage: {
      totalCost,
      byType: costByType,
      byDay: costByDay,
      recentLogs: (apiLogs ?? []).slice(0, 50),
    },
    sessions: {
      total: sessions.length,
      avgCost: avgSessionCost,
      recent: sessions.slice(-20).reverse(),
    },
    usageToday: usageTracking?.[0] ?? null,
    mistakePatterns: Object.entries(mistakeCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10),
    scoreTrend,
    scoresBySection,
    recentErrors,
  });
}
