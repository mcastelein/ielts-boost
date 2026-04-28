"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import ScoreCard from "./ScoreCard";
import ExpandableSection from "./ExpandableSection";
import WritingDetail from "./WritingDetail";
import SpeakingDetail from "./SpeakingDetail";
import ReadingDetail from "./ReadingDetail";
import ListeningDetail from "./ListeningDetail";
import Encouragement from "./Encouragement";
import type { SectionDashboardData } from "@/lib/dashboard-data";

type Section = "writing" | "speaking" | "reading" | "listening";

interface DashboardClientProps {
  writing: SectionDashboardData;
  speaking: SectionDashboardData;
  reading: SectionDashboardData;
  listening: SectionDashboardData;
}

export default function DashboardClient({ writing, speaking, reading, listening }: DashboardClientProps) {
  const [expanded, setExpanded] = useState<Set<Section>>(new Set());
  const { t } = useLanguage();

  const toggle = (section: Section) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(section) ? next.delete(section) : next.add(section);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold sm:text-2xl">{t("dashboard_title")}</h1>

      <Encouragement writing={writing} speaking={speaking} />

      {/* Section Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <ScoreCard
            sectionName="Listening"
            latestScore={listening.latestScore}
            avgScore={listening.avgScore}
            submissionCount={listening.submissions.length}
            trend={listening.trend}
            isExpanded={expanded.has("listening")}
            onToggle={() => toggle("listening")}
          />
          <ExpandableSection isExpanded={expanded.has("listening")}>
            <ListeningDetail data={listening} />
          </ExpandableSection>
        </div>

        <div>
          <ScoreCard
            sectionName="Reading"
            latestScore={reading.latestScore}
            avgScore={reading.avgScore}
            submissionCount={reading.submissions.length}
            trend={reading.trend}
            isExpanded={expanded.has("reading")}
            onToggle={() => toggle("reading")}
          />
          <ExpandableSection isExpanded={expanded.has("reading")}>
            <ReadingDetail data={reading} />
          </ExpandableSection>
        </div>

        <div>
          <ScoreCard
            sectionName="Writing"
            latestScore={writing.latestScore}
            avgScore={writing.avgScore}
            submissionCount={writing.submissions.length}
            trend={writing.trend}
            isExpanded={expanded.has("writing")}
            onToggle={() => toggle("writing")}
          />
          <ExpandableSection isExpanded={expanded.has("writing")}>
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
            isExpanded={expanded.has("speaking")}
            onToggle={() => toggle("speaking")}
          />
          <ExpandableSection isExpanded={expanded.has("speaking")}>
            <SpeakingDetail data={speaking} />
          </ExpandableSection>
        </div>
      </div>
    </div>
  );
}
