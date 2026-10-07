"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";

// Funnel events for PostHog. Names are snake_case past tense ("essay_submitted").
// Never pass essay text, answers, or other user content as properties.
export type AnalyticsEvent =
  | "signed_up"
  | "signup_submitted"
  | "signup_needs_confirmation"
  | "signup_failed"
  | "login_failed"
  | "onboarding_completed"
  | "onboarding_skipped"
  | "practice_started"
  | "file_uploaded"
  | "ocr_failed"
  | "submission_sent"
  | "submission_scored"
  | "submission_failed"
  | "limit_hit"
  | "feedback_viewed"
  | "upgrade_clicked";

export type Section = "writing" | "speaking" | "reading" | "listening";

export function track(event: AnalyticsEvent, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics must never break the page.
  }
}

// Fires an event once per mount, e.g. when a feedback page is opened.
export function useTrackOnce(event: AnalyticsEvent, props?: Record<string, unknown>) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
