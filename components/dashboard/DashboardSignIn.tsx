"use client";

import { useLanguage } from "@/lib/language-context";

export default function DashboardSignIn() {
  const { t } = useLanguage();

  return <p className="text-gray-500">{t("dashboard_signin")}</p>;
}
