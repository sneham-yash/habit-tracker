import type { ReactNode } from "react";

import { APP_TAGLINE } from "@/constants/brand";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatStreakDays,
  formatTransformation,
} from "@/lib/analytics/rizen-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { MiniMetricTile } from "./mini-metric-tile";
import { ScoreRing } from "./score-ring";

type RizenScoreHeroProps = {
  rizenScore: number;
  transformation: number;
  currentStreak: number;
  stepsForward: number;
  children?: ReactNode;
  showTagline?: boolean;
  className?: string;
};

export function RizenScoreHero({
  rizenScore,
  transformation,
  currentStreak,
  stepsForward,
  children,
  showTagline = true,
  className,
}: RizenScoreHeroProps) {
  return (
    <Card
      className={cn(
        "border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background gap-3 py-4",
        className,
      )}
    >
      <CardContent className="space-y-3 px-4">
        <div className="space-y-0.5">
          <p className={cn(typography.metricLabel, "uppercase tracking-wide")}>
            Rizen Score
          </p>
          <p
            className={cn(
              typography.bodyMuted,
              "text-xs uppercase tracking-wide",
            )}
          >
            Last 30 days
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ScoreRing score={rizenScore} size="lg" />
          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className={typography.sectionTitle}>Rizen Score</h2>
            {showTagline ? (
              <p className={cn(typography.bodyText, "text-primary font-medium")}>
                {APP_TAGLINE}
              </p>
            ) : (
              <p className={cn(typography.bodyMuted, "text-sm")}>
                Last 30 days · 0–100
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MiniMetricTile
            metricKey="transformation"
            value={formatTransformation(transformation)}
            trendValue={transformation}
            align="center"
          />
          <MiniMetricTile
            metricKey="currentStreak"
            value={formatStreakDays(currentStreak)}
            align="center"
          />
          <MiniMetricTile
            metricKey="stepsForward"
            value={stepsForward}
            align="center"
          />
        </div>

        {children}
      </CardContent>
    </Card>
  );
}
