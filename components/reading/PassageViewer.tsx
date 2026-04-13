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
}

export default function PassageViewer({
  passageText,
  highlightedParagraph,
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
  }, [highlightedParagraph]);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-gray-800">
      {paragraphs.map((para, i) => {
        const label = PARAGRAPH_LABELS[i] ?? `${i + 1}`;
        const borderColor = LABEL_COLORS[i % LABEL_COLORS.length];
        const isHighlighted = highlightedParagraph === label;

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
            <p>{para}</p>
          </div>
        );
      })}
    </div>
  );
}

export { PARAGRAPH_LABELS };
