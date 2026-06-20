import { FlameIcon, FootprintsIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { APP_TAGLINE } from "@/constants/brand";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatStreakDays,
  formatTransformation,
} from "@/lib/analytics/rizen-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type RizenHeroCardProps = {
  rizenScore: number;
  transformation: number;
  currentStreak: number;
  stepsForward: number;
  completedCount: number;
  totalCount: number;
};

function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-28 shrink-0">
      <svg className="size-28 -rotate-90" viewBox="0 0 96 96" aria-hidden>
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={typography.metricValue}>{score}</span>
      </div>
    </div>
  );
}

function TransformationIcon({ value }: { value: number }) {
  if (value > 0) {
    return <TrendingUpIcon className="size-3.5 shrink-0 text-primary" aria-hidden />;
  }
  if (value < 0) {
    return <TrendingDownIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />;
  }
  return null;
}

export function RizenHeroCard({
  rizenScore,
  transformation,
  currentStreak,
  stepsForward,
  completedCount,
  totalCount,
}: RizenHeroCardProps) {
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background py-5">
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <p className={typography.metricLabel}>Rizen Score</p>
          <p className={typography.bodyMuted}>Recent Performance</p>
        </div>

        <div className="flex items-start gap-5">
          <ScoreRing score={rizenScore} />

          <div className="min-w-0 flex-1 space-y-4 pt-1">
            <div className="space-y-1">
              <h2 className={typography.sectionTitle}>Rizen Score</h2>
              <p className={cn(typography.bodyText, "text-primary font-medium")}>
                {APP_TAGLINE}
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-0.5">
                <p className={typography.metricLabel}>Transformation</p>
                <div className="flex items-center gap-1.5">
                  <TransformationIcon value={transformation} />
                  <p className={typography.metricValueSm}>
                    {formatTransformation(transformation)}
                  </p>
                </div>
                <p className={typography.bodyMuted}>vs last month</p>
              </div>

              <div className="space-y-0.5">
                <p className={typography.metricLabel}>Current Streak</p>
                <div className="flex items-center gap-1.5">
                  <FlameIcon className="size-4 shrink-0 text-primary" aria-hidden />
                  <p className={typography.metricValueSm}>
                    {formatStreakDays(currentStreak)}
                  </p>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className={typography.metricLabel}>Steps Forward</p>
                <div className="flex items-center gap-1.5">
                  <FootprintsIcon className="size-4 shrink-0 text-primary" aria-hidden />
                  <p className={typography.metricValueSm}>{stepsForward}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-4">
          <h2 className={typography.sectionTitle}>Today&apos;s Progress</h2>
          <p className={typography.bodyText}>
            <span className="font-medium">
              {completedCount} / {totalCount} Completed
            </span>
            <span className={cn(typography.bodyMuted, "ml-2")}>
              · {percentage}%
            </span>
          </p>
          <div
            className="bg-muted h-2 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
