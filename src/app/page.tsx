import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { APP_NAME, APP_TAGLINE } from "@/constants/brand";
import { LANDING_SEO_DESCRIPTION } from "@/constants/landing";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: LANDING_SEO_DESCRIPTION,
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingPage isAuthenticated={!!user} />;
}
