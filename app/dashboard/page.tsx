import { createClient } from "@/lib/supabase/server";
import {
  fetchWritingDashboardData,
  fetchSpeakingDashboardData,
  fetchReadingDashboardData,
  fetchListeningDashboardData,
} from "@/lib/dashboard-data";
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardSignIn from "@/components/dashboard/DashboardSignIn";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <DashboardSignIn />
      </div>
    );
  }

  const [writing, speaking, reading, listening, settingsResult] = await Promise.all([
    fetchWritingDashboardData(user.id, supabase),
    fetchSpeakingDashboardData(user.id, supabase),
    fetchReadingDashboardData(user.id, supabase),
    fetchListeningDashboardData(user.id, supabase),
    supabase.from("user_settings").select("onboarding_completed").eq("user_id", user.id).single(),
  ]);

  const alwaysShow = process.env.NEXT_PUBLIC_ONBOARDING_ALWAYS_SHOW === "true";
  const onboardingCompleted = alwaysShow ? false : (settingsResult.data?.onboarding_completed ?? true);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <DashboardClient
        writing={writing}
        speaking={speaking}
        reading={reading}
        listening={listening}
        showOnboarding={!onboardingCompleted}
      />
    </div>
  );
}
