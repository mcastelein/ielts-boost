import { SupabaseClient } from "@supabase/supabase-js";

export async function isAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_settings")
    .select("role")
    .eq("user_id", userId)
    .single();

  return data?.role === "admin";
}

export async function requireAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false as const, user: null };
  }

  const admin = await isAdmin(supabase, user.id);
  if (!admin) {
    return { authorized: false as const, user };
  }

  return { authorized: true as const, user };
}
