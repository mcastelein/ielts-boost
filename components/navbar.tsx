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
  { href: "/writing", labelKey: "nav_writing" },
  { href: "/speaking", labelKey: "nav_speaking" },
  { href: "/history", labelKey: "nav_history" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [planType, setPlanType] = useState<string>("free");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            IELTS<span className="text-blue-600">Boost</span>
          </Link>
          <div className="flex gap-1">
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
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language dropdown */}
          <LanguageDropdown locale={locale} setLocale={setLocale} />

          {/* Upgrade to Pro */}
          {planType !== "pro" && (
            <Link
              href="/upgrade"
              className="rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
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
              <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {/* User info */}
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                {/* Links */}
                <div className="py-1">
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
        </div>
      </div>
    </nav>
  );
}
