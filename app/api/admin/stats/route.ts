import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { getUserProfiles } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Parallel queries
  const [
    { count: totalUsers },
    { count: newUsersToday },
    { count: newUsersWeek },
    { data: writingToday },
    { data: writingWeek },
    { data: writingMonth },
    { data: speakingToday },
    { data: speakingWeek },
    { data: speakingMonth },
    { data: readingToday },
    { data: readingWeek },
    { data: readingMonth },
    { data: listeningToday },
    { data: listeningWeek },
    { data: listeningMonth },
    { data: costToday },
    { data: costWeek },
    { data: costMonth },
    { data: activeUsersData },
    { data: allSettings },
    { data: recentWriting },
    { data: recentSpeaking },
    { data: recentReading },
    { data: recentListening },
  ] = await Promise.all([
    // Total users
    supabase.from("user_settings").select("*", { count: "exact", head: true }),
    // New users today
    supabase.from("user_settings").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    // New users this week
    supabase.from("user_settings").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    // Writing submissions
    supabase.from("writing_submissions").select("id", { count: "exact" }).gte("created_at", todayStart),
    supabase.from("writing_submissions").select("id", { count: "exact" }).gte("created_at", weekAgo),
    supabase.from("writing_submissions").select("id", { count: "exact" }).gte("created_at", monthAgo),
    // Speaking submissions
    supabase.from("speaking_submissions").select("id", { count: "exact" }).gte("created_at", todayStart),
    supabase.from("speaking_submissions").select("id", { count: "exact" }).gte("created_at", weekAgo),
    supabase.from("speaking_submissions").select("id", { count: "exact" }).gte("created_at", monthAgo),
    // Reading submissions
    supabase.from("reading_submissions").select("id", { count: "exact" }).gte("created_at", todayStart),
    supabase.from("reading_submissions").select("id", { count: "exact" }).gte("created_at", weekAgo),
    supabase.from("reading_submissions").select("id", { count: "exact" }).gte("created_at", monthAgo),
    // Listening submissions
    supabase.from("listening_submissions").select("id", { count: "exact" }).gte("created_at", todayStart),
    supabase.from("listening_submissions").select("id", { count: "exact" }).gte("created_at", weekAgo),
    supabase.from("listening_submissions").select("id", { count: "exact" }).gte("created_at", monthAgo),
    // API costs
    supabase.from("api_usage_log").select("estimated_cost_usd").gte("created_at", todayStart),
    supabase.from("api_usage_log").select("estimated_cost_usd").gte("created_at", weekAgo),
    supabase.from("api_usage_log").select("estimated_cost_usd").gte("created_at", monthAgo),
    // Active users (writing in last 7 days; reading/listening/speaking added below)
    supabase.from("writing_submissions").select("user_id").gte("created_at", weekAgo),
    // All settings for top users
    supabase.from("user_settings").select("user_id, plan_type"),
    // Recent feedback for average band scores
    supabase.from("writing_feedback").select("overall_band").gte("created_at", monthAgo),
    supabase.from("speaking_feedback").select("estimated_band").gte("created_at", monthAgo),
    supabase.from("reading_feedback").select("band_score").gte("created_at", monthAgo),
    supabase.from("listening_feedback").select("band_score").gte("created_at", monthAgo),
  ]);

  const sumCost = (rows: { estimated_cost_usd: number | null }[] | null) =>
    rows?.reduce((sum, r) => sum + (r.estimated_cost_usd ?? 0), 0) ?? 0;

  // Active users = unique user_ids across all 4 sections in last 7 days
  const activeUserIds = new Set<string>();
  for (const w of activeUsersData ?? []) activeUserIds.add(w.user_id);
  const [{ data: activeSpeakers }, { data: activeReaders }, { data: activeListeners }] = await Promise.all([
    supabase.from("speaking_submissions").select("user_id").gte("created_at", weekAgo),
    supabase.from("reading_submissions").select("user_id").gte("created_at", weekAgo),
    supabase.from("listening_submissions").select("user_id").gte("created_at", weekAgo),
  ]);
  for (const s of activeSpeakers ?? []) activeUserIds.add(s.user_id);
  for (const r of activeReaders ?? []) activeUserIds.add(r.user_id);
  for (const l of activeListeners ?? []) activeUserIds.add(l.user_id);

  // Top users by API cost this month
  const { data: topCostData } = await supabase
    .from("api_usage_log")
    .select("user_id, estimated_cost_usd, created_at")
    .gte("created_at", monthAgo)
    .not("user_id", "is", null);

  const costByUser: Record<string, number> = {};
  for (const row of topCostData ?? []) {
    if (row.user_id) {
      costByUser[row.user_id] = (costByUser[row.user_id] ?? 0) + (row.estimated_cost_usd ?? 0);
    }
  }
  const topUsersByCost = Object.entries(costByUser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Top users by submissions this month — count across all 4 sections
  const [
    { data: topWriters },
    { data: topSpeakers },
    { data: topReaders },
    { data: topListeners },
  ] = await Promise.all([
    supabase.from("writing_submissions").select("user_id").gte("created_at", monthAgo),
    supabase.from("speaking_submissions").select("user_id").gte("created_at", monthAgo),
    supabase.from("reading_submissions").select("user_id").gte("created_at", monthAgo),
    supabase.from("listening_submissions").select("user_id").gte("created_at", monthAgo),
  ]);

  const subsByUser: Record<string, number> = {};
  for (const row of topWriters ?? []) subsByUser[row.user_id] = (subsByUser[row.user_id] ?? 0) + 1;
  for (const row of topSpeakers ?? []) subsByUser[row.user_id] = (subsByUser[row.user_id] ?? 0) + 1;
  for (const row of topReaders ?? []) subsByUser[row.user_id] = (subsByUser[row.user_id] ?? 0) + 1;
  for (const row of topListeners ?? []) subsByUser[row.user_id] = (subsByUser[row.user_id] ?? 0) + 1;
  const topUsersByActivity = Object.entries(subsByUser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Resolve top user profiles
  const allTopUserIds = [
    ...new Set([
      ...topUsersByCost.map(([id]) => id),
      ...topUsersByActivity.map(([id]) => id),
    ]),
  ];
  const profiles = await getUserProfiles(allTopUserIds);

  // Average band scores
  const avg = (rows: { [k: string]: number | null }[] | null, key: string): number | null => {
    const bands = rows?.map((r) => r[key]).filter((n): n is number => typeof n === "number" && !Number.isNaN(n)) ?? [];
    return bands.length > 0 ? bands.reduce((a, b) => a + b, 0) / bands.length : null;
  };
  const avgWritingBand = avg(recentWriting, "overall_band");
  const avgSpeakingBand = avg(recentSpeaking, "estimated_band");
  const avgReadingBand = avg(recentReading, "band_score");
  const avgListeningBand = avg(recentListening, "band_score");

  // Plan distribution
  const planCounts = { free: 0, pro: 0 };
  for (const s of allSettings ?? []) {
    if (s.plan_type === "pro") planCounts.pro++;
    else planCounts.free++;
  }

  // Compute platform-wide avg session cost from this month's logs
  const SESSION_GAP_MS = 30 * 60 * 1000;
  const monthLogs = [...(costMonth ?? [])]
    .filter((l): l is typeof l & { created_at: string } => "created_at" in l);
  // We only have cost data from the costMonth query, not timestamps. Use the topCostData which has timestamps.
  const sortedMonthLogs = [...(topCostData ?? [])]
    .sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
  let sessionCount = 0;
  let lastTs = 0;
  for (const log of sortedMonthLogs) {
    const ts = new Date(log.created_at ?? 0).getTime();
    if (ts - lastTs > SESSION_GAP_MS) sessionCount++;
    lastTs = ts;
  }
  const avgSessionCost = sessionCount > 0 ? sumCost(costMonth) / sessionCount : 0;

  // System health: avg response times and error rates from last 24h
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { data: healthLogs } = await supabase
    .from("api_usage_log")
    .select("call_type, model, duration_ms, metadata, created_at")
    .gte("created_at", dayAgo);

  const healthByModel: Record<string, { calls: number; errors: number; totalDuration: number; lastCall: string }> = {};
  for (const log of healthLogs ?? []) {
    const key = log.model;
    if (!healthByModel[key]) healthByModel[key] = { calls: 0, errors: 0, totalDuration: 0, lastCall: "" };
    healthByModel[key].calls++;
    if ((log.metadata as Record<string, unknown>)?.success === false) healthByModel[key].errors++;
    healthByModel[key].totalDuration += log.duration_ms ?? 0;
    if (log.created_at > healthByModel[key].lastCall) healthByModel[key].lastCall = log.created_at;
  }

  const systemHealth = Object.entries(healthByModel).map(([model, stats]) => ({
    model,
    calls24h: stats.calls,
    errors24h: stats.errors,
    errorRate: stats.calls > 0 ? (stats.errors / stats.calls * 100).toFixed(1) : "0.0",
    avgDurationMs: stats.calls > 0 ? Math.round(stats.totalDuration / stats.calls) : 0,
    lastCall: stats.lastCall,
  }));

  return NextResponse.json({
    users: {
      total: totalUsers ?? 0,
      newToday: newUsersToday ?? 0,
      newThisWeek: newUsersWeek ?? 0,
      activeThisWeek: activeUserIds.size,
      plans: planCounts,
    },
    submissions: {
      writing: {
        today: writingToday?.length ?? 0,
        week: writingWeek?.length ?? 0,
        month: writingMonth?.length ?? 0,
      },
      speaking: {
        today: speakingToday?.length ?? 0,
        week: speakingWeek?.length ?? 0,
        month: speakingMonth?.length ?? 0,
      },
      reading: {
        today: readingToday?.length ?? 0,
        week: readingWeek?.length ?? 0,
        month: readingMonth?.length ?? 0,
      },
      listening: {
        today: listeningToday?.length ?? 0,
        week: listeningWeek?.length ?? 0,
        month: listeningMonth?.length ?? 0,
      },
    },
    costs: {
      today: sumCost(costToday),
      week: sumCost(costWeek),
      month: sumCost(costMonth),
      avgSessionCost,
      sessionsThisMonth: sessionCount,
    },
    topUsersByCost: topUsersByCost.map(([id, cost]) => ({
      id,
      email: profiles[id]?.email ?? null,
      name: profiles[id]?.name ?? null,
      cost,
    })),
    topUsersByActivity: topUsersByActivity.map(([id, count]) => ({
      id,
      email: profiles[id]?.email ?? null,
      name: profiles[id]?.name ?? null,
      submissions: count,
    })),
    averageBands: {
      writing: avgWritingBand,
      speaking: avgSpeakingBand,
      reading: avgReadingBand,
      listening: avgListeningBand,
    },
    systemHealth,
  });
}
