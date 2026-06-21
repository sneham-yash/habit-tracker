import Link from "next/link";

import { RizenScoreHero } from "@/components/metrics";
import { Button } from "@/components/ui/button";
import { LANDING_HERO, LANDING_METRICS } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { LandingSection } from "./landing-nav";

export function LandingHero() {
  const { demoScore, demoMetrics } = LANDING_METRICS;

  return (
    <LandingSection className="flex min-h-[calc(100svh-4rem)] items-center py-16 md:py-24">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div
          className={cn(
            "space-y-8",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700",
          )}
        >
          <div className="space-y-4">
            <p className={typography.landingEyebrow}>{LANDING_HERO.eyebrow}</p>
            <h1 className={cn(typography.landingHeadline, "text-balance")}>
              {LANDING_HERO.headline}
            </h1>
            <p className={cn(typography.landingLead, "max-w-xl text-pretty")}>
              {LANDING_HERO.subcopy}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">{LANDING_HERO.primaryCta}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">{LANDING_HERO.secondaryCta}</Link>
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto w-full max-w-md lg:max-w-none",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-1000 motion-safe:delay-150",
          )}
        >
          <RizenScoreHero
            rizenScore={demoScore}
            transformation={demoMetrics.growthTrend}
            currentStreak={demoMetrics.currentStreak}
            stepsForward={247}
            className="border-primary/15 rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </LandingSection>
  );
}
