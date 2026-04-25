import { track } from "@vercel/analytics";
import type { LandingCta } from "@/components/landing/cta-buttons";

export function trackLandingCta(cta: LandingCta) {
  track("landing_cta_click", { cta });
}

export type { LandingCta };
