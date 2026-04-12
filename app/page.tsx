import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          IELTS<span className="text-blue-600">Boost</span>
        </h1>
        <p className="mt-4 text-base text-gray-600 sm:text-lg">
          Get instant AI feedback on your IELTS writing and speaking.
          Upload handwritten essays, type directly, or paste your work.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/writing"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
          >
            Start Writing Practice
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
