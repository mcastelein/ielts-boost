import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const userId = searchParams.get("user_id");

  const since = new Date();
  since.setDate(since.getDate() - days);

  let query = supabase
    .from("api_usage_log")
    .select("*")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(500);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: logs, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate stats
  const totalCost = logs?.reduce((sum, l) => sum + (l.estimated_cost_usd ?? 0), 0) ?? 0;
  const byType: Record<string, { count: number; cost: number }> = {};
  const byUser: Record<string, { count: number; cost: number }> = {};
  const byDay: Record<string, { count: number; cost: number }> = {};

  for (const log of logs ?? []) {
    const type = log.call_type;
    if (!byType[type]) byType[type] = { count: 0, cost: 0 };
    byType[type].count++;
    byType[type].cost += log.estimated_cost_usd ?? 0;

    const uid = log.user_id ?? "anonymous";
    if (!byUser[uid]) byUser[uid] = { count: 0, cost: 0 };
    byUser[uid].count++;
    byUser[uid].cost += log.estimated_cost_usd ?? 0;

    const day = new Date(log.created_at).toISOString().split("T")[0];
    if (!byDay[day]) byDay[day] = { count: 0, cost: 0 };
    byDay[day].count++;
    byDay[day].cost += log.estimated_cost_usd ?? 0;
  }

  return NextResponse.json({
    logs,
    summary: {
      totalCalls: logs?.length ?? 0,
      totalCost,
      byType,
      byUser,
      byDay,
    },
  });
}
