"use client";

import { useLanguage } from "@/lib/language-context";

export default function MissionStrip() {
  const { t } = useLanguage();
  return (
    <section id="mission" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
          {t("landing_mission_body")}
        </p>
      </div>
    </section>
  );
}
