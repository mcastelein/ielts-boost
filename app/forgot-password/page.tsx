"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import LanguageDropdown from "@/components/language-dropdown";

export default function ForgotPasswordPage() {
  const { locale, setLocale, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50">
      <div className="absolute right-4 top-4">
        <LanguageDropdown locale={locale} setLocale={setLocale} />
      </div>
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            IELTS<span className="text-blue-600">Boost</span>
          </h1>
          <p className="mt-3 text-gray-500">{t("forgot_title")}</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {t("forgot_success")}
            </div>
            <Link
              href="/login"
              className="block text-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t("forgot_back")}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-gray-500">{t("forgot_subtitle")}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("login_email_label")}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "..." : t("forgot_submit")}
              </button>
            </form>

            <p className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {t("forgot_back")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
