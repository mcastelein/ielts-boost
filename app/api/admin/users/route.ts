import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { getUserProfiles } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/admin-audit";

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

  const userIds = settings?.map((s) => s.user_id) ?? [];

  // Fetch all submission types in parallel — include created_at for daysActive7d
  const [
    { data: writingRows },
    { data: speakingRows },
    { data: readingRows },
    { data: listeningRows },
    { data: apiCosts },
  ] = await Promise.all([
    supabase.from("writing_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("speaking_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("reading_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("listening_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("api_usage_log").select("user_id, estimated_cost_usd").in("user_id", userIds),
  ]);

  // Aggregate
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const countMap: Record<
    string,
    { writing: number; speaking: number; reading: number; listening: number; totalCost: number; activeDays: Set<string> }
  > = {};
  for (const id of userIds) {
    countMap[id] = { writing: 0, speaking: 0, reading: 0, listening: 0, totalCost: 0, activeDays: new Set() };
  }

  const tally = (
    rows: { user_id: string; created_at: string }[] | null,
    key: "writing" | "speaking" | "reading" | "listening"
  ) => {
    for (const r of rows ?? []) {
      const bucket = countMap[r.user_id];
      if (!bucket) continue;
      bucket[key]++;
      if (new Date(r.created_at).getTime() >= sevenDaysAgo) {
        bucket.activeDays.add(r.created_at.slice(0, 10));
      }
    }
  };
  tally(writingRows, "writing");
  tally(speakingRows, "speaking");
  tally(readingRows, "reading");
  tally(listeningRows, "listening");

  for (const a of apiCosts ?? []) {
    if (a.user_id && countMap[a.user_id]) {
      countMap[a.user_id].totalCost += a.estimated_cost_usd ?? 0;
    }
  }

  const profiles = await getUserProfiles(userIds);

  const users = settings?.map((s) => {
    const c = countMap[s.user_id] ?? {
      writing: 0,
      speaking: 0,
      reading: 0,
      listening: 0,
      totalCost: 0,
      activeDays: new Set<string>(),
    };
    return {
      ...s,
      email: profiles[s.user_id]?.email ?? null,
      display_name: profiles[s.user_id]?.name ?? null,
      last_sign_in_at: profiles[s.user_id]?.last_sign_in_at ?? null,
      provider: profiles[s.user_id]?.provider ?? null,
      stats: {
        writing: c.writing,
        speaking: c.speaking,
        reading: c.reading,
        listening: c.listening,
        totalCost: c.totalCost,
        daysActive7d: c.activeDays.size,
      },
    };
  });

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { authorized, user: adminUser } = await requireAdmin(supabase);

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

  // Audit log
  await logAdminAction({
    supabase,
    adminUserId: adminUser!.id,
    action: "update_user",
    targetUserId: userId,
    details: { updates: safeUpdates },
  });

  return NextResponse.json({ success: true });
}
