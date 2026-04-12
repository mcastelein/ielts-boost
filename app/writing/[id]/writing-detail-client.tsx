"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

interface SentenceCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface FeedbackJson {
  strengths: string[];
  weaknesses: string[];
  sentence_corrections: SentenceCorrection[];
  rewrite_example: string;
  top_3_improvements: string[];
}

interface Props {
  submission: {
    task_type: string;
    prompt_topic: string | null;
    created_at: string;
    time_used_seconds: number | null;
    final_text: string;
  };
  feedback: {
    overall_band: number;
    task_score: number;
    coherence_score: number;
    lexical_score: number;
    grammar_score: number;
    feedback_json: FeedbackJson;
  };
}

export default function WritingDetailClient({ submission, feedback }: Props) {
  const { t } = useLanguage();
  const fb = feedback.feedback_json;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("feedback_title")}</h1>
        <Link
          href="/writing"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t("feedback_new_essay")}
        </Link>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
        <span>{submission.task_type === "task1" ? "Task 1" : "Task 2"}</span>
        {submission.prompt_topic && (
          <>
            <span>&middot;</span>
            <span className="font-medium text-gray-700">{submission.prompt_topic}</span>
          </>
        )}
        <span>&middot;</span>
        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
        {submission.time_used_seconds != null && (
          <>
            <span>&middot;</span>
            <span>
              {Math.floor(submission.time_used_seconds / 60)}:{(submission.time_used_seconds % 60).toString().padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* Band scores */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">{t("feedback_band_score")}</h2>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
            {feedback.overall_band}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-gray-500">{t("feedback_task_achievement")}:</span>{" "}
              <span className="font-semibold">{feedback.task_score}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("feedback_coherence")}:</span>{" "}
              <span className="font-semibold">{feedback.coherence_score}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("feedback_lexical")}:</span>{" "}
              <span className="font-semibold">{feedback.lexical_score}</span>
            </div>
            <div>
              <span className="text-gray-500">{t("feedback_grammar")}:</span>{" "}
              <span className="font-semibold">{feedback.grammar_score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-green-700">{t("feedback_strengths")}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {fb.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-500">+</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-red-700">{t("feedback_weaknesses")}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {fb.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-500">-</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sentence Corrections */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold">{t("feedback_corrections")}</h3>
        <div className="mt-3 space-y-4">
          {fb.sentence_corrections.map((c, i) => (
            <div key={i} className="text-sm">
              <p className="text-red-600 line-through">{c.original}</p>
              <p className="text-green-700">{c.corrected}</p>
              <p className="mt-1 text-xs text-gray-500">{c.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rewrite example */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold">{t("feedback_rewrite")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 italic">
          {fb.rewrite_example}
        </p>
      </div>

      {/* Top 3 improvements */}
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-800">{t("feedback_top3")}</h3>
        <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-blue-900">
          {fb.top_3_improvements.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ol>
      </div>

      {/* Original essay */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold">{t("feedback_your_essay")}</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
          {submission.final_text}
        </p>
      </div>
    </div>
  );
}
