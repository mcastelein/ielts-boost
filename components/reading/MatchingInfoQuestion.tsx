"use client";

interface MatchingInfoQuestionProps {
  questionNumber: number;
  text: string;
  paragraphLabels: string[]; // e.g. ["A","B","C","D","E","F"]
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function MatchingInfoQuestion({
  questionNumber,
  text,
  paragraphLabels,
  value,
  onChange,
  disabled = false,
}: MatchingInfoQuestionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-800">
        <span className="mr-2 font-semibold text-gray-500">{questionNumber}.</span>
        {text}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {paragraphLabels.map((label) => {
          const selected = value === label;
          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={() => onChange(label)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                selected
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
