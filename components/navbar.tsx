"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKey } from "@/lib/translations";
import LanguageDropdown from "@/components/language-dropdown";

const navLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/dashboard", labelKey: "nav_dashboard" },
  { href: "/writing", labelKey: "nav_writing" },
  { href: "/speaking", labelKey: "nav_speaking" },
  { href: "/history", labelKey: "nav_history" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("role")
          .eq("user_id", data.user.id)
          .single();
        setIsAdmin(settings?.role === "admin");
      }
    });
  }, []);

  if (!user) return null;

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
            {isAdmin && (
              <Link
                href="/admin/api-usage"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {t("nav_admin")}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language dropdown */}
          <LanguageDropdown locale={locale} setLocale={setLocale} />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {t("nav_signout")}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

