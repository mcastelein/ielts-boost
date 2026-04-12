"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import LanguageDropdown from "@/components/language-dropdown";

export default function ResetPasswordPage() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Supabase sends the recovery token as a hash fragment.
  // The Supabase client auto-detects it and sets the session on load.
  // We just need to wait for the session to be established before allowing the update.
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now active with the recovery token — user can update their password.
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("reset_error_mismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("signup_error_weak_password"));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(t("login_error_generic"));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
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
          <p className="mt-3 text-gray-500">{t("reset_title")}</p>
        </div>

        {success ? (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {t("reset_success")}
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("reset_new_password")}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  {t("reset_confirm_password")}
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "..." : t("reset_submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
