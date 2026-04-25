"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function FinalCta() {
  const { t } = useLanguage();
  return (
    <section id="final-cta" className="bg-blue-600 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          {t("landing_final_cta_headline")}
        </h2>
        <Link
          href="/signup"
          data-cta="final"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
        >
          {t("landing_final_cta_button")}
        </Link>
      </div>
    </section>
  );
}
