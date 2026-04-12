import { SupabaseClient } from "@supabase/supabase-js";

export async function logAdminAction({
  supabase,
  adminUserId,
  action,
  targetUserId,
  details,
}: {
  supabase: SupabaseClient;
  adminUserId: string;
  action: string;
  targetUserId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    await supabase.from("admin_audit_log").insert({
      admin_user_id: adminUserId,
      action,
      target_user_id: targetUserId ?? null,
      details: details ?? null,
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
