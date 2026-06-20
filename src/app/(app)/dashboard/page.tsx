import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    displayName = (profile as { display_name: string | null } | null)
      ?.display_name ?? null;
  }

  return <DashboardPage displayName={displayName} />;
}
