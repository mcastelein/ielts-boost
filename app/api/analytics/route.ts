import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAnalyticsEvent, isBot, type AnalyticsEventType } from "@/lib/analytics";

const VALID_TYPES: AnalyticsEventType[] = ["pageview", "milestone", "event"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const visitorId = typeof body.visitorId === "string" ? body.visitorId : null;
  const eventType = body.eventType as AnalyticsEventType;
  if (!visitorId || !VALID_TYPES.includes(eventType)) {
    return NextResponse.json(
      { error: "missing or invalid visitorId/eventType" },
      { status: 400 },
    );
  }

  // Drop bot traffic before doing any work.
  const userAgent = request.headers.get("user-agent");
  if (isBot(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  const country = request.headers.get("x-vercel-ip-country");

  // Resolve the logged-in user from the session cookie, if any.
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    // anonymous visitor
  }

  await logAnalyticsEvent({
    visitorId,
    userId,
    eventType,
    name: typeof body.name === "string" ? body.name : null,
    path: typeof body.path === "string" ? body.path : null,
    referrer: typeof body.referrer === "string" ? body.referrer : null,
    country,
    userAgent,
    sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
    props: (body.props as Record<string, unknown>) ?? null,
  });

  return new NextResponse(null, { status: 204 });
}
