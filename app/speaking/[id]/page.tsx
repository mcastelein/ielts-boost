import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SpeakingDetailClient from "./speaking-detail-client";

export default async function SpeakingResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("speaking_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) return notFound();

  const { data: feedback } = await supabase
    .from("speaking_feedback")
    .select("*")
    .eq("submission_id", id)
    .single();

  if (!feedback) return notFound();

  return (
    <SpeakingDetailClient
      submission={submission}
      feedback={feedback.feedback_json}
    />
  );
}
