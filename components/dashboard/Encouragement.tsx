"use client";

import { useLanguage } from "@/lib/language-context";
import type { SectionDashboardData } from "@/lib/dashboard-data";

interface EncouragementProps {
  writing: SectionDashboardData;
  speaking: SectionDashboardData;
}

export default function Encouragement({ writing, speaking }: EncouragementProps) {
  const { t } = useLanguage();

  const messages: string[] = [];

  if (writing.trend === "up") {
    messages.push(t("dashboard_writing_trending_up"));
  }
  if (speaking.trend === "up") {
    messages.push(t("dashboard_speaking_improving"));
  }

  const checkMilestone = (score: number | null, section: string) => {
    if (score === null) return;
    const nextBand = Math.ceil(score);
    const gap = nextBand - score;
    if (gap > 0 && gap <= 0.5) {
      messages.push(`Just ${gap.toFixed(1)} away from Band ${nextBand} in ${section}!`);
    }
  };
  checkMilestone(writing.latestScore, t("nav_writing").toLowerCase());
  checkMilestone(speaking.latestScore, t("nav_speaking").toLowerCase());

  if (writing.submissions.length === 0 && speaking.submissions.length === 0) {
    messages.push(t("dashboard_start_practicing"));
  } else if (writing.submissions.length === 0) {
    messages.push(t("dashboard_try_writing"));
  } else if (speaking.submissions.length === 0) {
    messages.push(t("dashboard_add_speaking"));
  }
  if (messages.length === 0) return null;

  return (
    <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-3">
      <p className="text-sm font-medium text-green-800">{messages[0]}</p>
    </div>
  );
}
