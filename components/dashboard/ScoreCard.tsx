"use client";

import { useLanguage } from "@/lib/language-context";

interface ScoreCardProps {
  sectionName: string;
  latestScore: number | null;
  avgScore: number | null;
  submissionCount: number;
  trend: "up" | "down" | "flat" | null;
  isExpanded: boolean;
  onToggle: () => void;
  comingSoon?: boolean;
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "flat" | null }) {
  const { t } = useLanguage();
  if (!trend) return null;
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
        {t("dashboard_improving")}
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-500">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
        </svg>
        {t("dashboard_declining")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-400">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
      </svg>
      {t("dashboard_steady")}
    </span>
  );
}

export default function ScoreCard({
  sectionName,
  latestScore,
  avgScore,
  submissionCount,
  trend,
  isExpanded,
  onToggle,
  comingSoon = false,
}: ScoreCardProps) {
  const { t } = useLanguage();

  const sectionNameMap: Record<string, string> = {
    Writing: t("nav_writing"),
    Speaking: t("nav_speaking"),
    Reading: t("dashboard_reading"),
    Listening: t("dashboard_listening"),
  };
  const translatedName = sectionNameMap[sectionName] ?? sectionName;

  return (
    <button
      onClick={comingSoon ? undefined : onToggle}
      disabled={comingSoon}
      className={`w-full rounded-xl border p-5 text-left transition-all ${
        comingSoon
          ? "cursor-default border-gray-100 bg-gray-50 opacity-60"
          : isExpanded
            ? "border-blue-200 bg-blue-50/50 shadow-sm"
            : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{translatedName}</h3>
        {comingSoon ? (
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
            {t("dashboard_coming_soon")}
          </span>
        ) : (
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        )}
      </div>

      {comingSoon ? (
        <p className="mt-2 text-xs text-gray-400">{t("dashboard_coming_soon_desc")}</p>
      ) : (
        <div className="mt-3 flex items-end gap-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {latestScore !== null ? latestScore.toFixed(1) : "—"}
            </p>
            <p className="text-[10px] text-gray-400">{t("dashboard_latest")}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-600">
              {avgScore !== null ? avgScore.toFixed(1) : "—"}
            </p>
            <p className="text-[10px] text-gray-400">{t("dashboard_average")}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium text-gray-500">{submissionCount}</p>
            <p className="text-[10px] text-gray-400">{t("dashboard_sessions")}</p>
          </div>
        </div>
      )}

      {!comingSoon && <div className="mt-2"><TrendIndicator trend={trend} /></div>}
    </button>
  );
}
