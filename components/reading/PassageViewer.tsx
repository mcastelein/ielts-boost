"use client";

import { useEffect, useRef } from "react";

const PARAGRAPH_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LABEL_COLORS = [
  "border-blue-400",
  "border-emerald-400",
  "border-violet-400",
  "border-amber-400",
  "border-rose-400",
  "border-cyan-400",
  "border-orange-400",
];

interface PassageViewerProps {
  passageText: string;
  highlightedParagraph: string | null; // paragraph label to scroll to, e.g. "B"
  highlightQuote?: string | null; // sentence to <mark> within the highlighted paragraph
}

/**
 * Build a whitespace/quote-tolerant regex for locating a verbatim quote in the
 * original paragraph text. Returns null when the quote can't form a valid regex.
 */
function buildQuoteRegex(quote: string): RegExp | null {
  const escaped = quote
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/['’‘]/g, "['’‘]")
    .replace(/["“”]/g, '["“”]')
    .replace(/\s+/g, "\\s+");
  if (!escaped) return null;
  try {
    return new RegExp(escaped, "i");
  } catch {
    return null;
  }
}

export default function PassageViewer({
  passageText,
  highlightedParagraph,
  highlightQuote,
}: PassageViewerProps) {
  const paragraphs = passageText.split(/\n\n+/).filter(Boolean);
  const paraRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightedParagraph && paraRefs.current[highlightedParagraph]) {
      paraRefs.current[highlightedParagraph]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [highlightedParagraph, highlightQuote]);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-gray-800">
      {paragraphs.map((para, i) => {
        const label = PARAGRAPH_LABELS[i] ?? `${i + 1}`;
        const borderColor = LABEL_COLORS[i % LABEL_COLORS.length];
        const isHighlighted = highlightedParagraph === label;

        let content: React.ReactNode = para;
        if (isHighlighted && highlightQuote) {
          const regex = buildQuoteRegex(highlightQuote);
          const match = regex ? para.match(regex) : null;
          if (match && match.index !== undefined) {
            content = (
              <>
                {para.slice(0, match.index)}
                <mark className="rounded bg-yellow-200 px-0.5">{match[0]}</mark>
                {para.slice(match.index + match[0].length)}
              </>
            );
          }
        }

        return (
          <div
            key={i}
            id={`para-${label}`}
            ref={(el) => {
              paraRefs.current[label] = el;
            }}
            className={`flex gap-3 rounded-r-md border-l-4 pl-3 transition-colors ${borderColor} ${
              isHighlighted ? "bg-yellow-50" : ""
            }`}
          >
            <span className="mt-0.5 shrink-0 text-xs font-bold text-gray-400">
              {label}
            </span>
            <p>{content}</p>
          </div>
        );
      })}
    </div>
  );
}

export { PARAGRAPH_LABELS };
