"use client";

import { useEffect, useState } from "react";

interface FeedbackItem {
  id: string;
  user_id: string | null;
  user_email: string | null;
  category: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug",
  feature: "Feature",
  improvement: "Improvement",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: "bg-red-100 text-red-700",
  feature: "bg-purple-100 text-purple-700",
  improvement: "bg-blue-100 text-blue-700",
  other: "bg-gray-100 text-gray-700",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-gray-100 text-gray-500",
};

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const perPage = 20;

  useEffect(() => {
    fetchFeedback();
  }, [page, statusFilter]);

  const fetchFeedback = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString() });
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/feedback?${params}`);
    if (res.ok) {
      const data = await res.json();
      setFeedback(data.feedback);
      setTotal(data.total);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status } : f))
      );
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">User Feedback</h2>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : feedback.length === 0 ? (
        <p className="text-gray-400">No feedback yet.</p>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-white">
                <div
                  className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}`}>
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status] ?? STATUS_COLORS.new}`}>
                      {item.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.subject}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{item.user_email ?? "anonymous"}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">{item.message}</p>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Set status:</span>
                      {["new", "reviewed", "resolved", "dismissed"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(item.id, s)}
                          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                            item.status === s
                              ? STATUS_COLORS[s]
                              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      {item.user_email && <span>From: {item.user_email}</span>}
                      {item.user_id && <span className="ml-3">ID: {item.user_id.slice(0, 8)}...</span>}
                      <span className="ml-3">{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* DB Schema Note */}
      <div className="max-w-lg rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
        <p className="font-medium text-gray-700">Required Supabase table:</p>
        <pre className="mt-2 text-xs">
{`create table feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  user_email text,
  category text default 'other',
  subject text not null,
  message text not null,
  status text default 'new',
  created_at timestamp with time zone default now()
);`}
        </pre>
      </div>
    </div>
  );
}
