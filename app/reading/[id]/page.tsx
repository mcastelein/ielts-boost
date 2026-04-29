import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReadingDetailClient from "./reading-detail-client";
import { dbRowToPassage } from "@/lib/content-mappers";
import type { ScoredResults } from "@/lib/reading-scoring";

export default async function ReadingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("reading_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) notFound();

  const { data: feedback } = await supabase
    .from("reading_feedback")
    .select("*")
    .eq("submission_id", id)
    .single();

  if (!feedback) notFound();

  const { data: passageRow } = await supabase
    .from("reading_passages")
    .select("slug, title, exam_type, difficulty, topic_tags, passage_text, question_groups")
    .eq("slug", submission.passage_slug)
    .single();
  if (!passageRow) notFound();
  const passage = dbRowToPassage(passageRow);

  return (
    <ReadingDetailClient
      submission={{
        id: submission.id,
        passageTitle: submission.passage_title,
        passageSlug: submission.passage_slug,
        examType: submission.exam_type,
        timeUsedSeconds: submission.time_used_seconds,
        createdAt: submission.created_at,
      }}
      feedback={{
        rawScore: feedback.raw_score,
        totalQuestions: feedback.total_questions,
        bandScore: feedback.band_score,
        questionResults: feedback.question_results as ScoredResults,
      }}
      passage={passage}
    />
  );
}
