import Link from "next/link";

import { AuthBackgroundArt } from "@/components/auth/auth-background-art";
import { RizenLogo } from "@/components/brand/rizen-logo";
import { ThemeModePicker } from "@/components/theme/theme-mode-picker";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/constants/brand";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type NotFoundPageProps = {
  isAuthenticated: boolean;
};

export function NotFoundPage({ isAuthenticated }: NotFoundPageProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-primary/[0.07] via-background to-background px-6 py-12 dark:from-primary/[0.04]">
      <AuthBackgroundArt />
      <ThemeModePicker className="fixed top-4 right-4 z-50" />

      <div
        className={cn(
          "relative z-10 w-full max-w-sm space-y-8 text-center",
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
        )}
      >
        <header className="space-y-3">
          <div className="flex justify-center opacity-90">
            <Link href="/" aria-label={`${APP_NAME} home`}>
              <RizenLogo size="sm" priority />
            </Link>
          </div>
          <p className={typography.authTagline}>{APP_TAGLINE}</p>
        </header>

        <div className="space-y-3">
          <p className={cn(typography.metricValue, "text-primary")}>404</p>
          <h1 className={typography.authHeadline}>Page not found</h1>
          <p className={cn(typography.bodyMuted, "text-pretty")}>
            This step doesn&apos;t exist — let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              {isAuthenticated ? "Go to Dashboard" : "Go Home"}
            </Link>
          </Button>
          {!isAuthenticated ? (
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
