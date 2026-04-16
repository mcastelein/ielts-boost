"use client";

import { useEffect, useState } from "react";

interface WritingSub {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  task_type: string;
  prompt_topic: string | null;
  input_type: string;
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
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  prompt: string;
  response_text: string;
  created_at: string;
  speaking_feedback: {
    estimated_band: number | null;
    feedback_json: Record<string, unknown>;
  }[];
}

interface ReadingSub {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  passage_title: string;
  passage_slug: string;
  answers_json: Record<string, string>;
  time_used_seconds: number | null;
  created_at: string;
  reading_feedback: {
    band_score: number | null;
    raw_score: number;
    total_questions: number;
    question_results: Record<string, unknown>;
  }[];
}

type SubType = "writing" | "speaking" | "reading" | "listening";

const TABS: { value: SubType; label: string }[] = [
  { value: "writing", label: "Writing" },
  { value: "speaking", label: "Speaking" },
  { value: "reading", label: "Reading" },
  { value: "listening", label: "Listening" },
];

export default function SubmissionsPage() {
  const [type, setType] = useState<SubType>("writing");
  const [taskTypeFilter, setTaskTypeFilter] = useState("");
  const [writingSubs, setWritingSubs] = useState<WritingSub[]>([]);
  const [speakingSubs, setSpeakingSubs] = useState<SpeakingSub[]>([]);
  const [readingSubs, setReadingSubs] = useState<ReadingSub[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const perPage = 20;

  useEffect(() => {
    if (type === "listening") {
      setLoading(false);
      setTotal(0);
      return;
    }
    fetchData();
  }, [type, page, taskTypeFilter]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({ type, page: page.toString() });
    if (taskTypeFilter && type === "writing") params.set("task_type", taskTypeFilter);

    const res = await fetch(`/api/admin/submissions?${params}`);
    if (res.ok) {
      const data = await res.json();
      if (type === "writing") {
        setWritingSubs(data.submissions);
      } else if (type === "speaking") {
        setSpeakingSubs(data.submissions);
      } else if (type === "reading") {
        setReadingSubs(data.submissions);
      }
      setTotal(data.total);
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(total / perPage);
  const resolveUser = (sub: { user_name: string | null; user_email: string | null; user_id: string }) =>
    sub.user_name ?? sub.user_email ?? sub.user_id.slice(0, 8) + "...";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Submissions</h2>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setType(tab.value); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                type === tab.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {type === "writing" && (
          <select
            value={taskTypeFilter}
            onChange={(e) => { setTaskTypeFilter(e.target.value); setPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">All tasks</option>
            <option value="task1">Task 1</option>
            <option value="task2">Task 2</option>
          </select>
        )}
        {type !== "listening" && (
          <span className="text-sm text-gray-500">{total} total</span>
        )}
      </div>

      {/* Listening placeholder */}
      {type === "listening" && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <p className="text-sm text-gray-500">Listening module coming soon.</p>
        </div>
      )}

      {type !== "listening" && loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : type !== "listening" && (
        <>
          {/* Writing submissions */}
          {type === "writing" && (
            <div className="space-y-3">
              {writingSubs.length === 0 ? (
                <p className="text-gray-400">No submissions found.</p>
              ) : (
                writingSubs.map((sub) => {
                  const fb = sub.writing_feedback?.[0];
                  const isExpanded = expandedId === sub.id;
                  return (
                    <div key={sub.id} className="rounded-lg border border-gray-200 bg-white">
                      <div
                        className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                        onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {sub.task_type === "task1" ? "Task 1" : "Task 2"}
                          </span>
                          {fb && (
                            <span className="text-sm font-bold text-gray-900">
                              Band {fb.overall_band}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">{resolveUser(sub)}</span>
                          {sub.prompt_topic && (
                            <span className="text-xs text-gray-400">{sub.prompt_topic}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(sub.created_at).toLocaleString()}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 py-4">
                          {fb && (
                            <div className="mb-3 flex gap-4 text-sm text-gray-500">
                              <span>Task: {fb.task_score}</span>
                              <span>Coherence: {fb.coherence_score}</span>
                              <span>Lexical: {fb.lexical_score}</span>
                              <span>Grammar: {fb.grammar_score}</span>
                              <span className="text-xs text-gray-400">Input: {sub.input_type}</span>
                            </div>
                          )}
                          <div className="mb-4 rounded bg-gray-50 p-3">
                            <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">Essay</h4>
                            <p className="whitespace-pre-wrap text-sm text-gray-700">{sub.final_text}</p>
                          </div>
                          {fb?.feedback_json && (
                            <div>
                              <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">AI Feedback</h4>
                              <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                                {JSON.stringify(fb.feedback_json, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Speaking submissions */}
          {type === "speaking" && (
            <div className="space-y-3">
              {speakingSubs.length === 0 ? (
                <p className="text-gray-400">No submissions found.</p>
              ) : (
                speakingSubs.map((sub) => {
                  const fb = sub.speaking_feedback?.[0];
                  const isExpanded = expandedId === sub.id;
                  return (
                    <div key={sub.id} className="rounded-lg border border-gray-200 bg-white">
                      <div
                        className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                        onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      >
                        <div className="flex items-center gap-3">
                          {fb?.estimated_band && (
                            <span className="text-sm font-bold text-gray-900">
                              Band {fb.estimated_band}
                            </span>
                          )}
                          <span className="text-sm text-gray-600">{resolveUser(sub)}</span>
                          <span className="max-w-md truncate text-xs text-gray-400">{sub.prompt}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(sub.created_at).toLocaleString()}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 py-4">
                          <div className="mb-4">
                            <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">Question</h4>
                            <p className="text-sm text-gray-700">{sub.prompt}</p>
                          </div>
                          <div className="mb-4 rounded bg-gray-50 p-3">
                            <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">Response</h4>
                            <p className="whitespace-pre-wrap text-sm text-gray-700">{sub.response_text}</p>
                          </div>
                          {fb?.feedback_json && (
                            <div>
                              <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">AI Feedback</h4>
                              <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                                {JSON.stringify(fb.feedback_json, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Reading submissions */}
          {type === "reading" && (
            <div className="space-y-3">
              {readingSubs.length === 0 ? (
                <p className="text-gray-400">No submissions found.</p>
              ) : (
                readingSubs.map((sub) => {
                  const fb = sub.reading_feedback?.[0];
                  const isExpanded = expandedId === sub.id;
                  return (
                    <div key={sub.id} className="rounded-lg border border-gray-200 bg-white">
                      <div
                        className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                        onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                            {sub.passage_title}
                          </span>
                          {fb && (
                            <span className="text-sm font-bold text-gray-900">
                              Band {fb.band_score}
                            </span>
                          )}
                          {fb && (
                            <span className="text-xs text-gray-500">
                              {fb.raw_score}/{fb.total_questions} correct
                            </span>
                          )}
                          <span className="text-sm text-gray-600">{resolveUser(sub)}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(sub.created_at).toLocaleString()}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 py-4">
                          {sub.time_used_seconds != null && (
                            <p className="mb-3 text-sm text-gray-500">
                              Time: {Math.floor(sub.time_used_seconds / 60)}m {sub.time_used_seconds % 60}s
                            </p>
                          )}
                          <div className="mb-4 rounded bg-gray-50 p-3">
                            <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">Answers</h4>
                            <pre className="max-h-40 overflow-auto text-xs text-gray-700">
                              {JSON.stringify(sub.answers_json, null, 2)}
                            </pre>
                          </div>
                          {fb?.question_results && (
                            <div>
                              <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">Question Results</h4>
                              <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-3 text-xs text-gray-700">
                                {JSON.stringify(fb.question_results, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

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
        </>
      )}
    </div>
  );
}
