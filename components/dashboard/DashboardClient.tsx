"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import ScoreCard from "./ScoreCard";
import ExpandableSection from "./ExpandableSection";
import WritingDetail from "./WritingDetail";
import SpeakingDetail from "./SpeakingDetail";
import Encouragement from "./Encouragement";
import type { SectionDashboardData } from "@/lib/dashboard-data";

type Section = "writing" | "speaking" | "reading" | "listening" | null;

interface DashboardClientProps {
  writing: SectionDashboardData;
  speaking: SectionDashboardData;
}

export default function DashboardClient({ writing, speaking }: DashboardClientProps) {
  const [expanded, setExpanded] = useState<Section>(null);
  const { t } = useLanguage();

  const toggle = (section: Section) => {
    setExpanded((prev) => (prev === section ? null : section));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">{t("dashboard_title")}</h1>
        <div className="flex gap-2">
          <Link
            href="/writing"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700 sm:flex-none sm:px-4 sm:text-sm"
          >
            {t("dashboard_new_essay")}
          </Link>
          <Link
            href="/speaking"
            className="flex-1 rounded-lg bg-purple-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-purple-700 sm:flex-none sm:px-4 sm:text-sm"
          >
            {t("dashboard_practice_speaking")}
          </Link>
        </div>
      </div>

      <Encouragement writing={writing} speaking={speaking} />

      {/* Section Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <ScoreCard
            sectionName="Writing"
            latestScore={writing.latestScore}
            avgScore={writing.avgScore}
            submissionCount={writing.submissions.length}
            trend={writing.trend}
            isExpanded={expanded === "writing"}
            onToggle={() => toggle("writing")}
          />
          <ExpandableSection isExpanded={expanded === "writing"}>
            <WritingDetail data={writing} />
          </ExpandableSection>
        </div>

        <div>
          <ScoreCard
            sectionName="Speaking"
            latestScore={speaking.latestScore}
            avgScore={speaking.avgScore}
            submissionCount={speaking.submissions.length}
            trend={speaking.trend}
            isExpanded={expanded === "speaking"}
            onToggle={() => toggle("speaking")}
          />
          <ExpandableSection isExpanded={expanded === "speaking"}>
            <SpeakingDetail data={speaking} />
          </ExpandableSection>
        </div>

        <div>
          <ScoreCard
            sectionName="Reading"
            latestScore={null}
            avgScore={null}
            submissionCount={0}
            trend={null}
            isExpanded={false}
            onToggle={() => {}}
            comingSoon
          />
        </div>

        <div>
          <ScoreCard
            sectionName="Listening"
            latestScore={null}
            avgScore={null}
            submissionCount={0}
            trend={null}
            isExpanded={false}
            onToggle={() => {}}
            comingSoon
          />
        </div>
      </div>
    </div>
  );
}
