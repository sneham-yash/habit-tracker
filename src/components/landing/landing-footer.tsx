import Link from "next/link";

import { APP_NAME } from "@/constants/brand";
import { LANDING_FOOTER } from "@/constants/landing";
import { typography } from "@/lib/typography";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/40 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="space-y-1 text-center sm:text-left">
          <p className={typography.sectionTitle}>{APP_NAME}</p>
          <p className={typography.bodyMuted}>{LANDING_FOOTER.tagline}</p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-primary text-sm font-medium transition-colors hover:underline"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="border-border/40 border-t">
        <p className="text-muted-foreground py-6 text-center text-xs">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
