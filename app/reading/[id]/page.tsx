import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReadingDetailClient from "./reading-detail-client";
import { READING_PASSAGES } from "@/lib/reading-passages";
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

  const passage = READING_PASSAGES.find((p) => p.id === submission.passage_slug);
  if (!passage) notFound();

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
