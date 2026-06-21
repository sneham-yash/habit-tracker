"use client";

import Link from "next/link";
import { InfoIcon } from "lucide-react";

import { APP_TAGLINE } from "@/constants/brand";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { RizenScoreTrendChart } from "@/components/insights/rizen-score-trend-chart";
import { useInsights } from "@/hooks/use-insights";
import { formatTransformation } from "@/lib/analytics/rizen-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const METRICS_GUIDE_FROM_INSIGHTS = "/settings/metrics-guide?from=insights";

function MetricCard({
  title,
  value,
  description,
  prominent = false,
  infoHref,
}: {
  title: string;
  value: string | number;
  description?: string;
  prominent?: boolean;
  infoHref?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <p className={typography.metricLabel}>{title}</p>
          {infoHref ? (
            <Link
              href={infoHref}
              className="text-muted-foreground hover:text-foreground shrink-0 rounded-sm p-0.5 transition-colors"
              aria-label={`Learn how ${title} is calculated`}
            >
              <InfoIcon className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
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
          <MetricCard
            title="Rizen Score"
            value={data.insights.rizenScore}
            description="Recent performance over the last 30 days (0–100)"
            prominent
            infoHref={METRICS_GUIDE_FROM_INSIGHTS}
          />

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Transformation"
              value={formatTransformation(data.insights.transformation)}
              description="Compared to last month"
            />
            <MetricCard
              title="Steps Forward"
              value={data.insights.stepsForward}
            />
            <MetricCard
              title="Current Streak"
              value={`${data.insights.currentStreak} days`}
            />
            <MetricCard
              title="Completion Rate"
              value={`${data.insights.completionRate}%`}
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
              title="Strongest Category"
              value={data.insights.strongestCategoryName ?? "—"}
            />
            <MetricCard
              title="Needs Attention"
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
