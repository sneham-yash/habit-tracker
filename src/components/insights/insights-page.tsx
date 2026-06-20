"use client";

import { APP_TAGLINE } from "@/constants/brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInsights } from "@/hooks/use-insights";

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="text-muted-foreground pt-0 text-sm">
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
        <h1 className="text-2xl font-bold tracking-tight">Your Insights</h1>
        <p className="text-muted-foreground text-sm">{APP_TAGLINE}</p>
      </div>

      {isLoading && (
        <p className="text-muted-foreground text-sm">Loading insights…</p>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      )}

      {data && !data.isReady && (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Insights coming soon</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              We&apos;re still gathering your data. Keep tracking your habits
              for a few more days to unlock personalized Rizen Insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center text-sm">
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
            <MetricCard title="Steps Forward" value={data.insights.stepsForward} />
            <MetricCard title="Build Score" value={`${data.insights.buildScore}%`} />
            <MetricCard title="Quit Score" value={`${data.insights.quitScore}%`} />
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
