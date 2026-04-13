"use client";

import { useLanguage } from "@/lib/language-context";

interface CompletionQuestionProps {
  questionNumber: number;
  text: string; // sentence with ________ placeholder
  wordLimit: number;
  wordBox?: string[]; // for summary_completion with a word box
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CompletionQuestion({
  questionNumber,
  text,
  wordLimit,
  wordBox,
  value,
  onChange,
  disabled = false,
}: CompletionQuestionProps) {
  const { t } = useLanguage();

  // If it has a word box, render a select; otherwise a text input
  if (wordBox && wordBox.length > 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-800">
          <span className="mr-2 font-semibold text-gray-500">{questionNumber}.</span>
          {text}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {wordBox.map((opt) => {
            const letter = opt.trimStart().charAt(0);
            const selected = value === letter;
            return (
              <button
                key={opt}
                type="button"
                disabled={disabled}
                onClick={() => onChange(letter)}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                } ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
              >
                <span className={`font-bold ${selected ? "text-white" : "text-gray-500"}`}>
                  {letter}
                </span>
                <span>{opt.replace(/^[A-Z]\s+/, "")}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-800">
        <span className="mr-2 font-semibold text-gray-500">{questionNumber}.</span>
        {text}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="your answer"
          className={`rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            disabled ? "cursor-default bg-gray-50 opacity-60" : "bg-white"
          } ${value ? "border-blue-400" : ""}`}
        />
        <span className="text-xs text-gray-400">
          {t("reading_word_limit")} {wordLimit} {t("reading_words")}
        </span>
      </div>
    </div>
  );
}
