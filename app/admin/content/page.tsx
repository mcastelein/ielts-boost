"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PassageGeneratorForm from "@/components/admin/PassageGeneratorForm";

interface PassageListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: number;
  topic_tags: string[];
  status: "draft" | "published";
  is_active: boolean;
  display_order: number;
  created_at: string;
  question_count: number;
  has_explanations: boolean;
  self_check_agreement: number | null;
}

export default function AdminContentPage() {
  const [passages, setPassages] = useState<PassageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchPassages = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/content/reading");
    if (res.ok) {
      const data = await res.json();
      setPassages(data.passages);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPassages();
  }, [fetchPassages]);

  const toggleActive = async (p: PassageListItem) => {
    setBusyId(p.id);
    const res = await fetch(`/api/admin/content/reading/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    if (res.ok) {
      setPassages((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, is_active: !p.is_active } : x))
      );
    }
    setBusyId(null);
  };

  const deleteDraft = async (p: PassageListItem) => {
    if (!confirm(`Delete draft "${p.title}"? This cannot be undone.`)) return;
    setBusyId(p.id);
    const res = await fetch(`/api/admin/content/reading/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      setPassages((prev) => prev.filter((x) => x.id !== p.id));
    }
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reading Passages</h2>
          <p className="text-sm text-gray-500">
            {passages.length} passages · {passages.filter((p) => p.status === "draft").length}{" "}
            drafts
          </p>
        </div>
        {!showGenerator && (
          <button
            onClick={() => setShowGenerator(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Generate new passage
          </button>
        )}
      </div>

      {showGenerator && <PassageGeneratorForm onClose={() => setShowGenerator(false)} />}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : passages.length === 0 ? (
        <p className="text-gray-400">No passages yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Explanations</th>
                <th className="px-4 py-3">Self-check</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passages.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/content/reading/${p.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {p.title}
                    </Link>
                    <div className="text-xs text-gray-400">
                      {p.slug} · {p.topic_tags.join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.difficulty}/3</td>
                  <td className="px-4 py-3 text-gray-700">{p.question_count}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      disabled={busyId === p.id || p.status !== "published"}
                      title={
                        p.status !== "published"
                          ? "Publish the passage first"
                          : p.is_active
                          ? "Hide from practice list"
                          : "Show in practice list"
                      }
                      className={`rounded px-2 py-0.5 text-xs font-medium disabled:opacity-40 ${
                        p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.is_active ? "active" : "inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {p.has_explanations ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {p.self_check_agreement === null ? (
                      <span className="text-gray-300">—</span>
                    ) : (
                      <span
                        className={
                          p.self_check_agreement < 0.9 ? "font-medium text-amber-600" : ""
                        }
                      >
                        {Math.round(p.self_check_agreement * 100)}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "draft" && (
                      <button
                        onClick={() => deleteDraft(p)}
                        disabled={busyId === p.id}
                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
