"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import {
  READING_PASSAGES,
  getTotalQuestions,
  type ReadingPassage,
} from "@/lib/reading-passages";
import { PARAGRAPH_LABELS } from "@/components/reading/PassageViewer";
import PassageViewer from "@/components/reading/PassageViewer";
import QuestionGroupComponent from "@/components/reading/QuestionGroup";

type Step = "setup" | "practice";

export default function ReadingPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();

  // ── Setup state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("setup");
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);

  // ── Practice state ───────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [highlightedParagraph, setHighlightedParagraph] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"passage" | "questions">("passage");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer
  const TIMER_SECONDS = 60 * 60; // 60 minutes
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for independent panel scroll
  const passagePanelRef = useRef<HTMLDivElement>(null);
  const questionsPanelRef = useRef<HTMLDivElement>(null);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "practice" || !timerEnabled) return;

    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const remaining = Math.max(0, TIMER_SECONDS - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setTimerExpired(true);
        clearInterval(intervalRef.current!);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [step, timerEnabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeUsed = startTimeRef.current
    ? Math.floor((Date.now() - startTimeRef.current) / 1000)
    : null;

  // ── Answer counting ───────────────────────────────────────────────────────
  const totalQuestions = selectedPassage ? getTotalQuestions(selectedPassage) : 0;
  const answeredCount = Object.values(answers).filter((v) => v && v.trim()).length;

  // ── Paragraph labels for the selected passage ─────────────────────────────
  const paragraphLabels = selectedPassage
    ? selectedPassage.passageText
        .split(/\n\n+/)
        .filter(Boolean)
        .map((_, i) => PARAGRAPH_LABELS[i] ?? `${i + 1}`)
    : [];

  // ── Start practice ────────────────────────────────────────────────────────
  const handleStart = () => {
    if (!selectedPassage) return;
    setAnswers({});
    setHighlightedParagraph(null);
    setTimerExpired(false);
    setTimeLeft(TIMER_SECONDS);
    setActiveTab("passage");
    setStep("practice");
  };

  // ── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedPassage || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passageId: selectedPassage.id,
          answers,
          timeUsedSeconds: timeUsed,
          feedbackLanguage: locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(t("reading_daily_limit_desc"));
        } else {
          setError(data.error || t("common_error"));
        }
        setSubmitting(false);
        return;
      }

      if (data.submission_id) {
        router.push(`/reading/${data.submission_id}`);
      } else {
        // Unauthenticated — store result in sessionStorage and redirect to inline results
        sessionStorage.setItem(
          "reading_inline_result",
          JSON.stringify({
            passage: selectedPassage,
            raw_score: data.raw_score,
            total_questions: data.total_questions,
            band_score: data.band_score,
            question_results: data.question_results,
          })
        );
        router.push("/reading/result");
      }
    } catch {
      setError(t("common_error"));
      setSubmitting(false);
    }
  };

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && !submitting) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerExpired]);

  // ── SETUP STEP ────────────────────────────────────────────────────────────
  if (step === "setup") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">{t("reading_title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("reading_setup_subtitle")}</p>

        {/* Timer toggle */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTimerEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
              timerEnabled ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                timerEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">{t("reading_enable_timer")}</span>
        </div>

        {/* Passage grid */}
        <h2 className="mt-8 text-base font-semibold text-gray-700">
          {t("reading_choose_passage")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {READING_PASSAGES.map((passage) => {
            const isSelected = selectedPassage?.id === passage.id;
            const qCount = getTotalQuestions(passage);
            return (
              <button
                key={passage.id}
                type="button"
                onClick={() => setSelectedPassage(passage)}
                className={`rounded-xl border-2 p-5 text-left transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-gray-900">{passage.title}</span>
                  <span className="shrink-0 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {t("reading_academic_badge")}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {passage.topicTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {t("reading_difficulty")}:{" "}
                    {Array.from({ length: 3 }, (_, i) => (
                      <span
                        key={i}
                        className={i < passage.difficulty ? "text-blue-500" : "text-gray-300"}
                      >
                        ●
                      </span>
                    ))}
                  </span>
                  <span>
                    {qCount} {t("reading_questions_count")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start button */}
        <div className="mt-8">
          <button
            type="button"
            disabled={!selectedPassage}
            onClick={handleStart}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("reading_start")}
          </button>
        </div>
      </div>
    );
  }

  // ── PRACTICE STEP ─────────────────────────────────────────────────────────
  if (!selectedPassage) return null;

  let questionCounter = 0;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep("setup")}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            ← {t("reading_back")}
          </button>
          <span className="hidden text-sm font-semibold text-gray-900 sm:block">
            {selectedPassage.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {answeredCount}/{totalQuestions} {t("reading_answered")}
          </span>
          {timerEnabled && (
            <span
              className={`rounded-md px-2.5 py-1 text-sm font-mono font-semibold ${
                timerExpired
                  ? "bg-red-100 text-red-700"
                  : timeLeft < 300
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {timerExpired ? t("reading_times_up") : formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="flex border-b border-gray-200 bg-white lg:hidden">
        {(["passage", "questions"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "passage" ? t("reading_passage_tab") : t("reading_questions_tab")}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Passage panel */}
        <div
          ref={passagePanelRef}
          className={`overflow-y-auto p-4 lg:w-[55%] lg:border-r lg:border-gray-200 lg:p-6 ${
            activeTab === "passage" ? "w-full" : "hidden lg:block"
          }`}
        >
          <PassageViewer
            passageText={selectedPassage.passageText}
            highlightedParagraph={highlightedParagraph}
          />
        </div>

        {/* Questions panel */}
        <div
          ref={questionsPanelRef}
          className={`flex flex-col overflow-y-auto lg:w-[45%] ${
            activeTab === "questions" ? "w-full" : "hidden lg:flex"
          }`}
        >
          <div className="flex-1 space-y-6 p-4 lg:p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {selectedPassage.questionGroups.map((group, gi) => {
              const startingNumber = questionCounter + 1;
              questionCounter += group.questions.length;

              return (
                <QuestionGroupComponent
                  key={gi}
                  group={group}
                  groupIndex={gi}
                  startingNumber={startingNumber}
                  paragraphLabels={paragraphLabels}
                  answers={answers}
                  onAnswer={handleAnswer}
                  disabled={submitting}
                />
              );
            })}
          </div>

          {/* Submit button — sticky at bottom */}
          <div className="border-t border-gray-200 bg-white p-4">
            <button
              type="button"
              disabled={submitting || answeredCount === 0}
              onClick={handleSubmit}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? t("reading_submitting") : t("reading_submit")}
            </button>
            {answeredCount < totalQuestions && (
              <p className="mt-1.5 text-center text-xs text-gray-400">
                {totalQuestions - answeredCount} unanswered questions
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
