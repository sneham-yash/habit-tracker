import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type TodayProgressProps = {
  completedCount: number;
  totalCount: number;
  compact?: boolean;
};

export function TodayProgress({
  completedCount,
  totalCount,
  compact = false,
}: TodayProgressProps) {
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className={cn("space-y-2", compact ? "" : "space-y-3 border-t border-border/60 pt-3")}>
      <h2 className={typography.sectionTitle}>Today&apos;s Progress</h2>
      <p className={typography.bodyText}>
        <span className="font-medium">
          {completedCount} / {totalCount} Completed
        </span>
        <span className={cn(typography.bodyMuted, "ml-2")}>· {percentage}%</span>
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
  );
}
