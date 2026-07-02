"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PassageViewer from "@/components/reading/PassageViewer";
import type { QuestionGroup } from "@/lib/reading-passages";

interface PassageRow {
  id: string;
  slug: string;
  title: string;
  difficulty: number;
  topic_tags: string[];
  passage_text: string;
  question_groups: QuestionGroup[];
  status: "draft" | "published";
  is_active: boolean;
  display_order: number;
  generation_metadata: {
    model?: string;
    selfCheck?: {
      agreementRate: number;
      total: number;
      mismatches: { id: string; keyAnswer: string; modelAnswer: string }[];
    } | null;
  } | null;
}

export default function AdminReadingEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [row, setRow] = useState<PassageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(2);
  const [tags, setTags] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [passageText, setPassageText] = useState("");
  const [groupsJson, setGroupsJson] = useState("");
  const [showJson, setShowJson] = useState(false);

  const fetchPassage = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/content/reading/${id}`);
    if (res.ok) {
      const data = await res.json();
      const p: PassageRow = data.passage;
      setRow(p);
      setTitle(p.title);
      setDifficulty(p.difficulty);
      setTags(p.topic_tags.join(", "));
      setDisplayOrder(p.display_order);
      setPassageText(p.passage_text);
      setGroupsJson(JSON.stringify(p.question_groups, null, 2));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchPassage();
  }, [fetchPassage]);

  const parsedGroups = useMemo<QuestionGroup[] | null>(() => {
    try {
      return JSON.parse(groupsJson);
    } catch {
      return null;
    }
  }, [groupsJson]);

  const save = async (extra: Record<string, unknown> = {}) => {
    if (!parsedGroups) {
      setErrors(["Question groups JSON is not valid JSON."]);
      return false;
    }
    setSaving(true);
    setErrors([]);
    setNotice(null);

    const res = await fetch(`/api/admin/content/reading/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        difficulty,
        topic_tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        display_order: displayOrder,
        passage_text: passageText,
        question_groups: parsedGroups,
        ...extra,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setErrors(Array.isArray(data.errors) ? data.errors : [data.error ?? "Save failed"]);
      return false;
    }
    setRow(data.passage);
    setNotice("Saved.");
    return true;
  };

  const publish = async () => {
    if (await save({ status: "published", is_active: true })) {
      setNotice("Published — the passage is now live in the practice list.");
    }
  };

  const discard = async () => {
    if (!confirm("Delete this draft permanently?")) return;
    const res = await fetch(`/api/admin/content/reading/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/content");
    } else {
      const data = await res.json();
      setErrors([data.error ?? "Delete failed"]);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!row) return <p className="text-gray-400">Passage not found.</p>;

  const selfCheck = row.generation_metadata?.selfCheck;
  let questionNumber = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/content" className="text-xs text-gray-400 hover:text-gray-600">
            ← Content
          </Link>
          <h2 className="text-lg font-semibold text-gray-900">{row.title}</h2>
          <p className="text-xs text-gray-400">
            {row.slug} ·{" "}
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${
                row.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {row.status}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => save()}
            disabled={saving}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {row.status === "draft" && (
            <>
              <button
                onClick={publish}
                disabled={saving}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Publish
              </button>
              <button
                onClick={discard}
                disabled={saving}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Discard
              </button>
            </>
          )}
        </div>
      </div>

      {notice && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {notice}
        </div>
      )}
      {errors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <p className="font-medium">Validation failed:</p>
          <ul className="mt-1 list-inside list-disc text-xs">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Self-check panel */}
      {selfCheck && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            selfCheck.mismatches.length === 0
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p className="font-medium">
            Self-check: {Math.round(selfCheck.agreementRate * 100)}% agreement (
            {selfCheck.total - selfCheck.mismatches.length}/{selfCheck.total})
          </p>
          {selfCheck.mismatches.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-xs">
              {selfCheck.mismatches.map((m) => (
                <li key={m.id}>
                  <span className="font-mono">{m.id}</span>: key says{" "}
                  <span className="font-mono">{m.keyAnswer}</span>, checker answered{" "}
                  <span className="font-mono">{m.modelAnswer || "(blank)"}</span> — review this
                  question before publishing
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            spellCheck={false}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">Display order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-4">
          <label className="block text-xs font-medium text-gray-600">
            Topic tags (comma-separated)
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            spellCheck={false}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Passage editor + preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-600">
            Passage text (paragraphs separated by a blank line)
          </label>
          <textarea
            value={passageText}
            onChange={(e) => setPassageText(e.target.value)}
            spellCheck={false}
            rows={24}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs leading-relaxed"
          />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">Preview (labels as users see them)</p>
          <div className="mt-1 max-h-[36rem] overflow-y-auto rounded-md border border-gray-200 bg-white p-4">
            <PassageViewer passageText={passageText} highlightedParagraph={null} />
          </div>
        </div>
      </div>

      {/* Questions preview */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Questions ({parsedGroups?.reduce((s, g) => s + g.questions.length, 0) ?? "—"})
          </h3>
          <button
            onClick={() => setShowJson((v) => !v)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showJson ? "Show preview" : "Edit raw JSON"}
          </button>
        </div>

        {showJson ? (
          <textarea
            value={groupsJson}
            onChange={(e) => setGroupsJson(e.target.value)}
            spellCheck={false}
            rows={30}
            className={`mt-2 w-full rounded-md border px-3 py-2 font-mono text-xs leading-relaxed ${
              parsedGroups ? "border-gray-300" : "border-red-400 bg-red-50"
            }`}
          />
        ) : parsedGroups ? (
          <div className="mt-2 space-y-4">
            {parsedGroups.map((group, gi) => (
              <div key={gi} className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-800">
                  {group.instruction}
                </div>
                {group.sharedOptions && (
                  <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">
                    {group.sharedOptions.map((o, i) => (
                      <div key={i}>{o}</div>
                    ))}
                  </div>
                )}
                <div className="divide-y divide-gray-50">
                  {group.questions.map((q) => {
                    questionNumber++;
                    return (
                      <div key={q.id} className="px-4 py-3 text-sm">
                        <p className="text-gray-800">
                          <span className="mr-1.5 font-semibold text-gray-400">
                            {questionNumber}.
                          </span>
                          {q.type === "matching_headings"
                            ? `Paragraph ${(q as { paragraphLabel: string }).paragraphLabel}`
                            : "text" in q
                            ? q.text
                            : ""}
                          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                            {q.type}
                          </span>
                        </p>
                        {"options" in q && q.options && (
                          <ul className="mt-1 text-xs text-gray-500">
                            {q.options.map((o, i) => (
                              <li key={i}>{o}</li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-1 text-xs">
                          <span className="font-medium text-green-700">
                            Answer: <span className="font-mono">{q.answer}</span>
                          </span>
                        </p>
                        {q.explanation ? (
                          <div className="mt-2 rounded-md bg-gray-50 p-2 text-xs text-gray-600">
                            <p>
                              <span className="font-semibold">¶ {q.explanation.paragraph}</span>{" "}
                              — <span className="italic">“{q.explanation.quote}”</span>
                            </p>
                            <p className="mt-1">{q.explanation.en}</p>
                            <p className="mt-1">{q.explanation.zh}</p>
                          </div>
                        ) : (
                          <p className="mt-1 text-xs text-amber-600">No explanation</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-red-600">Invalid JSON — fix it in the raw editor.</p>
        )}
      </div>
    </div>
  );
}
