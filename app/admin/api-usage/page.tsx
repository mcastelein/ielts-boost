"use client";

import { useEffect, useState } from "react";

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
  const [days, setDays] = useState(30);
  const [filterUser, setFilterUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [days, filterUser]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({ days: days.toString() });
    if (filterUser) params.set("user_id", filterUser);

    const res = await fetch(`/api/admin/api-usage?${params}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
      setSummary(data.summary);
    }
    setLoading(false);
  };

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;
  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">API Usage & Costs</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
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
                        <td className="px-4 py-2 font-mono text-xs text-gray-700">
                          {uid === "anonymous" ? (
                            <span className="text-gray-400">anonymous</span>
                          ) : (
                            uid.slice(0, 8) + "..."
                          )}
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
                  {logs.slice(0, 50).map((log) => (
                    <tr key={log.id} className="border-b border-gray-50">
                      <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-4 py-2 text-gray-900">
                        {CALL_TYPE_LABELS[log.call_type] ?? log.call_type}
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
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">
                        {log.user_id ? log.user_id.slice(0, 8) + "..." : "anon"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
