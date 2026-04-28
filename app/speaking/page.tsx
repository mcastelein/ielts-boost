"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SPEAKING_PROMPTS, type SpeakingPrompt } from "@/lib/speaking-prompts";

const USE_DB = process.env.NEXT_PUBLIC_CONTENT_SOURCE === "db";
import AudioRecorder from "@/components/audio-recorder";
import { useLanguage } from "@/lib/language-context";
import { createClient } from "@/lib/supabase/client";
import GuestBanner from "@/components/GuestBanner";

interface SpeakingFeedback {
  estimated_band: number;
  fluency_score: number;
  lexical_score: number;
  grammar_score: number;
  pronunciation_score: number;
  fluency_coherence: string;
  lexical_resource: string;
  grammar_range: string;
  pronunciation_note: string;
  strengths: string[];
  weaknesses: string[];
  improved_response: string;
  better_phrases: string[];
  follow_up_question?: string;
}

const PARTS = [1, 2, 3] as const;
type InputMode = "voice" | "text";

const SPEAKING_TIMER_SECONDS: Record<number, number> = {
  1: 60,   // Part 1: 1 min per question
  2: 120,  // Part 2: 2 min long turn
  3: 120,  // Part 3: 2 min per question
};

export default function SpeakingPageWrapper() {
  return (
    <Suspense>
      <SpeakingPage />
    </Suspense>
  );
}

function SpeakingPage() {
  const searchParams = useSearchParams();
  const initialPart = Number(searchParams.get("part"));
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(
    initialPart === 1 || initialPart === 2 || initialPart === 3 ? initialPart : 1
  );
  const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [transcriptReady, setTranscriptReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{ allowed: boolean; used: number; limit: number } | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setIsGuest(!data.user);
    });
  }, []);
  const [dbPrompts, setDbPrompts] = useState<SpeakingPrompt[]>([]);

  // Fetch prompts from DB when feature flag is on
  useEffect(() => {
    if (!USE_DB) return;
    createClient()
      .from("speaking_prompts")
      .select("part, topic, question, follow_up")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) {
          setDbPrompts(
            data.map((row) => ({
              part: row.part as 1 | 2 | 3,
              topic: row.topic,
              question: row.question,
              followUp: row.follow_up ?? undefined,
            }))
          );
        }
      });
  }, []);

  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(new Set());
  const [draftId, setDraftId] = useState<string | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerExpired, setTimerExpired] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { t, feedbackLocale } = useLanguage();

  const timerSeconds = SPEAKING_TIMER_SECONDS[selectedPart] ?? 120;

  const allPrompts = USE_DB ? dbPrompts : SPEAKING_PROMPTS;
  const prompts = allPrompts.filter((p) => p.part === selectedPart);

  // Check speaking usage limits and fetch completed prompts on mount
  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch completed prompt questions to avoid repeats
      const { data: submissions } = await supabase
        .from("speaking_submissions")
        .select("prompt")
        .eq("user_id", user.id)
        .eq("status", "completed");

      if (submissions) {
        setCompletedPrompts(new Set(submissions.map((s) => s.prompt)));
      }

      const { data: settings } = await supabase
        .from("user_settings")
        .select("plan_type")
        .eq("user_id", user.id)
        .single();

      if (settings?.plan_type === "pro") {
        setUsageInfo({ allowed: true, used: 0, limit: Infinity });
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const { data: usage } = await supabase
        .from("usage_tracking")
        .select("speaking_count")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      const used = usage?.speaking_count ?? 0;
      const limit = 3;
      setUsageInfo({ allowed: used < limit, used, limit });
    };
    init();
  }, []);

  // Timer effect — starts when prompt is shown and timer is enabled
  useEffect(() => {
    if (!currentPrompt || !timerEnabled || feedback) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setTimeLeft(timerSeconds);
    setTimerExpired(false);

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const remaining = Math.max(0, timerSeconds - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setTimerExpired(true);
        clearInterval(intervalRef.current!);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPrompt, timerEnabled, timerSeconds, feedback]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const playTTS = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch("/api/speaking/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      ttsAudioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const pickRandom = () => {
    // Filter out prompts the user has already completed
    let available = prompts.filter((p) => !completedPrompts.has(p.question));
    // If all prompts for this part are done, allow any prompt again
    if (available.length === 0) available = prompts;
    const pick = available[Math.floor(Math.random() * available.length)];
    setCurrentPrompt(pick);
    setResponse("");
    setFeedback(null);
    setTranscriptReady(false);
    setDraftId(null);
    setTimerExpired(false);
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!currentPrompt || !response.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setFeedback(null);
    setSaveWarning(false);
    setSubmitError(null);

    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt.question,
          response: response.trim(),
          part: selectedPart,
          feedbackLanguage: feedbackLocale,
          draft_id: draftId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || data.error || "Failed to evaluate response. Please try again.");
        return;
      }

      if (data.submission_id) {
        router.push(`/speaking/${data.submission_id}`);
        return;
      }

      // Unauthenticated or DB save failed — show inline
      if (data.estimated_band != null || data.strengths) {
        setFeedback(data);
        setSaveWarning(true);
      } else {
        setSubmitError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("Speaking submission failed:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && !isSubmitting && currentPrompt && response.trim()) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerExpired]);

  return (
    <>
      {isGuest && <GuestBanner />}
      <div className={`mx-auto w-full max-w-3xl px-4 py-6 sm:py-8${isGuest ? " pointer-events-none select-none opacity-50" : ""}`}>
      <h1 className="text-xl font-bold sm:text-2xl">{t("speaking_title")}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {t("speaking_subtitle")}
      </p>

      {/* Part selector */}
      <div className="mt-6 flex gap-2">
        {PARTS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSelectedPart(p);
              setCurrentPrompt(null);
              setResponse("");
              setFeedback(null);
              setTranscriptReady(false);
              setDraftId(null);
              setTimerExpired(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedPart === p
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t("speaking_part")} {p}{t("speaking_part_suffix")}
          </button>
        ))}
      </div>

      {/* Timer toggle */}
      <div className="mt-4 flex items-center gap-3">
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
        <span className="text-sm text-gray-700">
          {t("speaking_enable_timer")} ({Math.floor(timerSeconds / 60)} {t("common_min")})
        </span>
      </div>

      {/* Usage limit reached banner */}
      {usageInfo && !usageInfo.allowed && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-800">{t("writing_daily_limit")}</h3>
          <p className="mt-1 text-sm text-amber-700">
            You&apos;ve used {usageInfo.used}/{usageInfo.limit} free speaking submissions today. Upgrade to Pro for unlimited access.
          </p>
        </div>
      )}

      {/* Get prompt button */}
      {!currentPrompt && (
        <button
          onClick={pickRandom}
          disabled={usageInfo !== null && !usageInfo.allowed}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {usageInfo && !usageInfo.allowed
            ? `Daily limit reached (${usageInfo.used}/${usageInfo.limit})`
            : t("speaking_get_prompt")}
        </button>
      )}

      {/* Timer display + Prompt display */}
      {currentPrompt && (
        <>
          {timerEnabled && !feedback && (
            <div className="mt-6 flex items-center justify-center">
              <span
                className={`rounded-md px-3 py-1.5 text-lg font-mono font-semibold ${
                  timerExpired
                    ? "bg-red-100 text-red-700"
                    : timeLeft < 30
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {timerExpired ? t("speaking_times_up") : formatTime(timeLeft)}
              </span>
            </div>
          )}
          <div className={`${timerEnabled && !feedback ? "mt-3" : "mt-6"} rounded-xl border border-blue-200 bg-blue-50 p-5`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600">
                {t("speaking_part")} {currentPrompt.part}{t("speaking_part_suffix")} — {currentPrompt.topic}
              </span>
              <button
                onClick={pickRandom}
                className="text-xs text-blue-600 hover:underline"
              >
                {t("speaking_new_prompt")}
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-blue-900">
              {currentPrompt.question}
            </p>
          </div>
        </>
      )}

      {/* Input mode toggle + response input */}
      {currentPrompt && !feedback && (
        <>
          {/* Voice / Text toggle */}
          <div className="mt-4 flex items-center gap-1 rounded-lg bg-gray-100 p-1 w-fit">
            <button
              onClick={() => setInputMode("voice")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                inputMode === "voice"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              {t("speaking_voice")}
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                inputMode === "text"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
              </svg>
              {t("speaking_type")}
            </button>
          </div>

          {/* Voice input */}
          {inputMode === "voice" && !transcriptReady && (
            <div className="mt-4 flex flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-10">
              <AudioRecorder
                onTranscript={(text, savedDraftId) => {
                  setResponse(text);
                  setTranscriptReady(true);
                  if (savedDraftId) setDraftId(savedDraftId);
                }}
                extraFormData={currentPrompt ? {
                  prompt: currentPrompt.question,
                  part: String(selectedPart),
                } : undefined}
              />
              <p className="mt-3 text-xs text-gray-400">
                {t("speaking_record_note")}
              </p>
            </div>
          )}

          {/* Editable transcript (after voice recording) */}
          {inputMode === "voice" && transcriptReady && (
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-500">
                {t("speaking_transcript_edit")}
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-4 text-sm leading-relaxed text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={6}
                spellCheck={false}
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setResponse("");
                    setTranscriptReady(false);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t("speaking_rerecord")}
                </button>
              </div>
            </div>
          )}

          {/* Text input */}
          {inputMode === "text" && (
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={t("speaking_placeholder")}
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-4 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={8}
              spellCheck={false}
            />
          )}

          {/* Error message */}
          {submitError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Submit button - show when there's text to submit */}
          {response.trim() && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("speaking_submitting") : t("speaking_submit")}
              </button>
            </div>
          )}
        </>
      )}

      {/* Feedback display (fallback for unauthenticated users) */}
      {feedback && (
        <div className="mt-6 space-y-4">
          {saveWarning && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {t("common_save_warning")}
            </div>
          )}

          {/* Band estimate */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                {feedback.estimated_band}
              </div>
              <div>
                <h3 className="font-semibold">{t("speaking_estimated_band")}</h3>
                <p className="text-xs text-gray-500">
                  {t("speaking_text_only_note")}
                </p>
              </div>
            </div>
          </div>

          {/* Criteria */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">{t("speaking_fluency")}</p>
              <p className="mt-1 text-sm text-gray-700">{feedback.fluency_coherence}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">{t("speaking_lexical")}</p>
              <p className="mt-1 text-sm text-gray-700">{feedback.lexical_resource}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">{t("speaking_grammar")}</p>
              <p className="mt-1 text-sm text-gray-700">{feedback.grammar_range}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium text-gray-500">{t("speaking_pronunciation")}</p>
              <p className="mt-1 text-sm text-gray-700 italic">{feedback.pronunciation_note}</p>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-green-700">{t("speaking_strengths")}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-green-500">+</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-red-700">{t("speaking_weaknesses")}</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-500">-</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improved response with TTS */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t("speaking_stronger")}</h3>
              <button
                onClick={() => playTTS(feedback.improved_response)}
                disabled={isSpeaking}
                className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                {isSpeaking ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    {t("speaking_playing")}
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                    {t("speaking_listen")}
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 italic">
              {feedback.improved_response}
            </p>
          </div>

          {/* Better phrases */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="font-semibold text-blue-800">{t("speaking_better_phrases")}</h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-900">
              {feedback.better_phrases.map((phrase, i) => (
                <li key={i}>• {phrase}</li>
              ))}
            </ul>
          </div>

          {/* Follow-up question */}
          {feedback.follow_up_question && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-purple-800">{t("speaking_followup")}</h3>
                <button
                  onClick={() => playTTS(feedback.follow_up_question!)}
                  disabled={isSpeaking}
                  className="flex items-center gap-1.5 rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-200 disabled:opacity-50"
                >
                  {isSpeaking ? (
                    <>
                      <svg className="h-3.5 w-3.5 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                      {t("speaking_playing")}
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                      {t("speaking_listen")}
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-purple-900">
                {feedback.follow_up_question}
              </p>
              <button
                onClick={() => {
                  setCurrentPrompt({
                    ...currentPrompt!,
                    question: feedback.follow_up_question!,
                  });
                  setFeedback(null);
                  setResponse("");
                  setTranscriptReady(false);
                }}
                className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                {t("speaking_answer_this")}
              </button>
            </div>
          )}

          {/* Try again */}
          <button
            onClick={() => {
              setFeedback(null);
              setResponse("");
              setTranscriptReady(false);
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("speaking_try_again")}
          </button>
        </div>
      )}
      </div>
    </>
  );
}
