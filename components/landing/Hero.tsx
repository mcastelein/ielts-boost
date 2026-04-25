"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { PrimaryCtaButton, SecondaryCtaButton } from "@/components/landing/cta-buttons";

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
            <PrimaryCtaButton href="/signup" ctaId="hero-primary" width="responsive">
              {t("landing_hero_cta_primary")}
            </PrimaryCtaButton>
            <SecondaryCtaButton href="#bilingual" ctaId="hero-secondary" width="responsive">
              {t("landing_hero_cta_secondary")}
            </SecondaryCtaButton>
          </div>
        </div>
        <Image
          src="/images/landing/hero-feedback.png"
          alt={t("landing_hero_image_alt")}
          width={1506}
          height={832}
          priority
          className="rounded-xl border border-gray-200 shadow-sm"
        />
      </div>
    </section>
  );
}
