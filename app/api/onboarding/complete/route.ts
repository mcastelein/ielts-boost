import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Whitelisted survey fields the welcome flow may persist alongside completion.
type SurveyUpdate = {
  self_level?: string | null;
  target_band?: number | null;
  exam_date?: string | null;
  focus?: string | null;
  referral_source?: string | null;
  referral_other?: string | null;
};

const LEVELS = ["beginner", "intermediate", "advanced"];
const FOCUSES = ["listening", "reading", "writing", "speaking"];
const REFERRALS = ["wechat", "xiaohongshu", "douyin", "bilibili", "friend", "search", "other"];

function sanitize(body: unknown): SurveyUpdate {
  const out: SurveyUpdate = {};
  if (!body || typeof body !== "object") return out;
  const b = body as Record<string, unknown>;

  if (typeof b.self_level === "string" && LEVELS.includes(b.self_level)) out.self_level = b.self_level;
  // focus is a comma-separated list of skills; keep only known values, in IELTS order.
  if (typeof b.focus === "string") {
    const picked = b.focus.split(",").map((s) => s.trim()).filter((s) => FOCUSES.includes(s));
    out.focus = picked.length ? FOCUSES.filter((f) => picked.includes(f)).join(",") : null;
  }
  if (typeof b.referral_source === "string" && REFERRALS.includes(b.referral_source)) {
    out.referral_source = b.referral_source;
  }
  if (typeof b.target_band === "number" && b.target_band >= 1 && b.target_band <= 9) {
    out.target_band = b.target_band;
  }
  if (typeof b.exam_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.exam_date)) out.exam_date = b.exam_date;
  if (typeof b.referral_other === "string") out.referral_other = b.referral_other.slice(0, 200) || null;

  return out;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Body is optional: the contextual writing/feedback tours call this with no payload.
  let survey: SurveyUpdate = {};
  try {
    const body = await request.json();
    survey = sanitize(body);
  } catch {
    // No / invalid body — just mark onboarding complete.
  }

  const { error } = await supabase
    .from("user_settings")
    .update({ onboarding_completed: true, ...survey })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
