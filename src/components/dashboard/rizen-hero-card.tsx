import { APP_TAGLINE } from "@/constants/brand";
import { TodayProgress } from "@/components/dashboard/today-progress";
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
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-24 shrink-0">
      <svg className="size-24 -rotate-90" viewBox="0 0 80 80" aria-hidden>
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
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

export function RizenHeroCard({
  rizenScore,
  transformation,
  currentStreak,
  stepsForward,
  completedCount,
  totalCount,
}: RizenHeroCardProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background py-4">
      <CardContent className="space-y-3">
        <div className="space-y-0.5">
          <p className={cn(typography.metricLabel, "uppercase tracking-wide")}>
            Rizen Score
          </p>
          <p className={cn(typography.bodyMuted, "text-xs uppercase tracking-wide")}>
            Last 30 days
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ScoreRing score={rizenScore} />
          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className={typography.sectionTitle}>Rizen Score</h2>
            <p className={cn(typography.bodyText, "text-primary font-medium")}>
              {APP_TAGLINE}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-0.5">
            <p className={typography.metricValueSm}>
              {formatTransformation(transformation)}
            </p>
            <p className={typography.metricLabel}>Growth</p>
          </div>
          <div className="space-y-0.5">
            <p className={typography.metricValueSm}>
              {formatStreakDays(currentStreak)}
            </p>
            <p className={typography.metricLabel}>Streak</p>
          </div>
          <div className="space-y-0.5">
            <p className={typography.metricValueSm}>{stepsForward}</p>
            <p className={typography.metricLabel}>Steps</p>
          </div>
        </div>

        <TodayProgress
          completedCount={completedCount}
          totalCount={totalCount}
        />
      </CardContent>
    </Card>
  );
}
