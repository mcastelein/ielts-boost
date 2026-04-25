"use client";

import { useLanguage } from "@/lib/language-context";
import { PrimaryCtaButton, SecondaryCtaButton } from "@/components/landing/cta-buttons";
import type { TranslationKey } from "@/lib/translations";

const freeFeatures: TranslationKey[] = [
  "landing_pricing_free_feature_1",
  "landing_pricing_free_feature_2",
  "landing_pricing_free_feature_3",
  "landing_pricing_free_feature_4",
];

const proFeatures: TranslationKey[] = [
  "landing_pricing_pro_feature_1",
  "landing_pricing_pro_feature_2",
  "landing_pricing_pro_feature_3",
];

export default function Pricing() {
  const { t } = useLanguage();
  return (
    <section id="pricing" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("landing_pricing_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-600">
          {t("landing_pricing_subtitle")}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Free card — visually prominent */}
          <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">{t("landing_pricing_free_title")}</h3>
            <p className="mt-1 text-sm text-gray-500">{t("landing_pricing_free_tagline")}</p>
            <p className="mt-4 text-4xl font-bold text-gray-900">{t("landing_pricing_free_price")}</p>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              {freeFeatures.map((k) => (
                <li key={k} className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PrimaryCtaButton href="/signup" ctaId="pricing-free" width="block">
                {t("landing_pricing_free_cta")}
              </PrimaryCtaButton>
            </div>
          </div>

          {/* Pro card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">{t("landing_pricing_pro_title")}</h3>
            <p className="mt-1 text-sm text-gray-500">{t("landing_pricing_pro_tagline")}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-base font-medium text-gray-900">{t("landing_pricing_bundle_1mo")}</span>
              </div>
              <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-base font-medium text-gray-900">{t("landing_pricing_bundle_3mo")}</span>
                <span className="text-xs font-semibold text-green-700">{t("landing_pricing_bundle_3mo_save")}</span>
              </div>
              <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-base font-medium text-gray-900">{t("landing_pricing_bundle_6mo")}</span>
                <span className="text-xs font-semibold text-green-700">{t("landing_pricing_bundle_6mo_save")}</span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              {proFeatures.map((k) => (
                <li key={k} className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>{t(k)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <SecondaryCtaButton href="/upgrade" ctaId="pricing-pro" width="block">
                {t("landing_pricing_pro_cta")}
              </SecondaryCtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
