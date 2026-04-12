"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [dailyBudget, setDailyBudget] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [currentToday, setCurrentToday] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setDailyBudget(data.budgets.daily?.toString() ?? "");
          setMonthlyBudget(data.budgets.monthly?.toString() ?? "");
          setCurrentToday(data.current.today);
          setCurrentMonth(data.current.month);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        daily_budget: dailyBudget ? parseFloat(dailyBudget) : null,
        monthly_budget: monthlyBudget ? parseFloat(monthlyBudget) : null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fmt = (n: number) => `$${n.toFixed(4)}`;

  if (loading) return <p className="text-gray-500">Loading settings...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-gray-900">Admin Settings</h2>

      {/* Budget Configuration */}
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-medium text-gray-900">API Cost Budget Alerts</h3>
        <p className="mb-4 text-sm text-gray-500">
          Set budget thresholds to show warning banners when costs approach or exceed limits.
          Leave empty to disable.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Daily Budget (USD)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.01"
                min="0"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                placeholder="e.g. 1.00"
                className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <span className="text-sm text-gray-500">
                Today: {fmt(currentToday)}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Monthly Budget (USD)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.01"
                min="0"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="e.g. 20.00"
                className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <span className="text-sm text-gray-500">
                This month: {fmt(currentMonth)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {saved && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </div>
      </div>

      {/* DB Schema Note */}
      <div className="max-w-lg rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
        <p className="font-medium text-gray-700">Required Supabase table:</p>
        <pre className="mt-2 text-xs">
{`create table admin_settings (
  key text primary key,
  value jsonb,
  updated_at timestamp with time zone default now()
);`}
        </pre>
      </div>
    </div>
  );
}
