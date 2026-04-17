"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import type { ListeningTrack } from "@/lib/listening-tracks";
import type { ScoredResults } from "@/lib/reading-scoring";

interface SubmissionData {
  id: string;
  trackTitle: string;
  trackSlug: string;
  section: number;
  createdAt: string;
}

interface FeedbackData {
  rawScore: number;
  totalQuestions: number;
  bandScore: number;
  questionResults: ScoredResults;
}

interface Props {
  submission: SubmissionData;
  feedback: FeedbackData;
  track: ListeningTrack;
}

export default function ListeningDetailClient({ submission, feedback, track }: Props) {
  const { t } = useLanguage();
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const accuracy = Math.round((feedback.rawScore / feedback.totalQuestions) * 100);

  let questionCounter = 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("listening_feedback_title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{submission.trackTitle}</p>
        </div>
        <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
          {t("listening_section_badge")} {submission.section}{t("listening_section_badge_suffix")}
        </span>
      </div>

      {/* Score cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("listening_band_score")}
          </span>
          <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-3xl font-bold text-white">
            {feedback.bandScore}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("listening_raw_score")}
          </span>
          <p className="mt-3 text-4xl font-bold text-gray-900">
            {feedback.rawScore}
            <span className="text-xl text-gray-400">/{feedback.totalQuestions}</span>
          </p>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Accuracy
          </span>
          <p className="mt-3 text-4xl font-bold text-gray-900">{accuracy}%</p>
          <div className="mt-3 w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-question results */}
      <div className="mt-8 space-y-6">
        {track.questionGroups.map((group, gi) => (
          <div key={gi}>
            <div className="rounded-t-lg border border-purple-100 bg-purple-50 px-4 py-3">
              <p className="text-xs font-medium text-purple-800">{group.instruction}</p>
            </div>
            <div className="divide-y divide-gray-100 rounded-b-lg border border-t-0 border-gray-200 bg-white">
              {group.questions.map((q) => {
                questionCounter++;
                const r = feedback.questionResults[q.id];
                if (!r) return null;
                return (
                  <div
                    key={q.id}
                    className={`p-4 ${r.correct ? "bg-green-50/30" : "bg-red-50/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          r.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.correct ? "✓" : "✗"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="mr-1.5 font-semibold text-gray-500">
                            {questionCounter}.
                          </span>
                          {"text" in q ? q.text : ""}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs">
                          <span className={`font-medium ${r.correct ? "text-green-700" : "text-red-600"}`}>
                            {t("listening_your_answer")}:{" "}
                            <span className="font-mono">{r.user_answer || "—"}</span>
                          </span>
                          {!r.correct && (
                            <span className="font-medium text-gray-700">
                              {t("listening_correct_answer")}:{" "}
                              <span className="font-mono text-green-700">{r.correct_answer}</span>
                            </span>
                          )}
                        </div>
                        {!r.correct && r.explanation && (
                          <p className="mt-2 text-xs italic text-gray-500">{r.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Transcript reveal */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setTranscriptOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="font-semibold text-gray-900">{t("listening_transcript_title")}</span>
          <span className="text-sm text-purple-600">
            {transcriptOpen ? t("listening_transcript_hide") : t("listening_transcript_show")}
          </span>
        </button>
        {transcriptOpen && (
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {track.transcript}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/listening"
          className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
        >
          {t("listening_practice_again")}
        </Link>
        <Link
          href="/history"
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          View history
        </Link>
      </div>
    </div>
  );
}
