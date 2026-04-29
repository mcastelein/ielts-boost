import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListeningDetailClient from "./listening-detail-client";
import { dbRowToTrack } from "@/lib/content-mappers";
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

  const { data: trackRow } = await supabase
    .from("listening_tracks")
    .select("slug, title, section, difficulty, topic_tags, context, transcript, question_groups, audio_url")
    .eq("slug", submission.track_slug)
    .single();
  if (!trackRow) notFound();
  const track = dbRowToTrack(trackRow);

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
