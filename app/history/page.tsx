import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <p className="text-gray-500">Please sign in to see your history.</p>
      </div>
    );
  }

  const { data: submissions } = await supabase
    .from("writing_submissions")
    .select(
      "id, task_type, input_type, prompt_topic, time_used_seconds, created_at, writing_feedback(overall_band)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (submissions ?? []) as unknown as {
    id: string;
    task_type: string;
    input_type: string;
    prompt_topic: string | null;
    time_used_seconds: number | null;
    created_at: string;
    writing_feedback: { overall_band: number }[];
  }[];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Submission History</h1>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No submissions yet.{" "}
          <Link href="/writing" className="text-blue-600 hover:underline">
            Start writing
          </Link>
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((s) => {
            const band =
              s.writing_feedback?.length > 0
                ? s.writing_feedback[0].overall_band
                : null;
            return (
              <Link
                key={s.id}
                href={`/writing/${s.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      {s.task_type === "task1" ? "Task 1" : "Task 2"}
                    </span>
                    {s.prompt_topic && (
                      <span className="text-sm font-medium text-gray-900">
                        {s.prompt_topic}
                      </span>
                    )}
                  </div>
                  {band !== null && (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {band}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {new Date(s.created_at).toLocaleDateString()} at{" "}
                    {new Date(s.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {s.time_used_seconds !== null && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                      </svg>
                      {formatTime(s.time_used_seconds)}
                    </span>
                  )}
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                    {s.input_type}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
