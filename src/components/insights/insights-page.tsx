"use client";

import Link from "next/link";

import {
  CategoryInsightCard,
  MiniMetricTile,
  RizenScoreHero,
} from "@/components/metrics";
import { RizenScoreTrendChart } from "@/components/insights/rizen-score-trend-chart";
import { APP_TAGLINE } from "@/constants/brand";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useInsights } from "@/hooks/use-insights";
import { formatTransformation } from "@/lib/analytics/rizen-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const METRICS_GUIDE_FROM_INSIGHTS = "/settings/metrics-guide?from=insights";

export function InsightsPage() {
  const { data, isLoading, error } = useInsights();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Your Insights</h1>
        <p className={typography.screenSubtitle}>{APP_TAGLINE}</p>
        <Link
          href={METRICS_GUIDE_FROM_INSIGHTS}
          className={cn(
            typography.bodyText,
            "text-primary inline-block text-sm font-medium hover:underline",
          )}
        >
          How are these metrics calculated?
        </Link>
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
          <RizenScoreHero
            rizenScore={data.insights.rizenScore}
            transformation={data.insights.transformation}
            currentStreak={data.insights.currentStreak}
            stepsForward={data.insights.stepsForward}
          />

          <div className="grid grid-cols-2 gap-2">
            <MiniMetricTile
              metricKey="completionRate"
              value={`${data.insights.completionRate}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="buildScore"
              value={`${data.insights.buildScore}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="quitScore"
              value={`${data.insights.quitScore}%`}
              align="left"
            />
            <MiniMetricTile
              metricKey="transformation"
              value={formatTransformation(data.insights.transformation)}
              trendValue={data.insights.transformation}
              align="left"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <CategoryInsightCard
              metricKey="strongestCategory"
              value={data.insights.strongestCategoryName ?? "—"}
            />
            <CategoryInsightCard
              metricKey="needsAttention"
              value={data.insights.needsAttentionCategoryName ?? "—"}
              description="A category where small steps can help most"
            />
          </div>

          <RizenScoreTrendChart data={data.scoreTrend} />
        </>
      )}
    </div>
  );
}
