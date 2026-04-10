import { SupabaseClient } from "@supabase/supabase-js";

const FREE_DAILY_WRITING_LIMIT = 2;

export async function checkWritingUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
  // Check user plan
  const { data: settings } = await supabase
    .from("user_settings")
    .select("plan_type")
    .eq("user_id", userId)
    .single();

  const planType = settings?.plan_type ?? "free";

  if (planType === "pro") {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("writing_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const used = usage?.writing_count ?? 0;

  return {
    allowed: used < FREE_DAILY_WRITING_LIMIT,
    used,
    limit: FREE_DAILY_WRITING_LIMIT,
  };
}

export async function incrementWritingUsage(
  supabase: SupabaseClient,
  userId: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, writing_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({ writing_count: existing.writing_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      date: today,
      writing_count: 1,
      speaking_count: 0,
    });
  }
}
