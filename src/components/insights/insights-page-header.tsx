import Link from "next/link";
import { BarChart3Icon, ChevronRightIcon } from "lucide-react";

import { MetricIconBadge } from "@/components/metrics";
import { APP_TAGLINE } from "@/constants/brand";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type InsightsPageHeaderProps = {
  metricsGuideHref: string;
  className?: string;
};

export function InsightsPageHeader({
  metricsGuideHref,
  className,
}: InsightsPageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-background px-4 py-4",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/[0.06] blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <MetricIconBadge icon={BarChart3Icon} tone="primary" size="sm" />
            <span className={typography.metricLabel}>Performance</span>
          </div>

          <div className="space-y-1">
            <h1 className={typography.screenTitle}>Your Insights</h1>
            <p className={cn(typography.authTagline, "text-sm")}>
              {APP_TAGLINE}
            </p>
            <p className={cn(typography.bodyMuted, "max-w-[18rem] text-sm")}>
              Rolling 30-day trends, streaks, and category highlights.
            </p>
          </div>
        </div>

        <Link
          href={metricsGuideHref}
          className={cn(
            "bg-background/80 text-foreground hover:border-primary/30 hover:bg-background",
            "border-primary/15 inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-3 py-1.5",
            "text-xs font-medium shadow-sm transition-colors",
          )}
        >
          How it works
          <ChevronRightIcon className="size-3.5 text-primary" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
