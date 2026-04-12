"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  admin_user_id: string;
  admin_email: string | null;
  admin_name: string | null;
  action: string;
  target_user_id: string | null;
  target_email: string | null;
  target_name: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  update_user: "Updated user",
  update_budget_settings: "Updated budget settings",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 50;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/audit-log?page=${page}`)
      .then((r) => (r.ok ? r.json() : { logs: [], total: 0 }))
      .then((data) => {
        setLogs(data.logs);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / perPage);
  const resolveUser = (u: { admin_name?: string | null; admin_email?: string | null; admin_user_id?: string; target_name?: string | null; target_email?: string | null; target_user_id?: string | null }, type: "admin" | "target") => {
    if (type === "admin") return u.admin_name ?? u.admin_email ?? u.admin_user_id?.slice(0, 8) + "...";
    if (!u.target_user_id) return "—";
    return u.target_name ?? u.target_email ?? u.target_user_id.slice(0, 8) + "...";
  };

  if (loading) return <p className="text-gray-500">Loading audit log...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Admin Audit Log</h2>
        <span className="text-sm text-gray-500">{total} entries</span>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target User</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No admin actions logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {resolveUser(log, "admin")}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {resolveUser(log, "target")}
                    </td>
                    <td className="px-4 py-3">
                      {log.details ? (
                        <pre className="max-w-xs truncate text-xs text-gray-500">
                          {JSON.stringify(log.details)}
                        </pre>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
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
{`create table admin_audit_log (
  id uuid default gen_random_uuid() primary key,
  admin_user_id uuid not null,
  action text not null,
  target_user_id uuid,
  details jsonb,
  created_at timestamp with time zone default now()
);`}
        </pre>
      </div>
    </div>
  );
}
