import { Card, CardContent } from "@/components/ui/card";
import { LANDING_FEATURES } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { LandingSection } from "./landing-nav";

export function LandingFeatures() {
  return (
    <LandingSection id="features" className="py-20 md:py-28">
      <div className="mb-14 space-y-4 text-center">
        <p className={typography.landingEyebrow}>Features</p>
        <h2 className={cn(typography.landingSectionTitle, "text-balance")}>
          Everything you need to transform.
        </h2>
        <p className={cn(typography.landingLead, "mx-auto max-w-2xl")}>
          A complete toolkit for building forward and letting go—designed to
          keep you consistent without overwhelming you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_FEATURES.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="border-primary/10 from-primary/[0.03] gap-0 rounded-2xl border bg-gradient-to-br to-transparent py-0 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="space-y-4 p-6">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                <Icon className="size-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <h3 className={typography.sectionTitle}>{title}</h3>
                <p className={typography.bodyMuted}>{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </LandingSection>
  );
}
