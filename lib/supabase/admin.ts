import { createClient } from "@supabase/supabase-js";

// Service role client for admin operations (accessing auth.users, etc.)
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Fetch a map of user_id -> { email, name } for a list of user IDs
export async function getUserProfiles(
  userIds: string[]
): Promise<Record<string, { email: string; name: string | null }>> {
  const admin = createAdminClient();
  if (!admin || userIds.length === 0) return {};

  const profiles: Record<string, { email: string; name: string | null }> = {};

  // Supabase admin listUsers has pagination, fetch all
  const { data, error } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (error || !data?.users) return profiles;

  for (const user of data.users) {
    if (userIds.includes(user.id)) {
      profiles[user.id] = {
        email: user.email ?? "N/A",
        name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          null,
      };
    }
  }

  return profiles;
}
