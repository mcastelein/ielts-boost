"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { createClient } from "@/lib/supabase/client";
import type { ReadingPassage } from "@/lib/reading-passages";
import type { ScoredResults } from "@/lib/reading-scoring";
import ReadingResultsView from "@/components/reading/ReadingResultsView";

interface InlineResult {
  passage: ReadingPassage;
  raw_score: number;
  total_questions: number;
  band_score: number;
  question_results: ScoredResults;
}

export default function ReadingResultPage() {
  const { t } = useLanguage();
  const [result, setResult] = useState<InlineResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("reading_inline_result");
      if (raw) {
        setResult(JSON.parse(raw));
        sessionStorage.removeItem("reading_inline_result");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-gray-500">No results found.</p>
        <Link href="/reading" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Reading
        </Link>
      </div>
    );
  }

  const accuracy = Math.round((result.raw_score / result.total_questions) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Sign-in prompt — only for unauthenticated users */}
      {isLoggedIn === false && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {t("common_save_warning")}{" "}
          <Link href="/login" className="font-semibold underline">
            {t("login_submit")}
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900">{t("reading_feedback_title")}</h1>
      <p className="mt-1 text-sm text-gray-500">{result.passage.title}</p>

      {/* Score cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("reading_band_score")}
          </span>
          <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
            {result.band_score}
          </div>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {t("reading_raw_score")}
          </span>
          <p className="mt-3 text-4xl font-bold text-gray-900">
            {result.raw_score}
            <span className="text-xl text-gray-400">/{result.total_questions}</span>
          </p>
          <div className="mt-3 w-full">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="mt-1 text-center text-xs text-gray-500">{accuracy}%</p>
          </div>
        </div>
      </div>

      {/* Question-by-question results with answer-location review */}
      <ReadingResultsView passage={result.passage} results={result.question_results} />

      <div className="mt-8 flex gap-3">
        <Link
          href="/reading"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {t("reading_practice_again")}
        </Link>
        {isLoggedIn === false && (
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sign in to save progress
          </Link>
        )}
      </div>
    </div>
  );
}
