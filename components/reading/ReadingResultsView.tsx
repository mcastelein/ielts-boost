"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import type { ReadingPassage } from "@/lib/reading-passages";
import type { ScoredResults } from "@/lib/reading-scoring";
import PassageViewer from "@/components/reading/PassageViewer";

interface Props {
  passage: ReadingPassage;
  results: ScoredResults;
}

/**
 * Question-by-question review shared by the guest result page and the saved
 * submission detail page. When a question carries answer-location metadata
 * (`explanation`), an expandable panel shows where in the passage the answer
 * is found, with a bilingual paraphrase explanation and a "locate" action
 * that scrolls the passage to the highlighted sentence.
 */
export default function ReadingResultsView({ passage, results }: Props) {
  const { t, feedbackLocale } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPassage, setShowPassage] = useState(false);
  const [highlight, setHighlight] = useState<{ paragraph: string; quote: string | null } | null>(
    null
  );
  const passageRef = useRef<HTMLDivElement | null>(null);

  const locate = (paragraph: string, quote: string | null) => {
    setShowPassage(true);
    // Let the passage section render before PassageViewer scrolls to the paragraph
    requestAnimationFrame(() => {
      setHighlight({ paragraph, quote });
      passageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  let questionCounter = 0;

  return (
    <div>
      {/* Collapsible passage */}
      <div ref={passageRef} className="mt-8 scroll-mt-4">
        <button
          onClick={() => setShowPassage((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span>{showPassage ? t("reading_hide_passage") : t("reading_show_passage")}</span>
          <span className="text-gray-400">{showPassage ? "▲" : "▼"}</span>
        </button>
        {showPassage && (
          <div className="mt-2 max-h-[28rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
            <PassageViewer
              passageText={passage.passageText}
              highlightedParagraph={highlight?.paragraph ?? null}
              highlightQuote={highlight?.quote ?? null}
            />
          </div>
        )}
      </div>

      {/* Question-by-question results */}
      <div className="mt-6 space-y-6">
        {passage.questionGroups.map((group, gi) => (
          <div key={gi}>
            <div className="rounded-t-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium text-blue-800">{group.instruction}</p>
            </div>

            <div className="divide-y divide-gray-100 rounded-b-lg border border-t-0 border-gray-200 bg-white">
              {group.questions.map((q) => {
                questionCounter++;
                const result = results[q.id];
                if (!result) return null;
                const isExpanded = expandedId === q.id;
                const hasExplanation = !!q.explanation;

                return (
                  <div
                    key={q.id}
                    className={`p-4 ${result.correct ? "bg-green-50/30" : "bg-red-50/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          result.correct
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.correct ? "✓" : "✗"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="mr-1.5 font-semibold text-gray-500">
                            {questionCounter}.
                          </span>
                          {q.type === "matching_headings"
                            ? `Paragraph ${(q as { paragraphLabel: string }).paragraphLabel}`
                            : "text" in q
                            ? q.text
                            : ""}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-4 text-xs">
                          <span
                            className={`font-medium ${
                              result.correct ? "text-green-700" : "text-red-600"
                            }`}
                          >
                            {t("reading_your_answer")}:{" "}
                            <span className="font-mono">{result.user_answer || "—"}</span>
                          </span>
                          {!result.correct && (
                            <span className="font-medium text-gray-700">
                              {t("reading_correct_answer")}:{" "}
                              <span className="font-mono text-green-700">
                                {result.correct_answer}
                              </span>
                            </span>
                          )}
                        </div>

                        {hasExplanation ? (
                          <div className="mt-2">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : q.id)}
                              className="text-xs font-medium text-blue-600 hover:underline"
                            >
                              {isExpanded
                                ? t("reading_hide_explanation")
                                : t("reading_show_explanation")}
                            </button>

                            {isExpanded && q.explanation && (
                              <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded bg-blue-100 px-1.5 py-0.5 font-semibold text-blue-700">
                                    {t("reading_answer_location").replace(
                                      "{label}",
                                      q.explanation.paragraph
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      locate(q.explanation!.paragraph, q.explanation!.quote)
                                    }
                                    className="font-medium text-blue-600 hover:underline"
                                  >
                                    {t("reading_locate_in_passage")} →
                                  </button>
                                </div>
                                <blockquote className="mt-2 border-l-2 border-blue-300 pl-2 italic text-gray-600">
                                  “{q.explanation.quote}”
                                </blockquote>
                                <p className="mt-2 leading-relaxed text-gray-700">
                                  {feedbackLocale === "zh" ? q.explanation.zh : q.explanation.en}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          !result.correct &&
                          result.explanation && (
                            <p className="mt-2 text-xs italic text-gray-500">
                              {result.explanation}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
