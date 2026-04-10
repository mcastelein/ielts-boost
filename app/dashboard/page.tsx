import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface WritingSubmission {
  id: string;
  task_type: string;
  created_at: string;
  writing_feedback: {
    overall_band: number;
    task_score: number;
    coherence_score: number;
    lexical_score: number;
    grammar_score: number;
    feedback_json: {
      weaknesses?: string[];
    };
  }[];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-gray-500">Please sign in to see your dashboard.</p>
      </div>
    );
  }

  // Fetch recent submissions with feedback
  const { data: submissions } = await supabase
    .from("writing_submissions")
    .select(
      "id, task_type, created_at, writing_feedback(overall_band, task_score, coherence_score, lexical_score, grammar_score, feedback_json)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const typedSubmissions = (submissions ?? []) as unknown as WritingSubmission[];

  // Calculate stats
  const withFeedback = typedSubmissions.filter(
    (s) => s.writing_feedback?.length > 0
  );
  const totalSubmissions = typedSubmissions.length;

  const latestBand =
    withFeedback.length > 0
      ? withFeedback[0].writing_feedback[0].overall_band
      : null;

  const avgBand =
    withFeedback.length > 0
      ? (
          withFeedback.reduce(
            (sum, s) => sum + s.writing_feedback[0].overall_band,
            0
          ) / withFeedback.length
        ).toFixed(1)
      : null;

  // Collect common weaknesses
  const weaknessCounts: Record<string, number> = {};
  withFeedback.forEach((s) => {
    const weaknesses = s.writing_feedback[0].feedback_json?.weaknesses ?? [];
    weaknesses.forEach((w) => {
      // Normalize to lowercase for grouping
      const key = w.toLowerCase().slice(0, 60);
      weaknessCounts[key] = (weaknessCounts[key] || 0) + 1;
    });
  });
  const topWeaknesses = Object.entries(weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/writing"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          New Essay
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Submissions</p>
          <p className="mt-1 text-3xl font-bold">{totalSubmissions}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Latest Band</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {latestBand ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Average Band</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {avgBand ?? "—"}
          </p>
        </div>
      </div>

      {/* Common weaknesses */}
      {topWeaknesses.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold">Recurring Weaknesses</h2>
          <ul className="mt-3 space-y-2">
            {topWeaknesses.map(([weakness, count], i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700 capitalize">{weakness}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {count}x
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent submissions */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <h2 className="font-semibold">Recent Submissions</h2>
        </div>
        {typedSubmissions.length === 0 ? (
          <div className="p-5 text-center text-sm text-gray-500">
            No submissions yet.{" "}
            <Link href="/writing" className="text-blue-600 hover:underline">
              Start writing
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {typedSubmissions.map((s) => {
              const fb =
                s.writing_feedback?.length > 0
                  ? s.writing_feedback[0]
                  : null;
              return (
                <li key={s.id}>
                  <Link
                    href={`/writing/${s.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {s.task_type === "task1" ? "Task 1" : "Task 2"}
                      </span>
                      <span className="ml-3 text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {fb && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {fb.overall_band}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Score breakdown trend */}
      {withFeedback.length >= 2 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold">Score Trend (Last {withFeedback.length})</h2>
          <div className="mt-3 flex gap-4 overflow-x-auto text-xs">
            {withFeedback
              .slice()
              .reverse()
              .map((s, i) => {
                const fb = s.writing_feedback[0];
                return (
                  <div
                    key={i}
                    className="flex min-w-[80px] flex-col items-center rounded-lg bg-gray-50 p-3"
                  >
                    <span className="text-lg font-bold text-blue-600">
                      {fb.overall_band}
                    </span>
                    <span className="mt-1 text-gray-400">
                      {new Date(s.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
