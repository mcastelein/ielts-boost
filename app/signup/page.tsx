"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/language-context";
import LanguageDropdown from "@/components/language-dropdown";

export default function SignupPage() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError(t("signup_error_weak_password"));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("signup_error_password_mismatch"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already been registered") ||
        error.message.toLowerCase().includes("email address is already used") ||
        error.message.toLowerCase().includes("user already exists")
      ) {
        setError(t("signup_error_exists"));
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // If email is auto-confirmed, redirect straight to dashboard
    if (data.user?.email_confirmed_at) {
      router.push("/dashboard");
      return;
    }

    // Otherwise show "check your email" message
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
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
          <p className="mt-3 text-gray-500">{t("signup_title")}</p>
        </div>

        {success ? (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {t("signup_success")}
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("login_password_label")}
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
                  {t("signup_confirm_password_label")}
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
                {loading ? "..." : t("signup_submit")}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-400">{t("login_or")}</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t("login_google")}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-500">
          {t("signup_has_account")}{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            {t("signup_login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
