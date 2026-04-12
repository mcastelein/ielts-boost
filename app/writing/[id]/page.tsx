import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WritingDetailClient from "./writing-detail-client";

export default async function WritingResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("writing_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) return notFound();

  const { data: feedback } = await supabase
    .from("writing_feedback")
    .select("*")
    .eq("submission_id", id)
    .single();

  if (!feedback) return notFound();

  return (
    <WritingDetailClient
      submission={submission}
      feedback={feedback}
    />
  );
}
