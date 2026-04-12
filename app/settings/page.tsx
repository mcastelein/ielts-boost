"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/translations";

export default function SettingsPage() {
  const { locale, feedbackLocale, setLocale, setFeedbackLocale, t } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [planType, setPlanType] = useState<string>("free");
  const [hasStripeId, setHasStripeId] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("plan_type, stripe_customer_id")
          .eq("user_id", data.user.id)
          .single();
        setPlanType(settings?.plan_type ?? "free");
        setHasStripeId(!!settings?.stripe_customer_id);
      }
    });
  }, []);

  const handleChange = (setter: (l: Locale) => void, value: Locale) => {
    setter(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const [portalError, setPortalError] = useState<string | null>(null);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error ?? "Something went wrong");
      }
    } catch {
      setPortalError("Failed to connect");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="text-xl font-bold sm:text-2xl">{t("settings_title")}</h1>

      <div className="mt-8 space-y-8">
        {/* Subscription */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="font-semibold text-gray-900">{t("settings_subscription")}</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-500">{t("settings_current_plan")}:</span>
            {planType === "pro" ? (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                {t("settings_plan_pro")}
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {t("settings_plan_free")}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {planType === "pro" ? t("settings_plan_pro_desc") : t("settings_plan_free_desc")}
          </p>

          <div className="mt-4">
            {planType === "pro" && hasStripeId ? (
              <div>
                <p className="text-xs text-gray-400">{t("settings_manage_desc")}</p>
                <button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {portalLoading ? "..." : t("settings_manage_subscription")}
                </button>
                {portalError && (
                  <p className="mt-2 text-xs text-red-500">{portalError}</p>
                )}
              </div>
            ) : (
              <Link
                href="/upgrade"
                className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t("settings_upgrade_cta")}
              </Link>
            )}
          </div>
        </div>

        {/* UI Language */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="font-semibold text-gray-900">{t("settings_ui_language")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("settings_ui_language_desc")}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => handleChange(setLocale, "en")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                locale === "en"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("settings_english")}
            </button>
            <button
              onClick={() => handleChange(setLocale, "zh")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                locale === "zh"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("settings_chinese")}
            </button>
          </div>
        </div>

        {/* Feedback Language */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="font-semibold text-gray-900">{t("settings_feedback_language")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("settings_feedback_language_desc")}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => handleChange(setFeedbackLocale, "en")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                feedbackLocale === "en"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("settings_english")}
            </button>
            <button
              onClick={() => handleChange(setFeedbackLocale, "zh")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                feedbackLocale === "zh"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t("settings_chinese")}
            </button>
          </div>
        </div>
      </div>

      {/* Save confirmation */}
      {saved && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {t("settings_saved")}
        </div>
      )}
    </div>
  );
}
