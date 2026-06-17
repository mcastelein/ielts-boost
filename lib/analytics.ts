import { createAdminClient } from "@/lib/supabase/admin";

export type AnalyticsEventType = "pageview" | "milestone" | "event";

export interface AnalyticsEventInput {
  visitorId: string;
  userId?: string | null;
  eventType: AnalyticsEventType;
  name?: string | null;
  path?: string | null;
  referrer?: string | null;
  country?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
  props?: Record<string, unknown> | null;
}

// Heuristic bot filter applied at ingestion.
export const BOT_UA_REGEX =
  /bot|crawler|spider|crawling|headless|preview|monitor|slurp|curl|wget|python-requests/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_UA_REGEX.test(userAgent);
}

// Insert one raw event and update the visitor rollup. Fire-and-forget:
// never throws to the caller.
export async function logAnalyticsEvent(input: AnalyticsEventInput): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  try {
    await admin.from("analytics_events").insert({
      visitor_id: input.visitorId,
      user_id: input.userId ?? null,
      event_type: input.eventType,
      name: input.name ?? null,
      path: input.path ?? null,
      referrer: input.referrer ?? null,
      country: input.country ?? null,
      user_agent: input.userAgent ?? null,
      session_id: input.sessionId ?? null,
      props: input.props ?? null,
    });

    await admin.rpc("record_visitor", {
      p_visitor_id: input.visitorId,
      p_user_id: input.userId ?? null,
      p_referrer: input.referrer ?? null,
      p_path: input.path ?? null,
      p_country: input.country ?? null,
    });
  } catch (error) {
    console.error("Failed to log analytics event:", error);
  }
}

// Emit a funnel milestone exactly once per user. Safe to call on every
// signup/submission/conversion — the dedup check makes repeats no-ops.
export async function logMilestoneOnce(
  userId: string,
  name: string,
  props?: Record<string, unknown>
): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  try {
    const { data: existing } = await admin
      .from("analytics_events")
      .select("id")
      .eq("user_id", userId)
      .eq("name", name)
      .limit(1)
      .maybeSingle();
    if (existing) return;

    // Reuse the visitor_id already stitched to this user, so the milestone
    // sits on the same visitor timeline. Fall back to userId (also a uuid)
    // if no visitor row exists yet — visitor_id is NOT NULL.
    const { data: visitor } = await admin
      .from("analytics_visitors")
      .select("visitor_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    await admin.from("analytics_events").insert({
      visitor_id: visitor?.visitor_id ?? userId,
      user_id: userId,
      event_type: "milestone",
      name,
      props: props ?? null,
    });
  } catch (error) {
    console.error(`Failed to log milestone "${name}":`, error);
  }
}
