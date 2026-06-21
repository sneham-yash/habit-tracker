import Link from "next/link";

import { RizenScoreHero } from "@/components/metrics";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { Button } from "@/components/ui/button";
import { LANDING_HERO, LANDING_METRICS } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const { demoScore, demoMetrics } = LANDING_METRICS;

  return (
    <LandingSection className="flex min-h-[calc(100svh-4rem)] items-center py-16 md:py-24">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          <LandingReveal immediate variant="fade-up" delay={0}>
            <p className={typography.landingEyebrow}>{LANDING_HERO.eyebrow}</p>
          </LandingReveal>

          <LandingReveal immediate variant="fade-up" delay={80}>
            <h1 className={cn(typography.landingHeadline, "text-balance")}>
              {LANDING_HERO.headline}
            </h1>
          </LandingReveal>

          <LandingReveal immediate variant="fade-up" delay={160}>
            <p className={cn(typography.landingLead, "max-w-xl text-pretty")}>
              {LANDING_HERO.subcopy}
            </p>
          </LandingReveal>

          <LandingReveal immediate variant="fade-up" delay={240}>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/signup">{LANDING_HERO.primaryCta}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">{LANDING_HERO.secondaryCta}</Link>
              </Button>
            </div>
          </LandingReveal>
        </div>

        <LandingReveal
          immediate
          variant="fade-up"
          delay={320}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <RizenScoreHero
            rizenScore={demoScore}
            transformation={demoMetrics.growthTrend}
            currentStreak={demoMetrics.currentStreak}
            stepsForward={247}
            className="border-primary/15 rounded-2xl shadow-lg"
          />
        </LandingReveal>
      </div>
    </LandingSection>
  );
}
