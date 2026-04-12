"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

type Section = "overview" | "listening" | "reading" | "writing" | "speaking";

export default function GuidePage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: "overview", label: t("guide_overview_title"), icon: "📋" },
    { id: "listening", label: t("guide_listening_title"), icon: "🎧" },
    { id: "reading", label: t("guide_reading_title"), icon: "📖" },
    { id: "writing", label: t("guide_writing_title"), icon: "✍️" },
    { id: "speaking", label: t("guide_speaking_title"), icon: "🎤" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("guide_title")}</h1>
        <p className="mt-2 text-gray-600">{t("guide_subtitle")}</p>
      </div>

      {/* Section tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "listening" && <ListeningSection />}
        {activeSection === "reading" && <ReadingSection />}
        {activeSection === "writing" && <WritingSection />}
        {activeSection === "speaking" && <SpeakingSection />}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl bg-blue-50 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">{t("guide_practice_cta")}</h2>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link
            href="/writing"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {t("guide_start_writing")}
          </Link>
          <Link
            href="/speaking"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            {t("guide_start_speaking")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {children}
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
      <span>{icon}</span>
      {title}
    </h2>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2 text-gray-700">
      <span className="mt-0.5 shrink-0 text-blue-500">&#10003;</span>
      <span>{text}</span>
    </li>
  );
}

function OverviewSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionCard>
        <SectionHeading icon="📋" title={t("guide_overview_title")} />
        <p className="mt-4 leading-relaxed text-gray-700">{t("guide_overview_desc")}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-gray-700">
            <span className="mt-0.5 shrink-0 font-bold text-blue-600">A</span>
            <span>{t("guide_overview_academic")}</span>
          </div>
          <div className="flex items-start gap-2 text-gray-700">
            <span className="mt-0.5 shrink-0 font-bold text-blue-600">G</span>
            <span>{t("guide_overview_general")}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">{t("guide_overview_duration")}</p>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_band_scale")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{t("guide_overview_scoring")}</p>
        <div className="mt-4 space-y-2">
          {(["guide_band_9", "guide_band_8", "guide_band_7", "guide_band_6", "guide_band_5", "guide_band_4"] as const).map(
            (key) => {
              const score = t(key).charAt(0);
              return (
                <div key={key} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2">
                  <span className="w-8 text-center text-lg font-bold text-blue-600">{score}</span>
                  <span className="text-sm text-gray-700">{t(key).substring(4)}</span>
                </div>
              );
            }
          )}
        </div>
      </SectionCard>

      {/* Quick overview of all 4 sections */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: "🎧", title: t("guide_listening_title"), desc: "30 min — 4 sections, 40 questions" },
          { icon: "📖", title: t("guide_reading_title"), desc: "60 min — 3 passages, 40 questions" },
          { icon: "✍️", title: t("guide_writing_title"), desc: "60 min — 2 tasks" },
          { icon: "🎤", title: t("guide_speaking_title"), desc: "11-14 min — 3 parts" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="text-2xl">{item.icon}</div>
            <h3 className="mt-2 font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ListeningSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionCard>
        <SectionHeading icon="🎧" title={t("guide_listening_title")} />
        <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-sm font-medium text-blue-800">{t("guide_section_format")}</p>
          <p className="mt-1 text-sm text-blue-700">{t("guide_listening_format")}</p>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_format")}</h3>
        <div className="mt-4 space-y-3">
          {(["guide_listening_s1", "guide_listening_s2", "guide_listening_s3", "guide_listening_s4"] as const).map(
            (key, i) => (
              <div key={key} className="flex gap-3 rounded-lg bg-gray-50 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{t(key)}</p>
              </div>
            )
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_tips")}</h3>
        <ul className="mt-4 space-y-3">
          {(["guide_listening_tip1", "guide_listening_tip2", "guide_listening_tip3", "guide_listening_tip4", "guide_listening_tip5"] as const).map(
            (key) => <TipItem key={key} text={t(key)} />
          )}
        </ul>
      </SectionCard>
    </>
  );
}

function ReadingSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionCard>
        <SectionHeading icon="📖" title={t("guide_reading_title")} />
        <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-sm font-medium text-blue-800">{t("guide_section_format")}</p>
          <p className="mt-1 text-sm text-blue-700">{t("guide_reading_format")}</p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm leading-relaxed text-gray-700">{t("guide_reading_academic")}</p>
          <p className="text-sm leading-relaxed text-gray-700">{t("guide_reading_general")}</p>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_tips")}</h3>
        <ul className="mt-4 space-y-3">
          {(["guide_reading_tip1", "guide_reading_tip2", "guide_reading_tip3", "guide_reading_tip4", "guide_reading_tip5"] as const).map(
            (key) => <TipItem key={key} text={t(key)} />
          )}
        </ul>
      </SectionCard>
    </>
  );
}

function WritingSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionCard>
        <SectionHeading icon="✍️" title={t("guide_writing_title")} />
        <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-sm font-medium text-blue-800">{t("guide_section_format")}</p>
          <p className="mt-1 text-sm text-blue-700">{t("guide_writing_format")}</p>
        </div>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">{t("guide_writing_task1_academic")}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">{t("guide_writing_task1_general")}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">{t("guide_writing_task2_both")}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_scoring")}</h3>
        <p className="mt-2 text-sm text-gray-600">{t("guide_writing_criteria")}</p>
        <div className="mt-4 space-y-2">
          {(["guide_writing_c1", "guide_writing_c2", "guide_writing_c3", "guide_writing_c4"] as const).map(
            (key, i) => (
              <div key={key} className="flex gap-3 rounded-lg bg-gray-50 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{t(key)}</p>
              </div>
            )
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_tips")}</h3>
        <ul className="mt-4 space-y-3">
          {(["guide_writing_tip1", "guide_writing_tip2", "guide_writing_tip3", "guide_writing_tip4", "guide_writing_tip5", "guide_writing_tip6"] as const).map(
            (key) => <TipItem key={key} text={t(key)} />
          )}
        </ul>
      </SectionCard>
    </>
  );
}

function SpeakingSection() {
  const { t } = useLanguage();
  return (
    <>
      <SectionCard>
        <SectionHeading icon="🎤" title={t("guide_speaking_title")} />
        <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-sm font-medium text-blue-800">{t("guide_section_format")}</p>
          <p className="mt-1 text-sm text-blue-700">{t("guide_speaking_format")}</p>
        </div>
      </SectionCard>

      {/* Part 1 */}
      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_speaking_p1_title")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{t("guide_speaking_p1_desc")}</p>
        <div className="mt-3 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">{t("guide_speaking_p1_tip")}</p>
        </div>
      </SectionCard>

      {/* Part 2 */}
      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_speaking_p2_title")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{t("guide_speaking_p2_desc")}</p>
        <div className="mt-3 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">{t("guide_speaking_p2_tip")}</p>
        </div>
      </SectionCard>

      {/* Part 3 */}
      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_speaking_p3_title")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{t("guide_speaking_p3_desc")}</p>
        <div className="mt-3 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">{t("guide_speaking_p3_tip")}</p>
        </div>
      </SectionCard>

      {/* Scoring criteria */}
      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_scoring")}</h3>
        <p className="mt-2 text-sm text-gray-600">{t("guide_speaking_criteria")}</p>
        <div className="mt-4 space-y-2">
          {(["guide_speaking_c1", "guide_speaking_c2", "guide_speaking_c3", "guide_speaking_c4"] as const).map(
            (key, i) => (
              <div key={key} className="flex gap-3 rounded-lg bg-gray-50 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{t(key)}</p>
              </div>
            )
          )}
        </div>
      </SectionCard>

      {/* General speaking tips */}
      <SectionCard>
        <h3 className="text-lg font-semibold text-gray-900">{t("guide_section_tips")}</h3>
        <ul className="mt-4 space-y-3">
          {(["guide_speaking_general_tip1", "guide_speaking_general_tip2", "guide_speaking_general_tip3", "guide_speaking_general_tip4"] as const).map(
            (key) => <TipItem key={key} text={t(key)} />
          )}
        </ul>
      </SectionCard>
    </>
  );
}
