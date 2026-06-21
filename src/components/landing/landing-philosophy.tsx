import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { LANDING_PHILOSOPHY } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function LandingPhilosophy() {
  return (
    <LandingSection id="philosophy" className="py-20 md:py-28">
      <LandingReveal variant="fade-up">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className={typography.landingEyebrow}>{LANDING_PHILOSOPHY.eyebrow}</p>
          <h2 className={cn(typography.landingSectionTitle, "text-balance")}>
            {LANDING_PHILOSOPHY.headline}
          </h2>
          <div className="space-y-4">
            {LANDING_PHILOSOPHY.paragraphs.map((paragraph) => (
              <p key={paragraph} className={typography.landingLead}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </LandingReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {LANDING_PHILOSOPHY.pillars.map((pillar, index) => (
          <LandingReveal key={pillar.title} variant="fade-up" delay={index * 80}>
            <div className="border-primary/10 bg-card/50 space-y-3 rounded-2xl border p-6 shadow-sm">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </div>
              <h3 className={typography.sectionTitle}>{pillar.title}</h3>
              <p className={typography.bodyMuted}>{pillar.description}</p>
            </div>
          </LandingReveal>
        ))}
      </div>
    </LandingSection>
  );
}
