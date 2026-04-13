"use client";

interface MatchingHeadingsQuestionProps {
  questionNumber: number;
  paragraphLabel: string;
  headingOptions: string[]; // e.g. ["i  The first system...", "ii  How scripts..."]
  value: string;
  onChange: (value: string) => void;
  usedValues: string[]; // values already selected for other paragraphs
  disabled?: boolean;
}

export default function MatchingHeadingsQuestion({
  questionNumber,
  paragraphLabel,
  headingOptions,
  value,
  onChange,
  usedValues,
  disabled = false,
}: MatchingHeadingsQuestionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">
        {questionNumber}. Paragraph {paragraphLabel}
      </p>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          disabled ? "cursor-default opacity-60" : "cursor-pointer"
        } ${value ? "border-blue-400 bg-blue-50" : ""}`}
      >
        <option value="">— Select a heading —</option>
        {headingOptions.map((opt) => {
          // Heading format: "i    Heading text" — extract the Roman numeral
          const parts = opt.trim().split(/\s{2,}/);
          const numeral = parts[0].toLowerCase();
          const label = parts.slice(1).join(" ");
          const isUsedElsewhere = usedValues.includes(numeral) && numeral !== value;
          return (
            <option
              key={numeral}
              value={numeral}
              disabled={isUsedElsewhere}
              className={isUsedElsewhere ? "text-gray-400" : ""}
            >
              {parts[0]}{"  "}{label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
