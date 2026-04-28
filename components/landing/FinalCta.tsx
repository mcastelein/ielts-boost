"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { trackLandingCta } from "@/lib/landing-analytics";
import { btnInverse } from "@/lib/button-styles";

export default function FinalCta() {
  const { t } = useLanguage();
  return (
    <section id="final-cta" className="bg-blue-600 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          {t("landing_final_cta_headline")}
        </h2>
        <div className="mt-8">
          <Link
            href="/signup"
            data-cta="final"
            onClick={() => trackLandingCta("final")}
            className={`inline-block ${btnInverse}`}
          >
            {t("landing_final_cta_button")}
          </Link>
          <p className="mt-2 text-xs text-blue-200">{t("landing_final_cta_no_cc")}</p>
        </div>
      </div>
    </section>
  );
}
