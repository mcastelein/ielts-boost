"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { downloadCsv } from "@/lib/csv-export";
import AutoRefresh from "@/components/admin/AutoRefresh";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ApiLog {
  id: string;
  user_id: string | null;
  call_type: string;
  model: string;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost_usd: number | null;
  duration_ms: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface Summary {
  totalCalls: number;
  totalCost: number;
  byType: Record<string, { count: number; cost: number }>;
  byUser: Record<string, { count: number; cost: number }>;
  byDay: Record<string, { count: number; cost: number }>;
}

type UserProfiles = Record<string, { email: string; name: string | null }>;

const CALL_TYPE_LABELS: Record<string, string> = {
  writing_score: "Writing Score",
  ocr: "OCR",
  speaking_score: "Speaking Score",
  transcribe: "Transcription",
  tts: "Text-to-Speech",
};

export default function ApiUsagePage() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [profiles, setProfiles] = useState<UserProfiles>({});
  const [days, setDays] = useState(30);
  const [filterUser, setFilterUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ days: days.toString() });
    if (filterUser) params.set("user_id", filterUser);

    const res = await fetch(`/api/admin/api-usage?${params}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
      setSummary(data.summary);
      setProfiles(data.profiles ?? {});
    }
    setLoading(false);
  }, [days, filterUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;
  const formatDate = (iso: string) => new Date(iso).toLocaleString();
  const resolveUser = (uid: string) => {
    if (uid === "anonymous") return "Anonymous";
    const p = profiles[uid];
    return p?.name ?? p?.email ?? uid.slice(0, 8) + "...";
  };

  // Chart data
  const dailyChartData = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, stats]) => ({
        date: day.slice(5), // MM-DD
        cost: Number(stats.cost.toFixed(4)),
        calls: stats.count,
      }));
  }, [summary]);

  const cumulativeChartData = useMemo(() => {
    let running = 0;
    return dailyChartData.map((d) => {
      running += d.cost;
      return { ...d, cumulative: Number(running.toFixed(4)) };
    });
  }, [dailyChartData]);

  const typeChartData = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.byType)
      .sort(([, a], [, b]) => b.cost - a.cost)
      .map(([type, stats]) => ({
        name: CALL_TYPE_LABELS[type] ?? type,
        cost: Number(stats.cost.toFixed(4)),
        calls: stats.count,
      }));
  }, [summary]);

  const userPieData = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.byUser)
      .filter(([, s]) => s.cost > 0)
      .sort(([, a], [, b]) => b.cost - a.cost)
      .slice(0, 8)
      .map(([uid, stats]) => ({
        name: resolveUser(uid),
        value: Number(stats.cost.toFixed(4)),
      }));
  }, [summary, profiles]);

  const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">API Usage & Costs</h2>
        <AutoRefresh onRefresh={fetchData} />
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <button
          onClick={() => {
            downloadCsv(
              "api-usage-export.csv",
              ["Time", "Type", "Model", "Input Tokens", "Output Tokens", "Cost", "Duration (ms)", "User"],
              logs.map((l) => [
                new Date(l.created_at).toISOString(),
                CALL_TYPE_LABELS[l.call_type] ?? l.call_type,
                l.model,
                String(l.input_tokens ?? ""),
                String(l.output_tokens ?? ""),
                l.estimated_cost_usd?.toFixed(6) ?? "",
                String(l.duration_ms ?? ""),
                l.user_id ? resolveUser(l.user_id) : "anonymous",
              ])
            );
          }}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.totalCalls ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCost(summary?.totalCost ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Avg Cost/Call</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary && summary.totalCalls > 0
                  ? formatCost(summary.totalCost / summary.totalCalls)
                  : "$0.0000"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary ? Object.keys(summary.byUser).length : 0}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Daily Cost Line Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Daily Cost</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(4)}`, "Cost"]} />
                  <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cumulative Cost Line Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Cumulative Cost</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cumulativeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(4)}`, "Cumulative"]} />
                  <Line type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost by Type Bar Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Cost by API Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(4)}`, "Cost"]} />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost by User Pie Chart */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Cost by User</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {userPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${Number(v).toFixed(4)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown by type */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-medium text-gray-900">By API Type</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Calls</th>
                  <th className="px-4 py-2">Cost</th>
                  <th className="px-4 py-2">Avg Cost</th>
                </tr>
              </thead>
              <tbody>
                {summary &&
                  Object.entries(summary.byType)
                    .sort(([, a], [, b]) => b.cost - a.cost)
                    .map(([type, stats]) => (
                      <tr key={type} className="border-b border-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {CALL_TYPE_LABELS[type] ?? type}
                        </td>
                        <td className="px-4 py-2 text-gray-600">{stats.count}</td>
                        <td className="px-4 py-2 text-gray-600">{formatCost(stats.cost)}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {formatCost(stats.count > 0 ? stats.cost / stats.count : 0)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Breakdown by user */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-medium text-gray-900">By User</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Calls</th>
                  <th className="px-4 py-2">Cost</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {summary &&
                  Object.entries(summary.byUser)
                    .sort(([, a], [, b]) => b.cost - a.cost)
                    .map(([uid, stats]) => (
                      <tr key={uid} className="border-b border-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {resolveUser(uid)}
                        </td>
                        <td className="px-4 py-2 text-gray-600">{stats.count}</td>
                        <td className="px-4 py-2 text-gray-600">{formatCost(stats.cost)}</td>
                        <td className="px-4 py-2">
                          {uid !== "anonymous" && (
                            <button
                              onClick={() => setFilterUser(uid === filterUser ? "" : uid)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              {uid === filterUser ? "Clear filter" : "Filter"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Daily breakdown */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-medium text-gray-900">Daily Breakdown</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Calls</th>
                  <th className="px-4 py-2">Cost</th>
                </tr>
              </thead>
              <tbody>
                {summary &&
                  Object.entries(summary.byDay)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([day, stats]) => (
                      <tr key={day} className="border-b border-gray-50">
                        <td className="px-4 py-2 text-gray-900">{day}</td>
                        <td className="px-4 py-2 text-gray-600">{stats.count}</td>
                        <td className="px-4 py-2 text-gray-600">{formatCost(stats.cost)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Recent calls log */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-medium text-gray-900">Recent Calls</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Model</th>
                    <th className="px-4 py-2">Tokens (in/out)</th>
                    <th className="px-4 py-2">Cost</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">User</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 50).map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          className="cursor-pointer border-b border-gray-50 hover:bg-gray-50"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        >
                          <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="px-4 py-2 text-gray-900">
                            {CALL_TYPE_LABELS[log.call_type] ?? log.call_type}
                            {log.metadata && (log.metadata as Record<string, unknown>).success === false && (
                              <span className="ml-1 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">failed</span>
                            )}
                          </td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-600">
                            {log.model}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {log.input_tokens !== null
                              ? `${log.input_tokens} / ${log.output_tokens}`
                              : "—"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {log.estimated_cost_usd !== null
                              ? formatCost(log.estimated_cost_usd)
                              : "—"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {log.duration_ms !== null ? `${(log.duration_ms / 1000).toFixed(1)}s` : "—"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {log.user_id ? resolveUser(log.user_id) : "anon"}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <td colSpan={7} className="px-4 py-3">
                              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                                <div>
                                  <span className="font-medium text-gray-500">Log ID</span>
                                  <p className="mt-0.5 font-mono text-gray-700">{log.id}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">User ID</span>
                                  <p className="mt-0.5 font-mono text-gray-700">{log.user_id ?? "anonymous"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Input Tokens</span>
                                  <p className="mt-0.5 text-gray-700">{log.input_tokens?.toLocaleString() ?? "N/A"}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-500">Output Tokens</span>
                                  <p className="mt-0.5 text-gray-700">{log.output_tokens?.toLocaleString() ?? "N/A"}</p>
                                </div>
                              </div>
                              {log.metadata && (
                                <div className="mt-3">
                                  <span className="text-xs font-medium text-gray-500">Metadata</span>
                                  <pre className="mt-1 max-h-40 overflow-auto rounded bg-white p-2 text-xs text-gray-700">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
