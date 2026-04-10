import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get all user settings with their usage data
  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get submission counts per user
  const userIds = settings?.map((s) => s.user_id) ?? [];

  const { data: writingCounts } = await supabase
    .from("writing_submissions")
    .select("user_id")
    .in("user_id", userIds);

  const { data: speakingCounts } = await supabase
    .from("speaking_submissions")
    .select("user_id")
    .in("user_id", userIds);

  const { data: apiCosts } = await supabase
    .from("api_usage_log")
    .select("user_id, estimated_cost_usd")
    .in("user_id", userIds);

  // Aggregate
  const countMap: Record<string, { writing: number; speaking: number; totalCost: number }> = {};
  for (const id of userIds) {
    countMap[id] = { writing: 0, speaking: 0, totalCost: 0 };
  }
  for (const w of writingCounts ?? []) {
    if (countMap[w.user_id]) countMap[w.user_id].writing++;
  }
  for (const s of speakingCounts ?? []) {
    if (countMap[s.user_id]) countMap[s.user_id].speaking++;
  }
  for (const a of apiCosts ?? []) {
    if (a.user_id && countMap[a.user_id]) {
      countMap[a.user_id].totalCost += a.estimated_cost_usd ?? 0;
    }
  }

  const users = settings?.map((s) => ({
    ...s,
    stats: countMap[s.user_id] ?? { writing: 0, speaking: 0, totalCost: 0 },
  }));

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, updates } = await request.json();

  if (!userId || !updates) {
    return NextResponse.json({ error: "Missing userId or updates" }, { status: 400 });
  }

  // Only allow updating specific fields
  const allowedFields = ["role", "plan_type"];
  const safeUpdates: Record<string, string> = {};
  for (const key of allowedFields) {
    if (key in updates) {
      safeUpdates[key] = updates[key];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_settings")
    .update(safeUpdates)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
