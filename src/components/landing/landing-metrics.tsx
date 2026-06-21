import { ScoreRing } from "@/components/metrics";
import { Card, CardContent } from "@/components/ui/card";
import { LANDING_METRICS } from "@/constants/landing";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { LandingSection } from "./landing-nav";

function formatWeight(weight: number) {
  return `${Math.round(weight * 100)}%`;
}

export function LandingMetrics() {
  const { demoScore, weights, supporting } = LANDING_METRICS;

  return (
    <LandingSection id="metrics" className="py-20 md:py-28">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className={typography.landingEyebrow}>{LANDING_METRICS.eyebrow}</p>
            <h2 className={cn(typography.landingSectionTitle, "text-balance")}>
              {LANDING_METRICS.headline}
            </h2>
            <p className={typography.landingLead}>{LANDING_METRICS.subcopy}</p>
          </div>

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
                {weights.map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={typography.bodyText}>{item.label}</span>
                      <span className={typography.bodyMuted}>
                        {formatWeight(item.weight)}
                      </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className={cn("h-full rounded-full", item.colorClass)}
                        style={{ width: `${item.weight * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {supporting.map((item) => (
            <Card
              key={item.title}
              className="border-primary/10 gap-0 rounded-2xl border py-0 shadow-sm"
            >
              <CardContent className="space-y-2 p-6">
                <h3 className={typography.sectionTitle}>{item.title}</h3>
                <p className={typography.bodyMuted}>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
