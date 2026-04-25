"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="hero"
      className="px-4 pt-16 pb-12 sm:pt-24 sm:pb-20"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t("landing_hero_headline")}
          </h1>
          <p className="mt-5 text-base text-gray-600 sm:text-lg">
            {t("landing_hero_subhead")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start lg:justify-start">
            <Link
              href="/signup"
              data-cta="hero-primary"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              {t("landing_hero_cta_primary")}
            </Link>
            <a
              href="#bilingual"
              data-cta="hero-secondary"
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
            >
              {t("landing_hero_cta_secondary")}
            </a>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="flex aspect-[4/3] items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400 shadow-sm"
        >
          [Hero feedback screenshot — drop in public/images/landing/hero-feedback-zh.png]
        </div>
      </div>
    </section>
  );
}
