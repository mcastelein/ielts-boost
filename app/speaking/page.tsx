"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SPEAKING_PROMPTS, type SpeakingPrompt } from "@/lib/speaking-prompts";
import AudioRecorder from "@/components/audio-recorder";
import { useLanguage } from "@/lib/language-context";
import { createClient } from "@/lib/supabase/client";

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

export default function SpeakingPage() {
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(1);
  const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [transcriptReady, setTranscriptReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{ allowed: boolean; used: number; limit: number } | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { t, feedbackLocale } = useLanguage();

  const prompts = SPEAKING_PROMPTS.filter((p) => p.part === selectedPart);

  // Check speaking usage limits on mount
  useEffect(() => {
    const checkUsage = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
    checkUsage();
  }, []);

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
    const filtered = prompts;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentPrompt(pick);
    setResponse("");
    setFeedback(null);
    setTranscriptReady(false);
  };

  const handleSubmit = async () => {
    if (!currentPrompt || !response.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setFeedback(null);
    setSaveWarning(false);

    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt.question,
          response: response.trim(),
          part: selectedPart,
          feedbackLanguage: feedbackLocale,
        }),
      });

      const data = await res.json();

      if (data.submission_id) {
        router.push(`/speaking/${data.submission_id}`);
        return;
      }

      // Unauthenticated or DB save failed — show inline
      setFeedback(data);
      if (!data.submission_id) {
        setSaveWarning(true);
      }
    } catch (err) {
      console.error("Speaking submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t("speaking_title")}</h1>
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

      {/* Prompt display */}
      {currentPrompt && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
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
                onTranscript={(text) => {
                  setResponse(text);
                  setTranscriptReady(true);
                }}
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
            />
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
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
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
  );
}
