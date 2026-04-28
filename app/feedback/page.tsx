"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { btnPrimaryBlock, btnSecondarySmall } from "@/lib/button-styles";

const CATEGORIES = ["bug", "feature", "improvement", "other"] as const;

export default function FeedbackPage() {
  const { t } = useLanguage();
  const [category, setCategory] = useState("other");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const categoryLabels: Record<string, string> = {
    bug: t("feedback_cat_bug"),
    feature: t("feedback_cat_feature"),
    improvement: t("feedback_cat_improvement"),
    other: t("feedback_cat_other"),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || sending) return;

    setSending(true);
    setError(false);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, message }),
      });

      if (res.ok) {
        setSent(true);
        setSubject("");
        setMessage("");
        setCategory("other");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-green-800">{t("feedback_success")}</p>
          <button
            onClick={() => setSent(false)}
            className={`mt-6 ${btnSecondarySmall}`}
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold">{t("feedback_form_title")}</h1>
      <p className="mt-1 text-sm text-gray-500">{t("feedback_form_subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("feedback_category")}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("feedback_subject")}
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("feedback_subject_placeholder")}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
            {t("feedback_message")}
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("feedback_message_placeholder")}
            required
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{t("feedback_error")}</p>
        )}

        <button
          type="submit"
          disabled={!subject.trim() || !message.trim() || sending}
          className={`${btnPrimaryBlock} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {sending ? t("feedback_sending") : t("feedback_submit")}
        </button>
      </form>
    </div>
  );
}
