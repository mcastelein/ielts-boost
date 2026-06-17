"use client";

import type { ReactNode } from "react";

type Accent = "blue" | "purple";

const SELECTED: Record<Accent, string> = {
  blue: "border-blue-500 bg-blue-50",
  purple: "border-purple-500 bg-purple-50",
};

const HOVER: Record<Accent, string> = {
  blue: "hover:border-blue-200 hover:bg-blue-50/30",
  purple: "hover:border-purple-200 hover:bg-purple-50/30",
};

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  accent?: Accent;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Shared selectable "block" used on the practice setup pages
 * (reading passages, listening tracks, writing prompts, speaking topics).
 * Renders the bordered card shell + selected/hover states; callers compose
 * the inner content (title, badges, preview, etc.).
 */
export default function SelectableCard({
  selected,
  onClick,
  accent = "blue",
  disabled = false,
  className = "",
  children,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border-2 p-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
        selected ? SELECTED[accent] : `border-gray-200 bg-white ${HOVER[accent]}`
      } ${className}`}
    >
      {children}
    </button>
  );
}
