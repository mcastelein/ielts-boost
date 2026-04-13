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

  // Check if user is Pro for model answer access
  const { data: { user } } = await supabase.auth.getUser();
  let isPro = false;
  if (user) {
    const { data: settings } = await supabase
      .from("user_settings")
      .select("plan_type")
      .eq("user_id", user.id)
      .single();
    isPro = settings?.plan_type === "pro";
  }

  return (
    <WritingDetailClient
      submission={submission}
      feedback={feedback}
      isPro={isPro}
    />
  );
}
