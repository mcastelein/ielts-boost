"use client";

import { useLanguage } from "@/lib/language-context";

export default function BilingualShowcase() {
  const { t } = useLanguage();
  return (
    <section id="bilingual" className="bg-gray-50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_bilingual_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-600">
          {t("landing_bilingual_subtitle")}
        </p>
        <div className="mt-10 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <div className="flex aspect-[4/5] flex-col rounded-lg border border-gray-200 bg-gray-50">
            <div className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("landing_bilingual_label_en")}
            </div>
            <div aria-hidden="true" className="flex flex-1 items-center justify-center text-sm text-gray-400">
              [English feedback screenshot]
            </div>
          </div>
          <div className="flex aspect-[4/5] flex-col rounded-lg border border-gray-200 bg-gray-50">
            <div className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("landing_bilingual_label_zh")}
            </div>
            <div aria-hidden="true" className="flex flex-1 items-center justify-center text-sm text-gray-400">
              [中文 feedback screenshot]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
