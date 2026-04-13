"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

interface WritingItem {
  id: string;
  type: "writing";
  task_type: string;
  input_type: string;
  prompt_topic: string | null;
  prompt_text: string | null;
  time_used_seconds: number | null;
  created_at: string;
  band: number | null;
}

interface SpeakingItem {
  id: string;
  type: "speaking";
  prompt: string;
  part: number | null;
  created_at: string;
  band: number | null;
}

interface ReadingItem {
  id: string;
  type: "reading";
  passage_title: string;
  passage_slug: string;
  time_used_seconds: number | null;
  created_at: string;
  band: number | null;
  raw_score: number | null;
  total_questions: number | null;
}

type HistoryItem = WritingItem | SpeakingItem | ReadingItem;
type FilterType = "all" | "writing" | "speaking" | "reading";

export default function HistoryClient({
  writingItems,
  speakingItems,
  readingItems,
  authenticated,
}: {
  writingItems: WritingItem[];
  speakingItems: SpeakingItem[];
  readingItems: ReadingItem[];
  authenticated: boolean;
}) {
  const [filter, setFilter] = useState<FilterType>("all");
  const { t } = useLanguage();

  if (!authenticated) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-gray-500">{t("history_signin")}</p>
      </div>
    );
  }

  // Merge and sort by date
  const allItems: HistoryItem[] = [
    ...writingItems,
    ...speakingItems,
    ...readingItems,
  ].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredItems =
    filter === "all"
      ? allItems
      : allItems.filter((item) => item.type === filter);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: t("history_all") },
    { key: "writing", label: t("history_writing") },
    { key: "speaking", label: t("history_speaking") },
    { key: "reading", label: t("history_reading") },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="text-xl font-bold sm:text-2xl">{t("history_title")}</h1>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-6 text-sm text-gray-500">
          {t("history_no_submissions")}{" "}
          {filter !== "speaking" && (
            <Link href="/writing" className="text-blue-600 hover:underline">
              {t("history_start_writing")}
            </Link>
          )}
          {filter === "all" && " · "}
          {filter !== "writing" && (
            <Link href="/speaking" className="text-blue-600 hover:underline">
              {t("history_start_speaking")}
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredItems.map((item) => {
            if (item.type === "writing") {
              return (
                <Link
                  key={`w-${item.id}`}
                  href={`/writing/${item.id}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {t("history_writing")}
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                        {item.task_type === "task1" ? "Task 1" : "Task 2"}
                      </span>
                      {item.prompt_topic && (
                        <span className="text-sm font-medium text-gray-900">
                          {item.prompt_topic}
                        </span>
                      )}
                    </div>
                    {item.band !== null && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {item.band}
                      </span>
                    )}
                  </div>
                  {item.prompt_text && (
                    <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
                      {item.prompt_text}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {new Date(item.created_at).toLocaleDateString()} at{" "}
                      {new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {item.time_used_seconds !== null && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                        {formatTime(item.time_used_seconds)}
                      </span>
                    )}
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                      {item.input_type}
                    </span>
                  </div>
                </Link>
              );
            }

            if (item.type === "speaking") {
              return (
                <Link
                  key={`s-${item.id}`}
                  href={`/speaking/${item.id}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-purple-200 hover:bg-purple-50/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                        {t("history_speaking")}
                      </span>
                      {item.part && (
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                          {t("speaking_part")} {item.part}{t("speaking_part_suffix")}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.prompt}
                      </span>
                    </div>
                    {item.band !== null && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                        {item.band}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()} at{" "}
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </Link>
              );
            }

            // Reading item
            return (
              <Link
                key={`r-${item.id}`}
                href={`/reading/${item.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-700">
                      {t("history_reading")}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.passage_title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.raw_score !== null && item.total_questions !== null && (
                      <span className="text-xs text-gray-400">
                        {item.raw_score}/{item.total_questions}
                      </span>
                    )}
                    {item.band !== null && (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
                        {item.band}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {new Date(item.created_at).toLocaleDateString()} at{" "}
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {item.time_used_seconds !== null && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                      </svg>
                      {formatTime(item.time_used_seconds)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
