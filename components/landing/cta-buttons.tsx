"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackLandingCta } from "@/lib/landing-analytics";

export type LandingCta =
  | "hero-primary"
  | "hero-secondary"
  | "how-it-works"
  | "pricing-free"
  | "pricing-pro"
  | "final";

type Width = "inline" | "responsive" | "block";

interface CtaProps {
  href: string;
  ctaId: LandingCta;
  width?: Width;
  children: ReactNode;
}

const baseClass =
  "rounded-lg px-6 py-3 text-sm font-semibold text-center shadow-sm transition-colors";

const widthClass: Record<Width, string> = {
  inline: "",
  responsive: "w-full sm:w-auto",
  block: "block w-full",
};

function renderButton(
  href: string,
  ctaId: LandingCta,
  className: string,
  children: ReactNode,
) {
  const handleClick = () => trackLandingCta(ctaId);
  // In-page anchors (#bilingual) need a plain <a>; Next.js <Link> can interfere with anchor scrolling.
  if (href.startsWith("#")) {
    return (
      <a href={href} data-cta={ctaId} className={className} onClick={handleClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} data-cta={ctaId} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function PrimaryCtaButton({ href, ctaId, width = "inline", children }: CtaProps) {
  const className = `${baseClass} bg-blue-600 text-white hover:bg-blue-700 ${widthClass[width]}`.trim();
  return renderButton(href, ctaId, className, children);
}

export function SecondaryCtaButton({ href, ctaId, width = "inline", children }: CtaProps) {
  const className = `${baseClass} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${widthClass[width]}`.trim();
  return renderButton(href, ctaId, className, children);
}
