import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListeningDetailClient from "./listening-detail-client";
import { LISTENING_TRACKS } from "@/lib/listening-tracks";
import type { ScoredResults } from "@/lib/reading-scoring";

export default async function ListeningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("listening_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) notFound();

  const { data: feedback } = await supabase
    .from("listening_feedback")
    .select("*")
    .eq("submission_id", id)
    .single();

  if (!feedback) notFound();

  const track = LISTENING_TRACKS.find((t) => t.id === submission.track_slug);
  if (!track) notFound();

  return (
    <ListeningDetailClient
      submission={{
        id: submission.id,
        trackTitle: submission.track_title,
        trackSlug: submission.track_slug,
        section: submission.section,
        createdAt: submission.created_at,
      }}
      feedback={{
        rawScore: feedback.raw_score,
        totalQuestions: feedback.total_questions,
        bandScore: feedback.band_score,
        questionResults: feedback.question_results as ScoredResults,
      }}
      track={track}
    />
  );
}
