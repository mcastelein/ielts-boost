"use client";

import { useEffect, useState } from "react";

interface UserRecord {
  id: string;
  user_id: string;
  ui_language: string;
  feedback_language: string;
  plan_type: string;
  role: string;
  created_at: string;
  stats: {
    writing: number;
    speaking: number;
    totalCost: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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

  const formatCost = (cost: number) => `$${cost.toFixed(4)}`;

  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        <p className="text-sm text-gray-500">{users.length} users</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Writing</th>
                <th className="px-4 py-3">Speaking</th>
                <th className="px-4 py-3">API Cost</th>
                <th className="px-4 py-3">Languages</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {user.user_id.slice(0, 12)}...
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
    </div>
  );
}
