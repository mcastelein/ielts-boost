"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  WritingPrompt,
  WRITING_PROMPTS,
  getRandomWritingPrompt,
} from "@/lib/writing-prompts";
import TaskChart from "@/components/TaskChart";
import { useLanguage } from "@/lib/language-context";

interface SentenceCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface FeedbackResult {
  overall_band: number;
  task_score: number;
  coherence_score: number;
  lexical_score: number;
  grammar_score: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    sentence_corrections: SentenceCorrection[];
    rewrite_example: string;
    top_3_improvements: string[];
  };
}

const TASK_TYPES = [
  { value: "task1", label: "Task 1", minWords: 150, timeMinutes: 20 },
  { value: "task2", label: "Task 2", minWords: 250, timeMinutes: 40 },
];

type InputMode = "text" | "upload";
type PageStep = "setup" | "writing";

const SESSION_KEY = "ieltsboost_writing_session";

interface WritingSession {
  taskType: string;
  prompt: WritingPrompt | null;
  essay: string;
  endTime: number; // absolute timestamp in ms
  useOwnTopic: boolean;
}

function saveSession(session: WritingSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession(): WritingSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export default function WritingPage() {
  const { t, feedbackLocale } = useLanguage();
  const [taskType, setTaskType] = useState("task2");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [essay, setEssay] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Prompt & practice flow state
  const [step, setStep] = useState<PageStep>("setup");
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [useOwnTopic, setUseOwnTopic] = useState(false);
  const [showPromptList, setShowPromptList] = useState(false);
  const [pendingSession, setPendingSession] = useState<WritingSession | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const selectedTask = TASK_TYPES.find((task) => task.value === taskType)!;

  // Check for existing session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setPendingSession(session);
    }
    setSessionLoaded(true);
  }, []);

  // Persist essay text to session as user types
  useEffect(() => {
    if (step === "writing" && endTimeRef.current) {
      saveSession({
        taskType,
        prompt: selectedPrompt,
        essay,
        endTime: endTimeRef.current,
        useOwnTopic,
      });
    }
  }, [essay, step, taskType, selectedPrompt, useOwnTopic]);

  // Auto-scroll to feedback when result appears
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  // Timer tick — derives timeLeft from wall clock
  useEffect(() => {
    if (timerRunning && endTimeRef.current) {
      const tick = () => {
        const remaining = Math.max(
          0,
          Math.round((endTimeRef.current! - Date.now()) / 1000)
        );
        setTimeLeft(remaining);
      };
      tick();
      timerRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleStartPractice = () => {
    const endTime = Date.now() + selectedTask.timeMinutes * 60 * 1000;
    endTimeRef.current = endTime;
    setStep("writing");
    setTimerRunning(true);
    saveSession({
      taskType,
      prompt: selectedPrompt,
      essay: "",
      endTime,
      useOwnTopic,
    });
  };

  const handleContinueSession = () => {
    if (!pendingSession) return;
    setTaskType(pendingSession.taskType);
    setSelectedPrompt(pendingSession.prompt);
    setUseOwnTopic(pendingSession.useOwnTopic);
    setEssay(pendingSession.essay);
    endTimeRef.current = pendingSession.endTime;
    setStep("writing");
    setTimerRunning(true);
    setPendingSession(null);
  };

  const handleDiscardSession = () => {
    clearSession();
    setPendingSession(null);
  };

  const handleBackToSetup = () => {
    setStep("setup");
    setTimerRunning(false);
    setTimeLeft(null);
    endTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setEssay("");
    setResult(null);
    setError(null);
    clearSession();
    clearFile();
  };

  const filteredPrompts = WRITING_PROMPTS.filter(
    (p) => p.taskType === taskType
  );

  const activeText = extractedText ?? essay;
  const wordCount = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
  const isBelowMin = wordCount > 0 && wordCount < selectedTask.minWords;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(selected.type)) {
      alert("Please upload a JPG, PNG, WebP, or PDF file.");
      return;
    }

    setFile(selected);
    setExtractedText(null);

    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  const handleUploadAndExtract = async () => {
    if (!file) return;
    setIsExtracting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let fileUrl: string | null = null;

      // Upload to Supabase storage if authenticated
      if (user) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(path, file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(path);
          fileUrl = urlData.publicUrl;
        }
      }

      // Send to OCR endpoint
      const formData = new FormData();
      formData.append("file", file);
      if (fileUrl) formData.append("fileUrl", fileUrl);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setExtractedText(data.text);
      } else {
        alert("Could not extract text from this file. Please try typing instead.");
      }
    } catch (err) {
      console.error("Extraction failed:", err);
      alert("Extraction failed. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async () => {
    const textToSubmit = extractedText ?? essay;
    if (!textToSubmit.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setResult(null);
    setError(null);

    // Stop the timer and calculate time used
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const timeUsedSeconds = endTimeRef.current
      ? Math.max(0, Math.round((selectedTask.timeMinutes * 60) - Math.max(0, (endTimeRef.current - Date.now()) / 1000)))
      : null;

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay: textToSubmit.trim(),
          taskType,
          inputType: extractedText ? "image" : "text",
          promptTopic: selectedPrompt?.topic ?? null,
          timeUsedSeconds,
          feedbackLanguage: feedbackLocale,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setError(data.message);
        return;
      }

      clearSession();

      if (data.submission_id) {
        router.push(`/writing/${data.submission_id}`);
        return;
      }
      setResult(data);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setExtractedText(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t("writing_title")}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {step === "setup"
          ? t("writing_setup_subtitle")
          : t("writing_writing_subtitle")}
      </p>

      {/* ── Continue session banner ── */}
      {step === "setup" && sessionLoaded && pendingSession && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800">
                {t("writing_unfinished")}
              </p>
              <p className="mt-0.5 text-xs text-blue-600">
                {pendingSession.prompt?.topic ?? "Own topic"} &middot;{" "}
                {(() => {
                  const remaining = Math.max(0, Math.round((pendingSession.endTime - Date.now()) / 1000));
                  if (remaining <= 0) return t("writing_times_up");
                  const m = Math.floor(remaining / 60);
                  const s = remaining % 60;
                  return `${m}:${s.toString().padStart(2, "0")} remaining`;
                })()}
                {pendingSession.essay && ` \u00b7 ${pendingSession.essay.trim().split(/\\s+/).length} ${t("writing_words")}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscardSession}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                {t("writing_discard")}
              </button>
              <button
                onClick={handleContinueSession}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                {t("writing_continue")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Setup ── */}
      {step === "setup" && (
        <>
          {/* Task type selector */}
          <div className="mt-6 flex gap-2">
            {TASK_TYPES.map((task) => (
              <button
                key={task.value}
                onClick={() => {
                  setTaskType(task.value);
                  setSelectedPrompt(null);
                  setShowPromptList(false);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  taskType === task.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {task.label} ({task.timeMinutes} {t("common_min")})
              </button>
            ))}
          </div>

          {/* Prompt selection */}
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">{t("writing_choose_prompt")}</h2>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPrompt(
                    getRandomWritingPrompt(taskType as "task1" | "task2")
                  );
                  setUseOwnTopic(false);
                  setShowPromptList(false);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {t("writing_random_prompt")}
              </button>
              <button
                onClick={() => {
                  setShowPromptList(!showPromptList);
                  setUseOwnTopic(false);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${
                  showPromptList
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                {t("writing_browse_prompts")}
              </button>
              <button
                onClick={() => {
                  setUseOwnTopic(true);
                  setSelectedPrompt(null);
                  setShowPromptList(false);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${
                  useOwnTopic
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                {t("writing_own_topic")}
              </button>
            </div>

            {/* Prompt list */}
            {showPromptList && (
              <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                {filteredPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedPrompt(p);
                      setShowPromptList(false);
                      setUseOwnTopic(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      selectedPrompt === p ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    <span className="font-medium">{p.topic}</span>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                      {p.prompt}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Selected prompt preview */}
            {selectedPrompt && !showPromptList && (
              <div className="space-y-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {selectedPrompt.topic}
                  </p>
                  <p className="mt-2 text-sm text-gray-800 leading-relaxed">
                    {selectedPrompt.prompt}
                  </p>
                </div>
                {selectedPrompt.chart && (
                  <TaskChart chart={selectedPrompt.chart} />
                )}
              </div>
            )}

            {useOwnTopic && (
              <p className="text-sm text-gray-500 italic">
                {t("writing_own_topic_note")}
              </p>
            )}
          </div>

          {/* Start button */}
          <button
            onClick={handleStartPractice}
            disabled={!selectedPrompt && !useOwnTopic}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("writing_start")} ({selectedTask.timeMinutes} {t("common_min")})
          </button>
        </>
      )}

      {/* ── STEP 2: Writing ── */}
      {step === "writing" && (
        <>
          {/* Timer bar */}
          <div className="sticky top-0 z-10 mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <button
              onClick={handleBackToSetup}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              &larr; {t("writing_back")}
            </button>

            {timeLeft !== null && (
              <span
                className={`text-lg font-mono font-bold ${
                  timeLeft <= 300
                    ? timeLeft <= 60
                      ? "text-red-600 animate-pulse"
                      : "text-amber-600"
                    : "text-gray-800"
                }`}
              >
                {timeLeft > 0 ? formatTime(timeLeft) : t("writing_times_up")}
              </span>
            )}

            <span className="text-xs font-medium text-gray-400 uppercase">
              {selectedTask.label}
            </span>
          </div>

          {/* Prompt display */}
          {selectedPrompt && (
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {selectedPrompt.topic}
                </p>
                <p className="mt-1 text-sm text-gray-800 leading-relaxed">
                  {selectedPrompt.prompt}
                </p>
              </div>
              {selectedPrompt.chart && (
                <TaskChart chart={selectedPrompt.chart} />
              )}
            </div>
          )}

          {/* Input mode tabs */}
          <div className="mt-4 flex border-b border-gray-200">
            <button
              onClick={() => { setInputMode("text"); clearFile(); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                inputMode === "text"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("writing_type_paste")}
            </button>
            <button
              onClick={() => setInputMode("upload")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                inputMode === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("writing_upload")}
            </button>
          </div>

          {/* Text input */}
          {inputMode === "text" && (
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder={`${t("writing_placeholder")} (${t("writing_min_words")} ${selectedTask.minWords} ${t("writing_words")})...`}
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-4 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={16}
            />
          )}

          {/* Upload input */}
          {inputMode === "upload" && !extractedText && (
            <div className="mt-4">
              {!file ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 transition-colors hover:border-blue-400 hover:bg-blue-50">
                  <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    {t("writing_click_upload")}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {t("writing_file_types")}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  {filePreview && (
                    <img
                      src={filePreview}
                      alt="Upload preview"
                      className="mb-4 max-h-64 rounded-lg object-contain"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={clearFile}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        {t("writing_remove")}
                      </button>
                      <button
                        onClick={handleUploadAndExtract}
                        disabled={isExtracting}
                        className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isExtracting ? t("writing_extracting") : t("writing_extract")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extracted text editor */}
          {extractedText !== null && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">
                {t("writing_extracted_review")}
              </p>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-4 text-sm leading-relaxed text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={12}
              />
            </div>
          )}

          {/* Word count + submit */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  isBelowMin ? "text-amber-600" : "text-gray-500"
                }`}
              >
                {wordCount} {t("writing_words")}
              </span>
              {isBelowMin && (
                <span className="text-xs text-amber-600">
                  ({t("writing_min_words")} {selectedTask.minWords} — {selectedTask.label})
                </span>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!activeText.trim() || isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("writing_submitting") : t("writing_submit")}
            </button>
          </div>

          {/* Time's up notice */}
          {timeLeft === 0 && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {t("writing_times_up_note")}
            </div>
          )}

          {/* Usage limit error */}
          {error && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-amber-800">{t("writing_daily_limit")}</h3>
              <p className="mt-1 text-sm text-amber-700">{error}</p>
            </div>
          )}

          {/* Inline results (fallback for unauthenticated users) */}
          {result && (
            <div ref={resultRef} className="mt-8 space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold">{t("feedback_band_score")}</h2>
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                    {result.overall_band}
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">{t("feedback_task_achievement")}:</span>{" "}
                      <span className="font-semibold">{result.task_score}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{t("feedback_coherence")}:</span>{" "}
                      <span className="font-semibold">{result.coherence_score}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{t("feedback_lexical")}:</span>{" "}
                      <span className="font-semibold">{result.lexical_score}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{t("feedback_grammar")}:</span>{" "}
                      <span className="font-semibold">{result.grammar_score}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-semibold text-green-700">{t("feedback_strengths")}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    {result.feedback.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="font-semibold text-red-700">{t("feedback_weaknesses")}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    {result.feedback.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-500">-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold">{t("feedback_corrections")}</h3>
                <div className="mt-3 space-y-4">
                  {result.feedback.sentence_corrections.map((c, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-red-600 line-through">{c.original}</p>
                      <p className="text-green-700">{c.corrected}</p>
                      <p className="mt-1 text-xs text-gray-500">{c.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold">{t("feedback_rewrite")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700 italic">
                  {result.feedback.rewrite_example}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="font-semibold text-blue-800">{t("feedback_top3")}</h3>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-blue-900">
                  {result.feedback.top_3_improvements.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
