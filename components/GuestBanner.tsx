"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function GuestBanner() {
  const { t } = useLanguage();
  return (
    <div className="border-b border-blue-100 bg-blue-50 px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-4">
        <p className="text-sm text-blue-800">{t("guest_banner_text")}</p>
        <div className="text-center">
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("guest_banner_cta")}
          </Link>
          <p className="mt-1 text-xs text-blue-600">{t("guest_banner_no_cc")}</p>
        </div>
      </div>
    </div>
  );
}
