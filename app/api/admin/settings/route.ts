import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { logAdminAction } from "@/lib/admin-audit";

// Admin settings are stored in a simple key-value table: admin_settings
// For now we'll use the api_usage_log to compute costs and compare against thresholds
// stored in a local config approach (supabase table or env vars)

// We'll store budget settings in a "admin_settings" table with columns:
// key (text, primary key), value (jsonb), updated_at (timestamp)

export async function GET() {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { data } = await supabase
    .from("admin_settings")
    .select("key, value")
    .in("key", ["daily_budget", "monthly_budget"]);

  const settings: Record<string, number> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  // Get current costs
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [{ data: todayCosts }, { data: monthCosts }] = await Promise.all([
    supabase.from("api_usage_log").select("estimated_cost_usd").gte("created_at", todayStart),
    supabase.from("api_usage_log").select("estimated_cost_usd").gte("created_at", monthStart),
  ]);

  const todayTotal = todayCosts?.reduce((s, r) => s + (r.estimated_cost_usd ?? 0), 0) ?? 0;
  const monthTotal = monthCosts?.reduce((s, r) => s + (r.estimated_cost_usd ?? 0), 0) ?? 0;

  return NextResponse.json({
    budgets: {
      daily: settings.daily_budget ?? null,
      monthly: settings.monthly_budget ?? null,
    },
    current: {
      today: todayTotal,
      month: monthTotal,
    },
    alerts: {
      dailyExceeded: settings.daily_budget ? todayTotal >= settings.daily_budget : false,
      monthlyExceeded: settings.monthly_budget ? monthTotal >= settings.monthly_budget : false,
      dailyWarning: settings.daily_budget ? todayTotal >= settings.daily_budget * 0.8 : false,
      monthlyWarning: settings.monthly_budget ? monthTotal >= settings.monthly_budget * 0.8 : false,
    },
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { authorized, user: adminUser } = await requireAdmin(supabase);
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { daily_budget, monthly_budget } = await request.json();

  // Upsert both settings
  const updates = [];
  if (daily_budget !== undefined) {
    updates.push(
      supabase.from("admin_settings").upsert(
        { key: "daily_budget", value: daily_budget, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
    );
  }
  if (monthly_budget !== undefined) {
    updates.push(
      supabase.from("admin_settings").upsert(
        { key: "monthly_budget", value: monthly_budget, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
    );
  }

  await Promise.all(updates);

  await logAdminAction({
    supabase,
    adminUserId: adminUser!.id,
    action: "update_budget_settings",
    details: { daily_budget, monthly_budget },
  });

  return NextResponse.json({ success: true });
}
