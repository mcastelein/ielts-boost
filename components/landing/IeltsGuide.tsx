"use client";

import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";
import { PrimaryCtaButton } from "@/components/landing/cta-buttons";

const sections: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { titleKey: "landing_guide_section_listening", bodyKey: "landing_guide_section_listening_body" },
  { titleKey: "landing_guide_section_reading", bodyKey: "landing_guide_section_reading_body" },
  { titleKey: "landing_guide_section_writing", bodyKey: "landing_guide_section_writing_body" },
  { titleKey: "landing_guide_section_speaking", bodyKey: "landing_guide_section_speaking_body" },
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
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_guide_title")}
        </h2>
        <p className="mt-4 text-base text-gray-600">
          {t("landing_guide_blurb")}
        </p>
        <div className="mt-8">
          <PrimaryCtaButton href="/guide" ctaId="guide">
            {t("landing_guide_cta")}
          </PrimaryCtaButton>
        </div>
      </div>
    </section>
  );
}
