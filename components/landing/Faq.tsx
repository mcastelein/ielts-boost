"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";

const items: { qKey: TranslationKey; aKey: TranslationKey }[] = [
  { qKey: "landing_faq_q1", aKey: "landing_faq_a1" },
  { qKey: "landing_faq_q2", aKey: "landing_faq_a2" },
  { qKey: "landing_faq_q3", aKey: "landing_faq_a3" },
  { qKey: "landing_faq_q4", aKey: "landing_faq_a4" },
  { qKey: "landing_faq_q5", aKey: "landing_faq_a5" },
  { qKey: "landing_faq_q6", aKey: "landing_faq_a6" },
];

export default function Faq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_faq_title")}
        </h2>
        <div className="mt-10 space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={item.qKey} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                >
                  <span className="text-base font-medium text-gray-900">{t(item.qKey)}</span>
                  <span className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600"
                  >
                    {t(item.aKey)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
