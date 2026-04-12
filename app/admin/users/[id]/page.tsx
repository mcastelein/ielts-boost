"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserDetail {
  user: {
    user_id: string;
    email: string | null;
    display_name: string | null;
    role: string;
    plan_type: string;
    ui_language: string;
    feedback_language: string;
    created_at: string;
  };
  writingSubmissions: WritingSub[];
  speakingSubmissions: SpeakingSub[];
  apiUsage: {
    totalCost: number;
    byType: Record<string, { count: number; cost: number }>;
    byDay: Record<string, { count: number; cost: number }>;
    recentLogs: ApiLog[];
  };
  sessions: {
    total: number;
    avgCost: number;
    recent: { start: string; end: string; calls: number; cost: number }[];
  };
  usageToday: { writing_count: number; speaking_count: number } | null;
  mistakePatterns: [string, number][];
  scoreTrend: { date: string; overall: number; task: number; coherence: number; lexical: number; grammar: number }[];
}

interface WritingSub {
  id: string;
  task_type: string;
  prompt_topic: string | null;
  final_text: string;
  created_at: string;
  writing_feedback: {
    overall_band: number;
    task_score: number;
    coherence_score: number;
    lexical_score: number;
    grammar_score: number;
    feedback_json: Record<string, unknown>;
  }[];
}

interface SpeakingSub {
  id: string;
  prompt: string;
  response_text: string;
  created_at: string;
  speaking_feedback: {
    estimated_band: number | null;
    feedback_json: Record<string, unknown>;
  }[];
}

interface ApiLog {
  id: string;
  call_type: string;
  model: string;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost_usd: number | null;
  duration_ms: number | null;
  created_at: string;
}

const CALL_TYPE_LABELS: Record<string, string> = {
  writing_score: "Writing Score",
  ocr: "OCR",
  speaking_score: "Speaking Score",
  transcribe: "Transcription",
  tts: "Text-to-Speech",
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "writing" | "speaking" | "api">("overview");

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading user details...</p>;
  if (!data) return <p className="text-red-500">User not found.</p>;

  const { user, writingSubmissions, speakingSubmissions, apiUsage, sessions, usageToday, mistakePatterns, scoreTrend } = data;
  const fmt = (n: number) => `$${n.toFixed(4)}`;

  const dailyCostData = Object.entries(apiUsage.byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, stats]) => ({ date: day.slice(5), cost: Number(stats.cost.toFixed(4)) }));

  const typeCostData = Object.entries(apiUsage.byType)
    .sort(([, a], [, b]) => b.cost - a.cost)
    .map(([type, stats]) => ({ name: CALL_TYPE_LABELS[type] ?? type, cost: Number(stats.cost.toFixed(4)), calls: stats.count }));

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "writing" as const, label: `Writing (${writingSubmissions.length})` },
    { key: "speaking" as const, label: `Speaking (${speakingSubmissions.length})` },
    { key: "api" as const, label: "API Usage" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">
            &larr; Back to users
          </Link>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            {user.display_name ?? user.email ?? user.user_id.slice(0, 12) + "..."}
          </h2>
          {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
        </div>
        <div className="flex gap-2 text-sm">
          <span className={`rounded-full px-3 py-1 font-medium ${user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
            {user.role}
          </span>
          <span className={`rounded-full px-3 py-1 font-medium ${user.plan_type === "pro" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
            {user.plan_type}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Total API Cost</p>
              <p className="text-xl font-bold text-gray-900">{fmt(apiUsage.totalCost)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Writing Subs</p>
              <p className="text-xl font-bold text-gray-900">{writingSubmissions.length}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Speaking Subs</p>
              <p className="text-xl font-bold text-gray-900">{speakingSubmissions.length}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Today&apos;s Writing</p>
              <p className="text-xl font-bold text-gray-900">{usageToday?.writing_count ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-sm font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Sessions */}
          {sessions.total > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">
                  Practice Sessions ({sessions.total} total, avg cost: {fmt(sessions.avgCost)})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Duration</th>
                      <th className="px-4 py-2">API Calls</th>
                      <th className="px-4 py-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.recent.map((s, i) => {
                      const start = new Date(s.start);
                      const end = new Date(s.end);
                      const durMin = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
                      return (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                            {start.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-gray-600">{durMin}min</td>
                          <td className="px-4 py-2 text-gray-600">{s.calls}</td>
                          <td className="px-4 py-2 text-gray-600">{fmt(s.cost)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Score Trend */}
          {scoreTrend.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Writing Score Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 9]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={2} name="Overall" />
                  <Line type="monotone" dataKey="task" stroke="#10b981" strokeWidth={1} name="Task" dot={false} />
                  <Line type="monotone" dataKey="coherence" stroke="#f59e0b" strokeWidth={1} name="Coherence" dot={false} />
                  <Line type="monotone" dataKey="lexical" stroke="#8b5cf6" strokeWidth={1} name="Lexical" dot={false} />
                  <Line type="monotone" dataKey="grammar" stroke="#ef4444" strokeWidth={1} name="Grammar" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Mistake Patterns */}
          {mistakePatterns.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">Recurring Weaknesses</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {mistakePatterns.map(([pattern, count]) => (
                    <span key={pattern} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
                      {pattern} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User info */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-medium text-gray-900">Settings</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-gray-500">UI Language</dt>
                <dd className="font-medium text-gray-900">{user.ui_language}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Feedback Language</dt>
                <dd className="font-medium text-gray-900">{user.feedback_language}</dd>
              </div>
              <div>
                <dt className="text-gray-500">User ID</dt>
                <dd className="font-mono text-xs text-gray-700">{user.user_id}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Writing Tab */}
      {activeTab === "writing" && (
        <div className="space-y-4">
          {writingSubmissions.length === 0 ? (
            <p className="text-gray-400">No writing submissions yet.</p>
          ) : (
            writingSubmissions.map((sub) => {
              const fb = sub.writing_feedback?.[0];
              return (
                <div key={sub.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {sub.task_type === "task1" ? "Task 1" : "Task 2"}
                      </span>
                      {sub.prompt_topic && (
                        <span className="text-sm text-gray-500">{sub.prompt_topic}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleString()}
                    </span>
                  </div>
                  {fb && (
                    <div className="mb-3 flex gap-4 text-sm">
                      <span className="font-bold text-gray-900">Band {fb.overall_band}</span>
                      <span className="text-gray-500">T:{fb.task_score} C:{fb.coherence_score} L:{fb.lexical_score} G:{fb.grammar_score}</span>
                    </div>
                  )}
                  <p className="line-clamp-3 text-sm text-gray-600">{sub.final_text}</p>
                  {fb?.feedback_json && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                        View full feedback
                      </summary>
                      <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                        {JSON.stringify(fb.feedback_json, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Speaking Tab */}
      {activeTab === "speaking" && (
        <div className="space-y-4">
          {speakingSubmissions.length === 0 ? (
            <p className="text-gray-400">No speaking submissions yet.</p>
          ) : (
            speakingSubmissions.map((sub) => {
              const fb = sub.speaking_feedback?.[0];
              return (
                <div key={sub.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{sub.prompt}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleString()}
                    </span>
                  </div>
                  {fb?.estimated_band && (
                    <p className="mb-2 text-sm font-bold text-gray-900">
                      Est. Band {fb.estimated_band}
                    </p>
                  )}
                  <p className="line-clamp-3 text-sm text-gray-600">{sub.response_text}</p>
                  {fb?.feedback_json && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                        View full feedback
                      </summary>
                      <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                        {JSON.stringify(fb.feedback_json, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* API Usage Tab */}
      {activeTab === "api" && (
        <div className="space-y-6">
          {/* Cost charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Daily Cost</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyCostData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(4)}`, "Cost"]} />
                  <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-medium text-gray-900">Cost by Type</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={typeCostData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toFixed(4)}`, "Cost"]} />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent API calls */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-medium text-gray-900">Recent API Calls</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Model</th>
                    <th className="px-4 py-2">Tokens</th>
                    <th className="px-4 py-2">Cost</th>
                    <th className="px-4 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {apiUsage.recentLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50">
                      <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-900">
                        {CALL_TYPE_LABELS[log.call_type] ?? log.call_type}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-600">{log.model}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {log.input_tokens != null ? `${log.input_tokens}/${log.output_tokens}` : "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {log.estimated_cost_usd != null ? fmt(log.estimated_cost_usd) : "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {log.duration_ms != null ? `${(log.duration_ms / 1000).toFixed(1)}s` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
