import MLVenturesLogo from "./ml-ventures-logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-100">
      <div className="mx-auto flex max-w-5xl items-center justify-end px-4 py-3">
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
    </footer>
  );
}
