"use client";

import type { QuestionGroup as QuestionGroupType } from "@/lib/reading-passages";
import McqQuestion from "./McqQuestion";
import TfngQuestion from "./TfngQuestion";
import MatchingInfoQuestion from "./MatchingInfoQuestion";
import MatchingHeadingsQuestion from "./MatchingHeadingsQuestion";
import CompletionQuestion from "./CompletionQuestion";
import { useLanguage } from "@/lib/language-context";

interface QuestionGroupProps {
  group: QuestionGroupType;
  groupIndex: number;
  startingNumber: number;
  paragraphLabels: string[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  disabled?: boolean;
}

export default function QuestionGroupComponent({
  group,
  groupIndex,
  startingNumber,
  paragraphLabels,
  answers,
  onAnswer,
  disabled = false,
}: QuestionGroupProps) {
  const { t } = useLanguage();

  // Collect already-selected heading values for duplicate prevention
  const selectedHeadings = group.questions
    .filter((q) => q.type === "matching_headings")
    .map((q) => answers[q.id] ?? "")
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {/* Group instruction */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs font-medium text-blue-800">{group.instruction}</p>
      </div>

      {/* Shared options box (for matching_headings or summary word box) */}
      {group.sharedOptions && group.sharedOptions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          {group.questions[0]?.type === "summary_completion" ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("reading_word_box")}
            </p>
          ) : (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              List of Headings
            </p>
          )}
          <ul className="space-y-1">
            {group.sharedOptions.map((opt) => (
              <li key={opt} className="text-xs text-gray-700">
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions */}
      {group.questions.map((q, idx) => {
        const qNumber = startingNumber + idx;
        const value = answers[q.id] ?? "";

        switch (q.type) {
          case "mcq":
            return (
              <McqQuestion
                key={q.id}
                questionNumber={qNumber}
                text={q.text}
                options={q.options}
                value={value}
                onChange={(v) => onAnswer(q.id, v)}
                disabled={disabled}
              />
            );

          case "tfng":
          case "ynng":
            return (
              <TfngQuestion
                key={q.id}
                questionNumber={qNumber}
                text={q.text}
                type={q.type}
                value={value}
                onChange={(v) => onAnswer(q.id, v)}
                disabled={disabled}
              />
            );

          case "matching_headings":
            return (
              <MatchingHeadingsQuestion
                key={q.id}
                questionNumber={qNumber}
                paragraphLabel={q.paragraphLabel}
                headingOptions={group.sharedOptions ?? []}
                value={value}
                onChange={(v) => onAnswer(q.id, v)}
                usedValues={selectedHeadings.filter((h) => h !== value)}
                disabled={disabled}
              />
            );

          case "matching_info":
            return (
              <MatchingInfoQuestion
                key={q.id}
                questionNumber={qNumber}
                text={q.text}
                paragraphLabels={paragraphLabels}
                value={value}
                onChange={(v) => onAnswer(q.id, v)}
                disabled={disabled}
              />
            );

          case "sentence_completion":
            return (
              <CompletionQuestion
                key={q.id}
                questionNumber={qNumber}
                text={q.text}
                wordLimit={q.wordLimit}
                value={value}
                onChange={(v) => onAnswer(q.id, v)}
                disabled={disabled}
              />
            );

          case "summary_completion":
            return (
              <CompletionQuestion
                key={q.id}
                questionNumber={qNumber}
                text={q.text}
                wordLimit={q.wordLimit}
                wordBox={group.sharedOptions}
                value={value}
                onChange={(v) => onAnswer(q.id, v)}
                disabled={disabled}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
