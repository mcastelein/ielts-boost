import { createClient } from "@/lib/supabase/server";
import { fetchWritingDashboardData, fetchSpeakingDashboardData } from "@/lib/dashboard-data";
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

  const [writing, speaking] = await Promise.all([
    fetchWritingDashboardData(user.id, supabase),
    fetchSpeakingDashboardData(user.id, supabase),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <DashboardClient writing={writing} speaking={speaking} />
    </div>
  );
}
