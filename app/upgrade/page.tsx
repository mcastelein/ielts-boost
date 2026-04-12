"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const PRO_FEATURES = [
  "upgrade_feature_unlimited_writing",
  "upgrade_feature_unlimited_speaking",
  "upgrade_feature_deep_analysis",
  "upgrade_feature_model_essays",
  "upgrade_feature_pdf_export",
  "upgrade_feature_priority",
] as const;

export default function UpgradePage() {
  const { t } = useLanguage();
  const [planType, setPlanType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
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

  const stripeUrl = userId
    ? `https://buy.stripe.com/8x214n8QAgV164c85l7kc02?client_reference_id=${userId}`
    : "#";

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">{t("common_loading")}</p>
      </div>
    );
  }

  if (planType === "pro") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("upgrade_already_pro")}</h1>
          <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            {t("upgrade_pro_plan")}
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {t("nav_dashboard")} &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t("upgrade_title")}</h1>
        <p className="mt-2 text-gray-600">{t("upgrade_subtitle")}</p>
      </div>

      {/* Current plan badge */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm">
          <span className="text-gray-500">{t("upgrade_current_plan")}:</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {t("upgrade_free_plan")}
          </span>
          <span className="text-gray-400">{t("upgrade_free_limit")}</span>
        </div>
      </div>

      {/* Pro features */}
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-center text-lg font-semibold text-gray-900">
          {t("upgrade_pro_plan")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PRO_FEATURES.map((key) => (
            <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t(key)}
            </div>
          ))}
        </div>
      </div>

      {/* Payment options */}
      <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">
        {t("upgrade_how_to_pay")}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* International option */}
        <div className="flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 transition-colors hover:border-blue-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t("upgrade_international")}</h3>
              <p className="text-xs text-gray-500">{t("upgrade_international_methods")}</p>
            </div>
          </div>

          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{t("upgrade_international_price")}</span>
            <span className="text-gray-500">{t("upgrade_international_period")}</span>
          </div>

          <div className="mb-4 flex gap-2">
            <PaymentIcon type="visa" />
            <PaymentIcon type="mastercard" />
            <PaymentIcon type="amex" />
            <PaymentIcon type="applepay" />
            <PaymentIcon type="googlepay" />
          </div>

          <a
            href={stripeUrl}
            className="mt-auto block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            {t("upgrade_subscribe")}
          </a>
        </div>

        {/* China option */}
        <div className="flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 transition-colors hover:border-green-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t("upgrade_china")}</h3>
              <p className="text-xs text-gray-500">{t("upgrade_china_methods")}</p>
            </div>
          </div>

          <div className="mb-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{t("upgrade_china_price")}</span>
            <span className="text-gray-500">{t("upgrade_china_period")}</span>
          </div>

          <div className="mb-4 flex gap-2">
            <PaymentIcon type="wechatpay" />
            <PaymentIcon type="alipay" />
          </div>

          <button
            disabled
            className="mt-auto block rounded-lg bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-400 cursor-not-allowed"
          >
            {t("upgrade_coming_soon")}
          </button>
        </div>
      </div>

      {/* Guarantee */}
      <p className="mt-6 text-center text-sm text-gray-500">{t("upgrade_guarantee")}</p>
    </div>
  );
}

function PaymentIcon({ type }: { type: string }) {
  const labels: Record<string, string> = {
    visa: "Visa",
    mastercard: "MC",
    amex: "Amex",
    applepay: "Pay",
    googlepay: "G Pay",
    wechatpay: "WeChat",
    alipay: "Alipay",
  };

  const colors: Record<string, string> = {
    visa: "bg-blue-50 text-blue-700 border-blue-200",
    mastercard: "bg-orange-50 text-orange-700 border-orange-200",
    amex: "bg-sky-50 text-sky-700 border-sky-200",
    applepay: "bg-gray-50 text-gray-700 border-gray-200",
    googlepay: "bg-gray-50 text-gray-700 border-gray-200",
    wechatpay: "bg-green-50 text-green-700 border-green-200",
    alipay: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium ${colors[type] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {labels[type] ?? type}
    </span>
  );
}
