"use client";

interface TfngQuestionProps {
  questionNumber: number;
  text: string;
  type: "tfng" | "ynng";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TfngQuestion({
  questionNumber,
  text,
  type,
  value,
  onChange,
  disabled = false,
}: TfngQuestionProps) {
  const options =
    type === "tfng"
      ? ["True", "False", "Not Given"]
      : ["Yes", "No", "Not Given"];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-800">
        <span className="mr-2 font-semibold text-gray-500">{questionNumber}.</span>
        {text}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                selected
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
