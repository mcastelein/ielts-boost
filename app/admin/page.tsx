"use client";

import { useEffect, useState, useCallback } from "react";
import AutoRefresh from "@/components/admin/AutoRefresh";

interface Stats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    activeThisWeek: number;
    plans: { free: number; pro: number };
  };
  submissions: {
    writing: { today: number; week: number; month: number };
    speaking: { today: number; week: number; month: number };
  };
  costs: {
    today: number;
    week: number;
    month: number;
    avgSessionCost: number;
    sessionsThisMonth: number;
  };
  topUsersByCost: { id: string; email: string | null; name: string | null; cost: number }[];
  topUsersByActivity: { id: string; email: string | null; name: string | null; submissions: number }[];
  averageBands: {
    writing: number | null;
    speaking: number | null;
  };
  systemHealth: {
    model: string;
    calls24h: number;
    errors24h: number;
    errorRate: string;
    avgDurationMs: number;
    lastCall: string;
  }[];
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setStats(data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="text-red-500">Failed to load dashboard stats.</p>;
  }

  const fmt = (n: number) => `$${n.toFixed(4)}`;
  const fmtBand = (n: number | null) => (n !== null ? n.toFixed(1) : "—");
  const resolveUser = (u: { email: string | null; name: string | null; id: string }) =>
    u.name ?? u.email ?? u.id.slice(0, 8) + "...";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <AutoRefresh onRefresh={fetchStats} />
      </div>

      {/* User KPIs */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">Users</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Users" value={stats.users.total} />
          <StatCard label="New Today" value={stats.users.newToday} />
          <StatCard label="New This Week" value={stats.users.newThisWeek} />
          <StatCard
            label="Active (7d)"
            value={stats.users.activeThisWeek}
            sub={`${stats.users.plans.free} free / ${stats.users.plans.pro} pro`}
          />
        </div>
      </div>

      {/* Submission KPIs */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">Submissions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Writing Today" value={stats.submissions.writing.today} />
          <StatCard label="Writing (7d)" value={stats.submissions.writing.week} />
          <StatCard label="Writing (30d)" value={stats.submissions.writing.month} />
          <StatCard label="Speaking Today" value={stats.submissions.speaking.today} />
          <StatCard label="Speaking (7d)" value={stats.submissions.speaking.week} />
          <StatCard label="Speaking (30d)" value={stats.submissions.speaking.month} />
        </div>
      </div>

      {/* Cost KPIs */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">API Costs</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard label="Today" value={fmt(stats.costs.today)} />
          <StatCard label="This Week" value={fmt(stats.costs.week)} />
          <StatCard label="This Month" value={fmt(stats.costs.month)} />
          <StatCard label="Sessions (30d)" value={stats.costs.sessionsThisMonth} />
          <StatCard label="Avg Session Cost" value={fmt(stats.costs.avgSessionCost)} />
        </div>
      </div>

      {/* Average Band Scores */}
      <div>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
          Average Band Scores (30d)
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <StatCard label="Avg Writing Band" value={fmtBand(stats.averageBands.writing)} />
          <StatCard label="Avg Speaking Band" value={fmtBand(stats.averageBands.speaking)} />
        </div>
      </div>

      {/* Top Users */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Cost */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h3 className="font-medium text-gray-900">Top Users by Cost (30d)</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUsersByCost.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-center text-gray-400">
                    No data yet
                  </td>
                </tr>
              ) : (
                stats.topUsersByCost.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50">
                    <td className="px-4 py-2 text-gray-900">{resolveUser(u)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{fmt(u.cost)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* By Activity */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h3 className="font-medium text-gray-900">Top Users by Submissions (30d)</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2 text-right">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUsersByActivity.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-center text-gray-400">
                    No data yet
                  </td>
                </tr>
              ) : (
                stats.topUsersByActivity.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50">
                    <td className="px-4 py-2 text-gray-900">{resolveUser(u)}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{u.submissions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health */}
      {stats.systemHealth.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
            System Health (24h)
          </h3>
          <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Calls</th>
                  <th className="px-4 py-3">Errors</th>
                  <th className="px-4 py-3">Error Rate</th>
                  <th className="px-4 py-3">Avg Duration</th>
                  <th className="px-4 py-3">Last Call</th>
                </tr>
              </thead>
              <tbody>
                {stats.systemHealth.map((h) => (
                  <tr key={h.model} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-900">{h.model}</td>
                    <td className="px-4 py-3 text-gray-600">{h.calls24h}</td>
                    <td className="px-4 py-3">
                      <span className={h.errors24h > 0 ? "font-medium text-red-600" : "text-gray-600"}>
                        {h.errors24h}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={parseFloat(h.errorRate) > 5 ? "font-medium text-red-600" : "text-gray-600"}>
                        {h.errorRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{(h.avgDurationMs / 1000).toFixed(1)}s</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {h.lastCall ? new Date(h.lastCall).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
