import { SupabaseClient } from "@supabase/supabase-js";

const FREE_DAILY_WRITING_LIMIT = 3;
const FREE_DAILY_SPEAKING_LIMIT = 3;

export async function checkWritingUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
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

export async function checkSpeakingUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
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
    .select("speaking_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const used = usage?.speaking_count ?? 0;

  return {
    allowed: used < FREE_DAILY_SPEAKING_LIMIT,
    used,
    limit: FREE_DAILY_SPEAKING_LIMIT,
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
      reading_count: 0,
    });
  }
}

export async function checkReadingUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
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
    .select("reading_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const used = usage?.reading_count ?? 0;

  return {
    allowed: used < FREE_DAILY_READING_LIMIT,
    used,
    limit: FREE_DAILY_READING_LIMIT,
  };
}

export async function incrementReadingUsage(
  supabase: SupabaseClient,
  userId: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, reading_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({ reading_count: (existing.reading_count ?? 0) + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      date: today,
      writing_count: 0,
      speaking_count: 0,
      reading_count: 1,
    });
  }
}

export async function incrementSpeakingUsage(
  supabase: SupabaseClient,
  userId: string
) {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, speaking_count")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({ speaking_count: existing.speaking_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      date: today,
      writing_count: 0,
      speaking_count: 1,
    });
  }
}
