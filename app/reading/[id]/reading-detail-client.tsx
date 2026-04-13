"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import type { ReadingPassage } from "@/lib/reading-passages";
import type { ScoredResults } from "@/lib/reading-scoring";
import { PARAGRAPH_LABELS } from "@/components/reading/PassageViewer";

interface SubmissionData {
  id: string;
  passageTitle: string;
  passageSlug: string;
  examType: string;
  timeUsedSeconds: number | null;
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
  passage: ReadingPassage;
}

export default function ReadingDetailClient({ submission, feedback, passage }: Props) {
  const { t } = useLanguage();
  const accuracy = Math.round((feedback.rawScore / feedback.totalQuestions) * 100);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  let questionCounter = 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("reading_feedback_title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{submission.passageTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            {t("reading_academic_badge")}
          </span>
          {submission.timeUsedSeconds !== null && (
            <span className="text-xs text-gray-400">
              {formatTime(submission.timeUsedSeconds)}
            </span>
          )}
        </div>
      </div>

      {/* Score cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Band score */}
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("reading_band_score")}
          </span>
          <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
            {feedback.bandScore}
          </div>
        </div>

        {/* Raw score */}
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("reading_raw_score")}
          </span>
          <p className="mt-3 text-4xl font-bold text-gray-900">
            {feedback.rawScore}
            <span className="text-xl text-gray-400">/{feedback.totalQuestions}</span>
          </p>
          <div className="mt-3 w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-gray-500">{accuracy}%</p>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Submitted
          </span>
          <p className="mt-3 text-center text-sm font-medium text-gray-700">
            {new Date(submission.createdAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(submission.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Question-by-question results */}
      <div className="mt-8 space-y-6">
        {passage.questionGroups.map((group, gi) => (
          <div key={gi}>
            <div className="rounded-t-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium text-blue-800">{group.instruction}</p>
            </div>

            <div className="divide-y divide-gray-100 rounded-b-lg border border-t-0 border-gray-200 bg-white">
              {group.questions.map((q, qi) => {
                questionCounter++;
                const result = feedback.questionResults[q.id];
                if (!result) return null;

                return (
                  <div
                    key={q.id}
                    className={`p-4 ${
                      result.correct ? "bg-green-50/30" : "bg-red-50/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          result.correct
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.correct ? "✓" : "✗"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="mr-1.5 font-semibold text-gray-500">
                            {questionCounter}.
                          </span>
                          {q.type === "matching_headings"
                            ? `Paragraph ${(q as { paragraphLabel: string }).paragraphLabel}`
                            : "text" in q
                            ? q.text
                            : ""}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-4 text-xs">
                          <span
                            className={`font-medium ${
                              result.correct ? "text-green-700" : "text-red-600"
                            }`}
                          >
                            {t("reading_your_answer")}:{" "}
                            <span className="font-mono">
                              {result.user_answer || "—"}
                            </span>
                          </span>
                          {!result.correct && (
                            <span className="font-medium text-gray-700">
                              {t("reading_correct_answer")}:{" "}
                              <span className="font-mono text-green-700">
                                {result.correct_answer}
                              </span>
                            </span>
                          )}
                        </div>

                        {!result.correct && result.explanation && (
                          <p className="mt-2 text-xs text-gray-500 italic">
                            {result.explanation}
                          </p>
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

      {/* Action buttons */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/reading"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t("reading_practice_again")}
        </Link>
        <Link
          href={`/reading?passage=${submission.passageSlug}`}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t("reading_retry_passage")}
        </Link>
        <Link
          href="/history"
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          History
        </Link>
      </div>
    </div>
  );
}
