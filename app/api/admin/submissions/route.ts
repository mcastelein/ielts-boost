import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { getUserProfiles } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "writing"; // writing | speaking
  const userId = searchParams.get("user_id");
  const taskType = searchParams.get("task_type");
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = 20;
  const offset = (page - 1) * perPage;

  if (type === "writing") {
    let query = supabase
      .from("writing_submissions")
      .select("*, writing_feedback(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + perPage - 1);

    if (userId) query = query.eq("user_id", userId);
    if (taskType) query = query.eq("task_type", taskType);

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const userIds = [...new Set((data ?? []).map((s) => s.user_id))];
    const profiles = await getUserProfiles(userIds);

    const submissions = (data ?? []).map((s) => ({
      ...s,
      user_email: profiles[s.user_id]?.email ?? null,
      user_name: profiles[s.user_id]?.name ?? null,
    }));

    return NextResponse.json({ submissions, total: count ?? 0, page, perPage });
  } else {
    let query = supabase
      .from("speaking_submissions")
      .select("*, speaking_feedback(*)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + perPage - 1);

    if (userId) query = query.eq("user_id", userId);

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const userIds = [...new Set((data ?? []).map((s) => s.user_id))];
    const profiles = await getUserProfiles(userIds);

    const submissions = (data ?? []).map((s) => ({
      ...s,
      user_email: profiles[s.user_id]?.email ?? null,
      user_name: profiles[s.user_id]?.name ?? null,
    }));

    return NextResponse.json({ submissions, total: count ?? 0, page, perPage });
  }
}
