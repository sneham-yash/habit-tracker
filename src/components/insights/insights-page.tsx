"use client";

import { APP_TAGLINE } from "@/constants/brand";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useInsights } from "@/hooks/use-insights";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

function MetricCard({
  title,
  value,
  description,
  prominent = false,
}: {
  title: string;
  value: string | number;
  description?: string;
  prominent?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className={typography.metricLabel}>{title}</p>
        <p
          className={cn(
            prominent ? typography.metricValue : typography.metricValueSm,
          )}
        >
          {value}
        </p>
      </CardHeader>
      {description ? (
        <CardContent className={cn(typography.bodyMuted, "pt-0")}>
          {description}
        </CardContent>
      ) : null}
    </Card>
  );
}

export function InsightsPage() {
  const { data, isLoading, error } = useInsights();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Your Insights</h1>
        <p className={typography.screenSubtitle}>{APP_TAGLINE}</p>
      </div>

      {isLoading && (
        <p className={typography.bodyMuted}>Loading insights…</p>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      )}

      {data && !data.isReady && (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <h2 className={typography.sectionTitle}>Insights Coming Soon</h2>
            <p className={cn(typography.bodyText, "leading-relaxed")}>
              We&apos;re still gathering your data. Keep tracking your habits
              for a few more days to unlock personalized Rizen Insights.
            </p>
          </CardHeader>
          <CardContent className={cn(typography.bodyMuted, "text-center")}>
            {data.habitCount > 0
              ? `${data.habitCount} ${data.habitCount === 1 ? "habit" : "habits"} tracked · ${data.metrics.steps_forward} steps forward so far`
              : "Create your first habit to get started."}
          </CardContent>
        </Card>
      )}

      {data?.isReady && (
        <>
          <MetricCard
            title="Rizen Score"
            value={data.insights.rizenScore}
            description="Your overall transformation score (0–100)"
            prominent
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Current Streak"
              value={`${data.insights.currentStreak} days`}
            />
            <MetricCard
              title="Completion Rate"
              value={`${data.insights.completionRate}%`}
            />
            <MetricCard
              title="Steps Forward"
              value={data.insights.stepsForward}
            />
            <MetricCard
              title="Build Score"
              value={`${data.insights.buildScore}%`}
            />
            <MetricCard
              title="Quit Score"
              value={`${data.insights.quitScore}%`}
            />
          </div>

          <div className="space-y-3">
            <MetricCard
              title="Favorite Habit"
              value={data.insights.favoriteHabitName ?? "—"}
              description={
                data.insights.favoriteHabitName
                  ? "Your most consistent habit"
                  : "Complete habits to unlock insights"
              }
            />
            <MetricCard
              title="Strongest Category"
              value={data.insights.strongestCategoryName ?? "—"}
            />
            <MetricCard
              title="Needs Attention"
              value={data.insights.needsAttentionCategoryName ?? "—"}
              description="A category where small steps can help most"
            />
          </div>
        </>
      )}
    </div>
  );
}
