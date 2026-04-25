"use client";

import { useLanguage } from "@/lib/language-context";
import { PrimaryCtaButton } from "@/components/landing/cta-buttons";
import type { TranslationKey } from "@/lib/translations";

const steps: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "landing_how_step1_title", bodyKey: "landing_how_step1_body" },
  { titleKey: "landing_how_step2_title", bodyKey: "landing_how_step2_body" },
  { titleKey: "landing_how_step3_title", bodyKey: "landing_how_step3_body" },
];

export default function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_how_title")}
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.titleKey} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{t(s.titleKey)}</h3>
              <p className="mt-2 text-sm text-gray-600">{t(s.bodyKey)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <PrimaryCtaButton href="/signup" ctaId="how-it-works">
            {t("landing_how_cta")}
          </PrimaryCtaButton>
        </div>
      </div>
    </section>
  );
}
