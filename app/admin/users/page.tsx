"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { downloadCsv } from "@/lib/csv-export";

interface UserRecord {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  ui_language: string;
  feedback_language: string;
  plan_type: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string | null;
  stats: {
    writing: number;
    speaking: number;
    reading: number;
    listening: number;
    totalCost: number;
    daysActive7d: number;
  };
}

type SortKey =
  | "name"
  | "role"
  | "plan"
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "active7d"
  | "lastSeen"
  | "provider"
  | "cost"
  | "joined";
type SortDir = "asc" | "desc";

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastSeen");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const perPage = 20;
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users ?? []);
    }
    setLoading(false);
  };

  const updateUser = async (userId: string, field: string, value: string) => {
    setUpdating(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, updates: { [field]: value } }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, [field]: value } : u
        )
      );
    }
    setUpdating(null);
  };

  // Filter, sort, paginate
  const filtered = useMemo(() => {
    let result = users;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          (u.email ?? "").toLowerCase().includes(q) ||
          (u.display_name ?? "").toLowerCase().includes(q) ||
          u.user_id.toLowerCase().includes(q)
      );
    }

    if (roleFilter) result = result.filter((u) => (u.role ?? "user") === roleFilter);
    if (planFilter) result = result.filter((u) => (u.plan_type ?? "free") === planFilter);

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = (a.display_name ?? a.email ?? "").localeCompare(b.display_name ?? b.email ?? "");
          break;
        case "role":
          cmp = (a.role ?? "user").localeCompare(b.role ?? "user");
          break;
        case "plan":
          cmp = (a.plan_type ?? "free").localeCompare(b.plan_type ?? "free");
          break;
        case "writing":
          cmp = a.stats.writing - b.stats.writing;
          break;
        case "speaking":
          cmp = a.stats.speaking - b.stats.speaking;
          break;
        case "reading":
          cmp = a.stats.reading - b.stats.reading;
          break;
        case "listening":
          cmp = a.stats.listening - b.stats.listening;
          break;
        case "active7d":
          cmp = a.stats.daysActive7d - b.stats.daysActive7d;
          break;
        case "lastSeen": {
          const av = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
          const bv = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
          cmp = av - bv;
          break;
        }
        case "provider":
          cmp = (a.provider ?? "").localeCompare(b.provider ?? "");
          break;
        case "cost":
          cmp = a.stats.totalCost - b.stats.totalCost;
          break;
        case "joined":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [users, search, roleFilter, planFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelect = (userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((u) => u.user_id)));
    }
  };

  const bulkUpdatePlan = async (plan: string) => {
    setBulkUpdating(true);
    const promises = [...selectedIds].map((uid) =>
      fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, updates: { plan_type: plan } }),
      })
    );
    await Promise.all(promises);
    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.has(u.user_id) ? { ...u, plan_type: plan } : u
      )
    );
    setSelectedIds(new Set());
    setBulkUpdating(false);
  };

  const exportSelected = () => {
    const selected = filtered.filter((u) => selectedIds.has(u.user_id));
    downloadCsv(
      "selected-users.csv",
      [
        "Email",
        "Name",
        "Role",
        "Plan",
        "Writing",
        "Speaking",
        "Reading",
        "Listening",
        "Active 7d",
        "Last seen",
        "Provider",
        "API Cost",
        "Joined",
        "User ID",
      ],
      selected.map((u) => [
        u.email ?? "",
        u.display_name ?? "",
        u.role ?? "user",
        u.plan_type ?? "free",
        String(u.stats.writing),
        String(u.stats.speaking),
        String(u.stats.reading),
        String(u.stats.listening),
        String(u.stats.daysActive7d),
        u.last_sign_in_at ?? "",
        u.provider ?? "",
        u.stats.totalCost.toFixed(4),
        new Date(u.created_at).toISOString().split("T")[0],
        u.user_id,
      ])
    );
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const SortHeader = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <th
      className="cursor-pointer px-4 py-3 select-none hover:text-gray-700"
      onClick={() => toggleSort(sortKeyVal)}
    >
      {label} {sortKey === sortKeyVal ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;

  const formatRelative = (iso: string | null): string => {
    if (!iso) return "—";
    const ms = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const PROVIDER_LABELS: Record<string, string> = {
    google: "Google",
    email: "Email",
    wechat: "WeChat",
    apple: "Apple",
    github: "GitHub",
    linkedin: "LinkedIn",
  };
  const providerLabel = (p: string | null): string => {
    if (!p) return "—";
    return PROVIDER_LABELS[p] ?? p.charAt(0).toUpperCase() + p.slice(1);
  };

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <input
          type="text"
          placeholder="Search email or name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <span className="text-sm text-gray-500">{filtered.length} users</span>
        <button
          onClick={() => {
            downloadCsv(
              "users-export.csv",
              [
                "Email",
                "Name",
                "Role",
                "Plan",
                "Writing",
                "Speaking",
                "Reading",
                "Listening",
                "Active 7d",
                "Last seen",
                "Provider",
                "API Cost",
                "UI Lang",
                "FB Lang",
                "Joined",
                "User ID",
              ],
              filtered.map((u) => [
                u.email ?? "",
                u.display_name ?? "",
                u.role ?? "user",
                u.plan_type ?? "free",
                String(u.stats.writing),
                String(u.stats.speaking),
                String(u.stats.reading),
                String(u.stats.listening),
                String(u.stats.daysActive7d),
                u.last_sign_in_at ?? "",
                u.provider ?? "",
                u.stats.totalCost.toFixed(4),
                u.ui_language,
                u.feedback_language,
                new Date(u.created_at).toISOString().split("T")[0],
                u.user_id,
              ])
            );
          }}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm">
          <span className="font-medium text-blue-700">{selectedIds.size} selected</span>
          <button
            onClick={() => bulkUpdatePlan("pro")}
            disabled={bulkUpdating}
            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Set Pro
          </button>
          <button
            onClick={() => bulkUpdatePlan("free")}
            disabled={bulkUpdating}
            className="rounded bg-gray-600 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Set Free
          </button>
          <button
            onClick={exportSelected}
            className="rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            Export Selected
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.size === paginated.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <SortHeader label="User" sortKeyVal="name" />
                <SortHeader label="Role" sortKeyVal="role" />
                <SortHeader label="Plan" sortKeyVal="plan" />
                <SortHeader label="Writing" sortKeyVal="writing" />
                <SortHeader label="Speaking" sortKeyVal="speaking" />
                <SortHeader label="Reading" sortKeyVal="reading" />
                <SortHeader label="Listening" sortKeyVal="listening" />
                <SortHeader label="Active 7d" sortKeyVal="active7d" />
                <SortHeader label="Last seen" sortKeyVal="lastSeen" />
                <SortHeader label="Provider" sortKeyVal="provider" />
                <SortHeader label="API Cost" sortKeyVal="cost" />
                <th className="px-4 py-3">Languages</th>
                <SortHeader label="Joined" sortKeyVal="joined" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id} className="border-b border-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.user_id)}
                      onChange={() => toggleSelect(user.user_id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td
                    className="cursor-pointer px-4 py-3 hover:bg-gray-50"
                    onClick={() => router.push(`/admin/users/${user.user_id}`)}
                  >
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {user.display_name ?? user.email ?? "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.email ?? user.user_id.slice(0, 12) + "..."}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role ?? "user"}
                      onChange={(e) => updateUser(user.user_id, "role", e.target.value)}
                      disabled={updating === user.user_id}
                      className={`rounded border border-gray-300 px-2 py-1 text-xs ${
                        (user.role ?? "user") === "admin"
                          ? "bg-blue-50 font-medium text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.plan_type ?? "free"}
                      onChange={(e) => updateUser(user.user_id, "plan_type", e.target.value)}
                      disabled={updating === user.user_id}
                      className={`rounded border border-gray-300 px-2 py-1 text-xs ${
                        user.plan_type === "pro"
                          ? "bg-green-50 font-medium text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.stats.writing}</td>
                  <td className="px-4 py-3 text-gray-600">{user.stats.speaking}</td>
                  <td className="px-4 py-3 text-gray-600">{user.stats.reading}</td>
                  <td className="px-4 py-3 text-gray-600">{user.stats.listening}</td>
                  <td className="px-4 py-3 text-gray-600">{user.stats.daysActive7d}/7</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {formatRelative(user.last_sign_in_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {providerLabel(user.provider)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatCost(user.stats.totalCost)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    UI: {user.ui_language} / FB: {user.feedback_language}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
    </div>
  );
}
