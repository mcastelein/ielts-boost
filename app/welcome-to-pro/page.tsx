"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { createClient } from "@/lib/supabase/client";

const benefits = [
  {
    titleKey: "pro_unlimited_writing_title",
    descKey: "pro_unlimited_writing_desc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
    color: "bg-blue-100 text-blue-600",
  },
  {
    titleKey: "pro_unlimited_speaking_title",
    descKey: "pro_unlimited_speaking_desc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    color: "bg-purple-100 text-purple-600",
  },
  {
    titleKey: "pro_deep_analysis_title",
    descKey: "pro_deep_analysis_desc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    color: "bg-green-100 text-green-600",
  },
  {
    titleKey: "pro_model_essays_title",
    descKey: "pro_model_essays_desc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    titleKey: "pro_pdf_title",
    descKey: "pro_pdf_desc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    color: "bg-red-100 text-red-600",
  },
  {
    titleKey: "pro_priority_title",
    descKey: "pro_priority_desc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: "bg-orange-100 text-orange-600",
  },
] as const;

export default function ProBenefitsPage() {
  const { t } = useLanguage();
  const [planType, setPlanType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("plan_type")
          .eq("user_id", data.user.id)
          .single();
        setPlanType(settings?.plan_type ?? "free");
      } else {
        setPlanType("free");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">{t("common_loading")}</p>
      </div>
    );
  }

  // Non-pro users get blocked
  if (planType !== "pro") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {t("pro_not_member")}
          </h1>
          <div className="mt-6">
            <Link
              href="/upgrade"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              {t("pro_not_member_cta")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-10 text-center sm:mb-14">
        <div className="mx-auto mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
          Pro
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
          {t("pro_welcome")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
          {t("pro_welcome_subtitle")}
        </p>
      </div>

      {/* Benefits grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <div
            key={benefit.titleKey}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${benefit.color}`}>
              {benefit.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900 sm:text-lg">
              {t(benefit.titleKey as any)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {t(benefit.descKey as any)}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center sm:mt-14 sm:p-10">
        <h2 className="text-lg font-bold text-white sm:text-xl">
          {t("pro_ready")}
        </h2>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/writing"
            className="w-full rounded-lg bg-white px-6 py-3 text-center text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto"
          >
            {t("guide_start_writing")}
          </Link>
          <Link
            href="/speaking"
            className="w-full rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-white/20 sm:w-auto"
          >
            {t("guide_start_speaking")}
          </Link>
        </div>
      </div>
    </div>
  );
}
