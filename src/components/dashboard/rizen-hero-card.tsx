import { APP_TAGLINE } from "@/constants/brand";
import { Card, CardContent } from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type RizenHeroCardProps = {
  rizenScore: number;
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

export function RizenHeroCard({
  rizenScore,
  completedCount,
  totalCount,
}: RizenHeroCardProps) {
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background py-5">
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <p className={typography.metricLabel}>Rizen Score</p>
          <div className="flex items-center gap-5">
            <ScoreRing score={rizenScore} />
          </div>
          <p className={cn(typography.bodyText, "text-primary font-medium")}>
            {APP_TAGLINE}
          </p>
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
