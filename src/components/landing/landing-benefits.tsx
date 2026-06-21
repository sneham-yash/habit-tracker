import { CheckIcon } from "lucide-react";

import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { LANDING_BENEFITS } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function LandingBenefits() {
  return (
    <LandingSection id="benefits" className="py-20 md:py-28">
      <LandingReveal variant="scale-up">
        <div className="border-primary/10 from-primary/[0.04] rounded-3xl border bg-gradient-to-br via-transparent to-transparent p-8 md:p-12">
          <div className="mb-12 space-y-4 text-center">
            <p className={typography.landingEyebrow}>{LANDING_BENEFITS.eyebrow}</p>
            <h2 className={cn(typography.landingSectionTitle, "text-balance")}>
              {LANDING_BENEFITS.headline}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {LANDING_BENEFITS.items.map((item, index) => (
              <LandingReveal
                key={item.title}
                variant="fade-up"
                delay={100 + index * 80}
              >
                <div className="flex gap-4">
                  <div className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <CheckIcon className="size-4" aria-hidden />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className={typography.sectionTitle}>{item.title}</h3>
                    <p className={typography.bodyMuted}>{item.description}</p>
                  </div>
                </div>
              </LandingReveal>
            ))}
          </div>
        </div>
      </LandingReveal>
    </LandingSection>
  );
}
