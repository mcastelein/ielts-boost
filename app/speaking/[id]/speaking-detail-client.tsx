"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/language-context";

interface SpeakingFeedback {
  estimated_band: number;
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

interface SpeakingSubmission {
  id: string;
  prompt: string;
  response_text: string;
  part: number | null;
  created_at: string;
}

export default function SpeakingDetailClient({
  submission,
  feedback,
}: {
  submission: SpeakingSubmission;
  feedback: SpeakingFeedback;
}) {
  const { t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("speaking_title")}</h1>
        <div className="flex gap-2">
          <Link
            href="/speaking"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t("speaking_new_practice")}
          </Link>
          {submission.part != null && submission.part < 3 && (
            <Link
              href={`/speaking?part=${submission.part + 1}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("speaking_continue_part")} {submission.part + 1}{t("speaking_continue_part_suffix")}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
        {submission.part && (
          <span>
            {t("speaking_part")} {submission.part}{t("speaking_part_suffix")}
          </span>
        )}
        <span>&middot;</span>
        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
      </div>

      {/* Prompt */}
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-medium text-blue-600">{t("speaking_prompt_label")}</p>
        <p className="mt-1 text-sm leading-relaxed text-blue-900">
          {submission.prompt}
        </p>
      </div>

      {/* Band estimate */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
      <div className="mt-4 grid gap-4 md:grid-cols-2">
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
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
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
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-800">{t("speaking_better_phrases")}</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-900">
          {feedback.better_phrases.map((phrase, i) => (
            <li key={i}>• {phrase}</li>
          ))}
        </ul>
      </div>

      {/* Follow-up question */}
      {feedback.follow_up_question && (
        <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 p-5">
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
        </div>
      )}

      {/* Your response */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold">{t("speaking_your_response")}</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
          {submission.response_text}
        </p>
      </div>
    </div>
  );
}
