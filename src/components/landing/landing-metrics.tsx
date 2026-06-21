import { ScoreRing } from "@/components/metrics";
import { LandingMetricBar } from "@/components/landing/landing-metric-bar";
import { LandingReveal } from "@/components/landing/landing-reveal";
import { LandingSection } from "@/components/landing/landing-section";
import { Card, CardContent } from "@/components/ui/card";
import { LANDING_METRICS } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function LandingMetrics() {
  const { demoScore, weights, supporting } = LANDING_METRICS;

  return (
    <LandingSection id="metrics" className="py-20 md:py-28">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <LandingReveal variant="fade-up">
            <div className="space-y-4">
              <p className={typography.landingEyebrow}>{LANDING_METRICS.eyebrow}</p>
              <h2 className={cn(typography.landingSectionTitle, "text-balance")}>
                {LANDING_METRICS.headline}
              </h2>
              <p className={typography.landingLead}>{LANDING_METRICS.subcopy}</p>
            </div>
          </LandingReveal>

          <LandingReveal variant="slide-left" delay={100}>
            <Card className="border-primary/15 from-primary/5 gap-0 rounded-2xl border bg-gradient-to-br to-transparent py-0 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-4">
                  <ScoreRing score={demoScore} size="lg" />
                  <div>
                    <p className={typography.metricLabel}>Rizen Score</p>
                    <p className={typography.metricValue}>{demoScore}</p>
                    <p className={typography.bodyMuted}>Rolling 30 days</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {weights.map((item, index) => (
                    <LandingMetricBar
                      key={item.key}
                      label={item.label}
                      weight={item.weight}
                      colorClass={item.colorClass}
                      delay={index * 80}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </LandingReveal>
        </div>

        <div className="space-y-4">
          {supporting.map((item, index) => (
            <LandingReveal
              key={item.title}
              variant="slide-right"
              delay={index * 80}
            >
              <Card className="border-primary/10 gap-0 rounded-2xl border py-0 shadow-sm">
                <CardContent className="space-y-2 p-6">
                  <h3 className={typography.sectionTitle}>{item.title}</h3>
                  <p className={typography.bodyMuted}>{item.description}</p>
                </CardContent>
              </Card>
            </LandingReveal>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
