"use client";

interface McqQuestionProps {
  questionNumber: number;
  text: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function McqQuestion({
  questionNumber,
  text,
  options,
  value,
  onChange,
  disabled = false,
}: McqQuestionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-800">
        <span className="mr-2 font-semibold text-gray-500">{questionNumber}.</span>
        {text}
      </p>
      <div className="mt-3 space-y-2">
        {options.map((opt) => {
          // Options are formatted like "A  Some text" — extract the letter
          const letter = opt.trimStart().charAt(0);
          const selected = value === letter;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onChange(letter)}
              className={`flex w-full items-start gap-3 rounded-md border px-4 py-2.5 text-left text-sm transition-colors ${
                selected
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              } ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  selected
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
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
