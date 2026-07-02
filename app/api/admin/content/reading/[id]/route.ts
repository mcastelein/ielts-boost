import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { logAdminAction } from "@/lib/admin-audit";
import { validateGeneratedPassage } from "@/lib/reading-generation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("reading_passages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 });
  }
  return NextResponse.json({ passage: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { authorized, user: adminUser } = await requireAdmin(supabase);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updates = await request.json();
  const allowedFields = [
    "title",
    "difficulty",
    "topic_tags",
    "passage_text",
    "question_groups",
    "status",
    "is_active",
    "display_order",
  ];
  const safeUpdates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) safeUpdates[key] = updates[key];
  }
  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }
  if ("status" in safeUpdates && !["draft", "published"].includes(safeUpdates.status as string)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("reading_passages")
    .select("title, topic_tags, passage_text, question_groups, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 });
  }

  // Re-validate content whenever the passage text or questions change
  if ("passage_text" in safeUpdates || "question_groups" in safeUpdates) {
    const candidate = {
      title: (safeUpdates.title as string) ?? existing.title,
      topicTags: (safeUpdates.topic_tags as string[]) ?? existing.topic_tags,
      passageText: (safeUpdates.passage_text as string) ?? existing.passage_text,
      questionGroups: safeUpdates.question_groups ?? existing.question_groups,
    };
    const { errors } = validateGeneratedPassage(candidate, { requireExplanations: false });
    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Content failed validation", errors },
        { status: 400 }
      );
    }
  }

  const { data: row, error } = await supabase
    .from("reading_passages")
    .update(safeUpdates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    supabase,
    adminUserId: adminUser!.id,
    action: "update_reading_passage",
    details: {
      passageId: id,
      fields: Object.keys(safeUpdates),
      ...(safeUpdates.status ? { status: safeUpdates.status } : {}),
      ...("is_active" in safeUpdates ? { is_active: safeUpdates.is_active } : {}),
    },
  });

  return NextResponse.json({ passage: row });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { authorized, user: adminUser } = await requireAdmin(supabase);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from("reading_passages")
    .select("slug, status")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 });
  }
  // Published passages are referenced by submissions — deactivate, never delete
  if (existing.status !== "draft") {
    return NextResponse.json(
      { error: "Only drafts can be deleted. Deactivate published passages instead." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("reading_passages").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    supabase,
    adminUserId: adminUser!.id,
    action: "delete_reading_draft",
    details: { passageId: id, slug: existing.slug },
  });

  return NextResponse.json({ success: true });
}
