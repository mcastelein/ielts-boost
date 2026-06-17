const VISITOR_KEY = "ib_vid";
const SESSION_KEY = "ib_sid";
const LAST_ACTIVITY_KEY = "ib_last_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    // First-party cookie so the server can read the id on milestone events.
    document.cookie = `${VISITOR_KEY}=${id}; path=/; max-age=63072000; SameSite=Lax`;
  }
  return id;
}

function getSessionId(): string {
  const now = Date.now();
  const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) ?? 0);
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid || now - last > SESSION_TIMEOUT_MS) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  return sid;
}

interface SendInput {
  eventType: "pageview" | "event";
  name?: string;
  path?: string;
  props?: Record<string, unknown>;
}

export function sendAnalytics(input: SendInput): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      eventType: input.eventType,
      name: input.name ?? null,
      path: input.path ?? window.location.pathname,
      referrer: document.referrer || null,
      props: input.props ?? null,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", payload);
    } else {
      void fetch("/api/analytics", { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    // Analytics must never break the page.
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  sendAnalytics({ eventType: "event", name, props });
}
