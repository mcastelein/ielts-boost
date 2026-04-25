"use client";

import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";

const sections: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "landing_guide_section_writing", bodyKey: "landing_guide_section_writing_body" },
  { titleKey: "landing_guide_section_speaking", bodyKey: "landing_guide_section_speaking_body" },
  { titleKey: "landing_guide_section_reading", bodyKey: "landing_guide_section_reading_body" },
  { titleKey: "landing_guide_section_listening", bodyKey: "landing_guide_section_listening_body" },
];

const criteria: TranslationKey[] = [
  "landing_guide_criteria_ta",
  "landing_guide_criteria_cc",
  "landing_guide_criteria_lr",
  "landing_guide_criteria_gra",
];

export default function IeltsGuide() {
  const { t } = useLanguage();
  return (
    <section id="guide" className="bg-gray-50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_guide_title")}
        </h2>

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">{t("landing_guide_what_title")}</h3>
          <p className="mt-2 text-sm text-gray-600">{t("landing_guide_what_body")}</p>
        </div>

        <h3 className="mt-12 text-lg font-semibold text-gray-900">
          {t("landing_guide_sections_title")}
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <div key={s.titleKey} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-semibold text-gray-900">{t(s.titleKey)}</h4>
              <p className="mt-2 text-sm text-gray-600">{t(s.bodyKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">{t("landing_guide_scoring_title")}</h3>
          <p className="mt-2 text-sm text-gray-600">{t("landing_guide_scoring_body")}</p>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("landing_guide_criteria_title")}
            </p>
            <ul className="mt-2 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
              {criteria.map((k) => (
                <li key={k} className="rounded-lg bg-gray-50 px-3 py-2">{t(k)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
