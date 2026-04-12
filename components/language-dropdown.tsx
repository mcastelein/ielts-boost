"use client";

import { useState, useEffect, useRef } from "react";
import type { Locale } from "@/lib/translations";

export default function LanguageDropdown({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "zh", label: "中文" },
  ];

  const current = options.find((o) => o.value === locale)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
      >
        {current.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[80px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setLocale(opt.value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-gray-50 ${
                opt.value === locale
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
