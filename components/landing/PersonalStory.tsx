"use client";

import { useLanguage } from "@/lib/language-context";

export default function PersonalStory() {
  const { t } = useLanguage();
  return (
    <section id="personal-story" className="bg-gray-50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {t("landing_story_eyebrow")}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-800 sm:text-xl">
          {t("landing_story_body")}
        </p>
        <p className="mt-6 text-sm font-medium text-gray-500">
          {t("landing_story_signature")}
        </p>
      </div>
    </section>
  );
}
