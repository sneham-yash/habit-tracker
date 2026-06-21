import type { Metadata } from "next";

import { NotFoundPage } from "@/components/not-found/not-found-page";
import { APP_NAME } from "@/constants/brand";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `Page not found | ${APP_NAME}`,
};

export default async function NotFound() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <NotFoundPage isAuthenticated={!!user} />;
}
