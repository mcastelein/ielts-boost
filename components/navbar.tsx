"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";
import LanguageDropdown from "@/components/language-dropdown";

const navLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/dashboard", labelKey: "nav_dashboard" },
  { href: "/guide", labelKey: "nav_guide" },
];

const practiceLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/reading", labelKey: "nav_reading" },
  { href: "/writing", labelKey: "nav_writing" },
  { href: "/listening", labelKey: "nav_listening" },
  { href: "/speaking", labelKey: "nav_speaking" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [planType, setPlanType] = useState<string>("free");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const practiceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("role, plan_type")
          .eq("user_id", data.user.id)
          .single();
        setIsAdmin(settings?.role === "admin");
        setPlanType(settings?.plan_type ?? "free");
      }
    });
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (practiceDropdownRef.current && !practiceDropdownRef.current.contains(e.target as Node)) {
        setPracticeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPracticeDropdownOpen(false);
  }, [pathname]);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture;
  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Left: Logo + desktop nav */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            IELTS<span className="text-blue-600">Boost</span>
          </Link>
          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Practice dropdown */}
            <div className="relative" ref={practiceDropdownRef}>
              <button
                onClick={() => setPracticeDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  practiceLinks.some((l) => pathname.startsWith(l.href))
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {t("nav_practice")}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${practiceDropdownOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {practiceDropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {practiceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                        pathname.startsWith(link.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/history"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/history")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {t("nav_history")}
            </Link>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Language dropdown */}
          <LanguageDropdown locale={locale} setLocale={setLocale} />

          {/* Upgrade to Pro — hidden on very small screens */}
          {planType !== "pro" && (
            <Link
              href="/upgrade"
              className="hidden rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:block"
            >
              {t("nav_upgrade")}
            </Link>
          )}

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-gray-100"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                  {initials}
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:w-56">
                {/* User info */}
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>

                {/* Links */}
                <div className="py-1">
                  {/* Upgrade (shown in dropdown on mobile) */}
                  {planType !== "pro" && (
                    <Link
                      href="/upgrade"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:hidden"
                    >
                      <span>{t("nav_upgrade")}</span>
                      <span className="ml-auto rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                        Pro
                      </span>
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t("nav_settings")}
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span>{t("nav_admin")}</span>
                      <span className="ml-auto rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                        Admin
                      </span>
                    </Link>
                  )}
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 py-1">
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t("nav_signout")}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-3 pt-2 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            {/* Practice section */}
            <div className="pt-1">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t("nav_practice")}
              </p>
              {practiceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname.startsWith(link.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
