// Posts error notifications to the ClickUp "IELTS Boost" channel.
// Requires CLICKUP_API_TOKEN, CLICKUP_TEAM_ID, CLICKUP_CHANNEL_ID env vars.

const CLICKUP_API = "https://api.clickup.com/api/v3";

// In-memory dedupe so a credit-exhaustion event doesn't fire 50 times in a
// minute. Keyed by call_type. Resets per serverless instance, which is fine —
// the worst case is one extra notification per cold start.
const lastNotified = new Map<string, number>();
const SUPPRESS_MS = 60 * 60 * 1000; // 1 hour

interface NotifyErrorParams {
  callType: string;
  errorMessage: string;
  userId: string | null;
  userEmail?: string | null;
}

export async function notifyError({
  callType,
  errorMessage,
  userId,
  userEmail,
}: NotifyErrorParams): Promise<void> {
  const token = process.env.CLICKUP_API_TOKEN;
  const teamId = process.env.CLICKUP_TEAM_ID;
  const channelId = process.env.CLICKUP_CHANNEL_ID;

  if (!token || !teamId || !channelId) return;

  // Rate-limit: skip if we already alerted on this call_type within the last hour.
  const now = Date.now();
  const last = lastNotified.get(callType);
  if (last && now - last < SUPPRESS_MS) return;
  lastNotified.set(callType, now);

  const userLabel = userEmail ?? (userId ? `${userId.slice(0, 8)}...` : "anonymous");
  const adminUrl = userId
    ? `https://ieltsboost.ai/admin/users/${userId}`
    : "https://ieltsboost.ai/admin";

  const content = [
    `🚨 **IELTSBoost API error**`,
    ``,
    `**Section:** ${callType}`,
    `**User:** ${userLabel}`,
    `**Error:** ${errorMessage.slice(0, 300)}`,
    ``,
    `[View in admin →](${adminUrl})`,
    ``,
    `_Further ${callType} errors suppressed for 1 hour._`,
  ].join("\n");

  try {
    await fetch(
      `${CLICKUP_API}/workspaces/${teamId}/chat/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "message",
          content,
          content_format: "text/md",
        }),
      },
    );
  } catch (error) {
    // Never let notification failures break the main flow.
    console.error("ClickUp notify failed:", error);
  }
}
