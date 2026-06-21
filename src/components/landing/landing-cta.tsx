import Link from "next/link";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { Button } from "@/components/ui/button";
import { LANDING_CTA } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <LandingSection className="py-20 md:py-28">
      <div className="border-primary/20 from-primary/10 relative overflow-hidden rounded-3xl border bg-gradient-to-br via-background to-background px-8 py-14 text-center md:px-16 md:py-20">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6">
          <LandingReveal variant="scale-up">
            <h2 className={cn(typography.landingSectionTitle, "text-balance")}>
              {LANDING_CTA.headline}
            </h2>
          </LandingReveal>
          <LandingReveal variant="fade-up" delay={80}>
            <p className={typography.landingLead}>{LANDING_CTA.subcopy}</p>
          </LandingReveal>
          <LandingReveal variant="fade-up" delay={150}>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button size="lg" asChild>
                <Link href="/signup">{LANDING_CTA.primaryCta}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">{LANDING_CTA.secondaryCta}</Link>
              </Button>
            </div>
          </LandingReveal>
        </div>
      </div>
    </LandingSection>
  );
}
