"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/api-usage", label: "API Usage" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/settings", label: "Settings" },
];

interface BudgetAlerts {
  dailyExceeded: boolean;
  monthlyExceeded: boolean;
  dailyWarning: boolean;
  monthlyWarning: boolean;
}

interface BudgetInfo {
  budgets: { daily: number | null; monthly: number | null };
  current: { today: number; month: number };
  alerts: BudgetAlerts;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("user_settings")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (data?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setAuthorized(true);

      // Fetch budget alerts
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) setBudgetInfo(await res.json());
      } catch {
        // Budget check is non-critical
      }
    };

    checkAdmin();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Checking permissions...</p>
      </div>
    );
  }

  const alerts = budgetInfo?.alerts;
  const fmt = (n: number) => `$${n.toFixed(4)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Budget alerts */}
      {alerts?.dailyExceeded && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Daily budget exceeded! Today&apos;s cost: {fmt(budgetInfo!.current.today)} / {fmt(budgetInfo!.budgets.daily!)}
        </div>
      )}
      {alerts?.monthlyExceeded && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Monthly budget exceeded! This month: {fmt(budgetInfo!.current.month)} / {fmt(budgetInfo!.budgets.monthly!)}
        </div>
      )}
      {alerts?.dailyWarning && !alerts?.dailyExceeded && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Approaching daily budget: {fmt(budgetInfo!.current.today)} / {fmt(budgetInfo!.budgets.daily!)} (80%+)
        </div>
      )}
      {alerts?.monthlyWarning && !alerts?.monthlyExceeded && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Approaching monthly budget: {fmt(budgetInfo!.current.month)} / {fmt(budgetInfo!.budgets.monthly!)} (80%+)
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-900">Admin</h1>
          <div className="flex gap-1">
            {adminLinks.map((link) => {
              const isActive = "exact" in link && link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to app
        </Link>
      </div>
      {children}
    </div>
  );
}
