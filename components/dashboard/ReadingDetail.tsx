"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { btnPrimaryBlock } from "@/lib/button-styles";
import ScoreTrendChart from "./ScoreTrendChart";
import SubScoreBarChart from "./SubScoreBarChart";
import type { SectionDashboardData } from "@/lib/dashboard-data";

interface ReadingDetailProps {
  data: SectionDashboardData;
}

export default function ReadingDetail({ data }: ReadingDetailProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid gap-6 lg:grid-cols-2">
        <ScoreTrendChart
          data={data.trendData}
          title={t("dashboard_band_over_time")}
          color="#0891b2"
        />
        <SubScoreBarChart
          scores={data.latestSubScores}
          title={t("dashboard_latest_sub_scores")}
        />
      </div>

      {/* Recent Submissions */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          {t("dashboard_recent")}
        </h3>
        {data.submissions.length === 0 ? (
          <p className="text-sm text-gray-400">{t("dashboard_reading_no_data")}</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {data.submissions.slice(0, 10).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/reading/${s.id}`}
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-900">{s.label}</span>
                    <span className="ml-3 text-xs text-gray-400">{s.date}</span>
                  </div>
                  {s.score !== null && (
                    <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-700">
                      {s.score}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/reading"
        className={btnPrimaryBlock}
      >
        {t("dashboard_practice_reading")}
      </Link>
    </div>
  );
}
