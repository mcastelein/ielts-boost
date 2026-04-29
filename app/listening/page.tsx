"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import {
  getTotalListeningQuestions,
  type ListeningTrack,
} from "@/lib/listening-tracks";
import { dbRowToTrack } from "@/lib/content-mappers";
import GuestBanner from "@/components/GuestBanner";
import { createClient } from "@/lib/supabase/client";

type Step = "setup" | "loading" | "practice";

export default function ListeningPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();

  const [isGuest, setIsGuest] = useState(false);
  const [dbTracks, setDbTracks] = useState<ListeningTrack[]>([]);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setIsGuest(!data.user);
    });
  }, []);

  useEffect(() => {
    createClient()
      .from("listening_tracks")
      .select("slug, title, section, difficulty, topic_tags, context, transcript, question_groups, audio_url")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) setDbTracks(data.map(dbRowToTrack));
      });
  }, []);

  // ── Setup state ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("setup");
  const [selectedTrack, setSelectedTrack] = useState<ListeningTrack | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── Practice state ───────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Audio state ──────────────────────────────────────────────────────────
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Keep the object URL in a ref so we can revoke it on unmount/reset
  // without having it in the loading effect's cleanup (which would revoke
  // too early — the cleanup fires when step changes to "practice").
  const audioObjectUrlRef = useRef<string | null>(null);

  // ── Timer ────────────────────────────────────────────────────────────────
  const TIMER_SECONDS = 30 * 60; // 30 minutes
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // ── Load audio ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "loading" || !selectedTrack) return;

    let cancelled = false;

    const loadAudio = async () => {
      try {
        // Use pre-generated cached URL when available (instant, no TTS cost)
        if (selectedTrack.audioUrl) {
          if (!cancelled) {
            setAudioUrl(selectedTrack.audioUrl);
            setStep("practice");
          }
          return;
        }

        // Fallback: generate via TTS (for tracks not yet cached)
        const res = await fetch("/api/speaking/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: selectedTrack.transcript }),
        });

        if (!res.ok) throw new Error("TTS request failed");

        const blob = await res.blob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        audioObjectUrlRef.current = url;
        setAudioUrl(url);
        setStep("practice");
      } catch {
        if (!cancelled) {
          setLoadError("Failed to generate audio. Please try again.");
          setStep("setup");
        }
      }
    };

    loadAudio();

    return () => { cancelled = true; };
  }, [step, selectedTrack]);

  // ── Wire up audio element ─────────────────────────────────────────────────
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [audioUrl]);

  // Revoke the object URL only when the component unmounts
  useEffect(() => {
    return () => {
      if (audioObjectUrlRef.current) {
        URL.revokeObjectURL(audioObjectUrlRef.current);
        audioObjectUrlRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  }, []);

  // ── Answer counting ───────────────────────────────────────────────────────
  const totalQuestions = selectedTrack ? getTotalListeningQuestions(selectedTrack) : 0;
  const answeredCount = Object.values(answers).filter((v) => v && v.trim()).length;

  // ── Answer handler ────────────────────────────────────────────────────────
  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  // ── Start ─────────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (!selectedTrack) return;
    // Revoke any previous audio URL before starting a new session
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
      audioObjectUrlRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAnswers({});
    setTimerExpired(false);
    setTimeLeft(TIMER_SECONDS);
    setAudioUrl(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setError(null);
    setLoadError(null);
    setStep("loading");
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedTrack || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: selectedTrack.id,
          answers,
          feedbackLanguage: locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(t("listening_daily_limit_desc"));
        } else {
          setError(data.error || t("common_error"));
        }
        setSubmitting(false);
        return;
      }

      if (data.submission_id) {
        router.push(`/listening/${data.submission_id}`);
      } else {
        sessionStorage.setItem(
          "listening_inline_result",
          JSON.stringify({
            track: selectedTrack,
            raw_score: data.raw_score,
            total_questions: data.total_questions,
            band_score: data.band_score,
            question_results: data.question_results,
          })
        );
        router.push("/listening/result");
      }
    } catch {
      setError(t("common_error"));
      setSubmitting(false);
    }
  };

  // ── SETUP STEP ────────────────────────────────────────────────────────────
  if (step === "setup") {
    return (
      <>
        {isGuest && <GuestBanner />}
        <div className={`mx-auto max-w-4xl px-4 py-8${isGuest ? " pointer-events-none select-none opacity-50" : ""}`}>
        <h1 className="text-2xl font-bold text-gray-900">{t("listening_title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("listening_setup_subtitle")}</p>

        {loadError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

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
          <span className="text-sm text-gray-700">{t("listening_enable_timer")}</span>
        </div>

        {/* Track grid */}
        <h2 className="mt-8 text-base font-semibold text-gray-700">
          {t("listening_choose_track")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {dbTracks.map((track) => {
            const isSelected = selectedTrack?.id === track.id;
            const qCount = getTotalListeningQuestions(track);
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrack(track)}
                className={`rounded-xl border-2 p-5 text-left transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-gray-900">{track.title}</span>
                  <span className="shrink-0 rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                    {t("listening_section_badge")} {track.section}{t("listening_section_badge_suffix")}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {track.topicTags.map((tag) => (
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
                    {t("listening_difficulty")}:{" "}
                    {Array.from({ length: 3 }, (_, i) => (
                      <span
                        key={i}
                        className={i < track.difficulty ? "text-purple-500" : "text-gray-300"}
                      >
                        ●
                      </span>
                    ))}
                  </span>
                  <span>
                    {qCount} {t("listening_questions_count")}
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
            disabled={!selectedTrack}
            onClick={handleStart}
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("listening_start")}
          </button>
        </div>
        </div>
      </>
    );
  }

  // ── LOADING STEP ──────────────────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        <p className="mt-4 text-base font-semibold text-gray-900">{t("listening_loading")}</p>
        <p className="mt-1 text-sm text-gray-500">{t("listening_loading_desc")}</p>
      </div>
    );
  }

  // ── PRACTICE STEP ─────────────────────────────────────────────────────────
  if (!selectedTrack) return null;

  let questionCounter = 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep("setup")}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          ← {t("listening_back")}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {answeredCount}/{totalQuestions} {t("listening_answered")}
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
              {timerExpired ? t("listening_times_up") : formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Situation card */}
      <div className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm text-purple-900">
        <span className="font-semibold">{t("listening_context_label")} </span>
        {selectedTrack.context}
      </div>

      {/* Audio player */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          {t("listening_audio_label")} — {selectedTrack.title}
        </p>

        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? (
              /* Pause icon */
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              /* Play icon */
              <svg className="h-4 w-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div className="flex flex-1 flex-col gap-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(Math.floor(currentTime))}</span>
              <span>{duration ? formatTime(Math.floor(duration)) : "--:--"}</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">{t("listening_replay_note")}</p>
      </div>

      {/* Questions */}
      <div className="mt-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {selectedTrack.questionGroups.map((group, gi) => {
          const startingNumber = questionCounter + 1;
          questionCounter += group.questions.length;

          return (
            <div key={gi} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {/* Group instruction */}
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-700">{group.instruction}</p>
                {group.sharedOptions && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.sharedOptions.map((opt, i) => (
                      <span key={i} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-100">
                {group.questions.map((q, qi) => {
                  const qNumber = startingNumber + qi;

                  if (q.type === "mcq") {
                    return (
                      <div key={q.id} className="p-4">
                        <p className="text-sm text-gray-800">
                          <span className="mr-1.5 font-semibold text-gray-500">{qNumber}.</span>
                          {q.text}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {q.options.map((opt) => {
                            const letter = opt.charAt(0);
                            const isSelected = answers[q.id] === letter;
                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={submitting}
                                onClick={() => handleAnswer(q.id, letter)}
                                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                  isSelected
                                    ? "border-purple-500 bg-purple-50 text-purple-900"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/30"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (q.type === "sentence_completion" || q.type === "summary_completion") {
                    return (
                      <div key={q.id} className="p-4">
                        <label className="text-sm text-gray-800">
                          <span className="mr-1.5 font-semibold text-gray-500">{qNumber}.</span>
                          {q.text}
                        </label>
                        <input
                          type="text"
                          value={answers[q.id] ?? ""}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          disabled={submitting}
                          placeholder={`${t("listening_word_limit")} ${q.wordLimit} ${t("listening_words")}`}
                          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                          spellCheck={false}
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <button
          type="button"
          disabled={submitting || answeredCount === 0}
          onClick={handleSubmit}
          className="w-full rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? t("listening_submitting") : t("listening_submit")}
        </button>
        {answeredCount < totalQuestions && (
          <p className="mt-1.5 text-center text-xs text-gray-400">
            {totalQuestions - answeredCount} unanswered questions
          </p>
        )}
      </div>
    </div>
  );
}
