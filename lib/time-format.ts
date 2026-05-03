// Cap displayed elapsed times — anything over 2 hours likely means the user
// walked away from a session, not that they actually worked that long.
const MAX_REASONABLE_SECONDS = 2 * 60 * 60;

export function formatElapsed(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  if (seconds > MAX_REASONABLE_SECONDS) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Treat naive ISO strings (no timezone) as UTC. writing/speaking tables use
// `timestamp` while reading/listening use `timestamptz`; without this, JS
// parses naive strings as local time and cross-section sort breaks.
export function parseTimestamp(s: string): Date {
  const hasTz = /(?:Z|[+-]\d{2}:?\d{2})$/.test(s);
  return new Date(hasTz ? s : s + "Z");
}
