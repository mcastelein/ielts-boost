"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const QUESTION_TYPE_OPTIONS = [
  { value: "mcq", label: "Multiple choice" },
  { value: "tfng", label: "True / False / Not Given" },
  { value: "ynng", label: "Yes / No / Not Given" },
  { value: "matching_headings", label: "Matching headings" },
  { value: "matching_info", label: "Matching information" },
  { value: "sentence_completion", label: "Sentence completion" },
  { value: "summary_completion", label: "Summary completion (word box)" },
];

export default function PassageGeneratorForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(2);
  const [questionCount, setQuestionCount] = useState(12);
  const [types, setTypes] = useState<string[]>(["mcq", "tfng"]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const toggleType = (value: string) => {
    setTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const generate = async () => {
    setGenerating(true);
    setError(null);
    setValidationErrors([]);

    try {
      const res = await fetch("/api/admin/content/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          questionTypes: types,
          questionCount,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        if (Array.isArray(data.errors)) setValidationErrors(data.errors);
        return;
      }
      router.push(`/admin/content/reading/${data.passage.id}`);
    } catch {
      setError("Network error — generation may still be running. Refresh the list in a minute.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Generate new passage</h3>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The history of cartography"
            spellCheck={false}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value={1}>1 — Band 5–6</option>
            <option value={2}>2 — Band 6–7</option>
            <option value={3}>3 — Band 7–9</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600">Question count</label>
          <input
            type="number"
            min={6}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600">Question types</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleType(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  types.includes(opt.value)
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
          {validationErrors.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-xs">
              {validationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={generate}
          disabled={generating || !topic.trim() || types.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate"}
        </button>
        {generating && (
          <span className="text-xs text-gray-500">
            Writing passage, questions, and bilingual explanations — this takes 1–3 minutes…
          </span>
        )}
      </div>
    </div>
  );
}
