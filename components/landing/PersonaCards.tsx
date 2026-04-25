"use client";

import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";

const personas: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "landing_personas_first_time_title", bodyKey: "landing_personas_first_time_body" },
  { titleKey: "landing_personas_push_score_title", bodyKey: "landing_personas_push_score_body" },
  { titleKey: "landing_personas_daily_title", bodyKey: "landing_personas_daily_body" },
];

export default function PersonaCards() {
  const { t } = useLanguage();
  return (
    <section id="personas" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_personas_title")}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {personas.map((p) => (
            <div
              key={p.titleKey}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-900">{t(p.titleKey)}</h3>
              <p className="mt-2 text-sm text-gray-600">{t(p.bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
