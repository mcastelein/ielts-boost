import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { getUserProfiles } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = 50;
  const offset = (page - 1) * perPage;

  const { data, count, error } = await supabase
    .from("admin_audit_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Resolve admin and target user profiles
  const allUserIds = new Set<string>();
  for (const log of data ?? []) {
    if (log.admin_user_id) allUserIds.add(log.admin_user_id);
    if (log.target_user_id) allUserIds.add(log.target_user_id);
  }
  const profiles = await getUserProfiles([...allUserIds]);

  const logs = (data ?? []).map((log) => ({
    ...log,
    admin_email: profiles[log.admin_user_id]?.email ?? null,
    admin_name: profiles[log.admin_user_id]?.name ?? null,
    target_email: log.target_user_id ? profiles[log.target_user_id]?.email ?? null : null,
    target_name: log.target_user_id ? profiles[log.target_user_id]?.name ?? null : null,
  }));

  return NextResponse.json({ logs, total: count ?? 0, page, perPage });
}
