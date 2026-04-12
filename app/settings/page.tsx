"use client";

import { useLanguage } from "@/lib/language-context";
import type { Locale } from "@/lib/translations";
import { useState } from "react";

export default function SettingsPage() {
  const { locale, feedbackLocale, setLocale, setFeedbackLocale, t } = useLanguage();
  const [saved, setSaved] = useState(false);

  const handleChange = (setter: (l: Locale) => void, value: Locale) => {
    setter(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-8">
      <h1 className="text-xl font-bold sm:text-2xl">{t("settings_title")}</h1>

      <div className="mt-8 space-y-8">
        {/* UI Language */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
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
        <div className="rounded-xl border border-gray-200 bg-white p-6">
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
