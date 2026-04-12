import Link from "next/link";
import MLVenturesLogo from "./ml-ventures-logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <Link href="/feedback" className="transition-colors hover:text-gray-600">
              Feedback &amp; Support
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gray-600">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-gray-600">
              Privacy Policy
            </Link>
            <Link href="/refund" className="transition-colors hover:text-gray-600">
              Refund Policy
            </Link>
          </div>
          <a
            href="https://mlventures.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            <span>
              Built by{" "}
              <span className="font-semibold text-gray-600">ML</span>{" "}
              <span className="font-semibold text-blue-500">Ventures</span>
            </span>
            <MLVenturesLogo size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}
