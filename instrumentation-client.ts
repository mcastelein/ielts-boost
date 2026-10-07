import posthog from "posthog-js";

// PostHog product analytics: autocaptured clicks, pageviews, and session
// replays. Traffic goes through our own domain (/ingest, see next.config.ts)
// so it keeps working for users in China and isn't dropped by ad blockers.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-08-30",
      person_profiles: "identified_only",
      session_recording: {
        // Essays and speaking answers are typed into inputs; never record them.
        maskAllInputs: true,
      },
    });
  } catch {
    // Analytics must never break the page.
  }
}
