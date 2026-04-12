import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = 20;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from("feedback")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ feedback: data ?? [], total: count ?? 0, page, perPage });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id, status } = await request.json();
  if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

  const validStatuses = ["new", "reviewed", "resolved", "dismissed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("feedback")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
