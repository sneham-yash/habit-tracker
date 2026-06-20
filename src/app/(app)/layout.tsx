import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const profileData = profile as {
    display_name: string | null;
    avatar_url: string | null;
  } | null;

  return (
    <div className="bg-background min-h-svh pb-20 pt-14">
      <AppHeader
        displayName={profileData?.display_name}
        email={user.email}
        avatarUrl={profileData?.avatar_url}
      />
      <main className="mx-auto min-h-[calc(100svh-3.5rem-5rem)] max-w-lg px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
