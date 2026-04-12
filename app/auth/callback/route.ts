import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Emails that should automatically get admin role on first login
const ADMIN_EMAILS = ["mpcastelein@gmail.com", "apc1993@gmail.com"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure user_settings row exists
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existing } = await supabase
          .from("user_settings")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!existing) {
          const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
          const { error: insertError } = await supabase
            .from("user_settings")
            .insert({
              user_id: user.id,
              ui_language: "en",
              feedback_language: "en",
              plan_type: "free",
              role: isAdmin ? "admin" : "user",
            });
          if (insertError) {
            console.error(
              "Failed to create user_settings for",
              user.id,
              user.email,
              insertError
            );
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
