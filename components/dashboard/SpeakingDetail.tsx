"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import ScoreTrendChart from "./ScoreTrendChart";
import SubScoreBarChart from "./SubScoreBarChart";
import type { SectionDashboardData } from "@/lib/dashboard-data";

interface SpeakingDetailProps {
  data: SectionDashboardData;
}

export default function SpeakingDetail({ data }: SpeakingDetailProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreTrendChart data={data.trendData} title={t("dashboard_estimated_band_over_time")} color="#7c3aed" />
        <SubScoreBarChart scores={data.latestSubScores} title={t("dashboard_latest_sub_scores")} />
      </div>

      {/* Recurring Weaknesses */}
      {data.weaknesses.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">{t("dashboard_common_feedback")}</h3>
          <ul className="space-y-1.5">
            {data.weaknesses.map((w, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-700">{w.text}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {w.count}x
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Submissions */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">{t("dashboard_recent_sessions")}</h3>
        {data.submissions.length === 0 ? (
          <p className="text-sm text-gray-400">
            {t("dashboard_no_speaking")}{" "}
            <Link href="/speaking" className="text-blue-600 hover:underline">{t("dashboard_start_speaking")}</Link>
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {data.submissions.slice(0, 10).map((s) => (
              <li key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{s.label}</span>
                  <span className="ml-3 text-xs text-gray-400">{s.date}</span>
                </div>
                {s.score !== null && (
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                    {s.score}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
