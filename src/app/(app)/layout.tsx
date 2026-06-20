import { redirect } from "next/navigation";

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

  return (
    <div className="bg-background min-h-svh pb-20">
      <main className="mx-auto min-h-svh max-w-lg px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
