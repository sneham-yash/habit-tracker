"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import {
  MetricDefinitionCard,
  MiniMetricTile,
  ScoreRing,
} from "@/components/metrics";
import { WeightBarIllustration } from "@/components/tutorial/tutorial-illustrations";
import {
  INSIGHTS_READINESS_NOTE,
  METRIC_DEFINITIONS,
  METRICS_GUIDE_EXAMPLE,
  METRICS_GUIDE_EXAMPLE_SCORE,
  METRICS_GUIDE_WEIGHTS,
} from "@/components/tutorial/tutorial-content";
import { METRIC_DEFINITION_KEYS } from "@/lib/analytics/metric-config";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const BACK_LINKS = {
  insights: { href: "/insights", label: "Insights" },
  tutorial: { href: "/settings/tutorial", label: "Tutorial" },
} as const;

export function MetricsGuidePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backLink =
    from === "insights" ? BACK_LINKS.insights : BACK_LINKS.tutorial;

  const exampleBreakdown = METRICS_GUIDE_WEIGHTS.map((item) => {
    let normalized = 0;
    if (item.key === "completionRate") {
      normalized = METRICS_GUIDE_EXAMPLE.completionRate;
    } else if (item.key === "currentStreak") {
      normalized = Math.min(100, (METRICS_GUIDE_EXAMPLE.currentStreak / 30) * 100);
    } else if (item.key === "buildSuccess") {
      normalized = METRICS_GUIDE_EXAMPLE.buildSuccessRate;
    } else if (item.key === "quitSuccess") {
      normalized = METRICS_GUIDE_EXAMPLE.quitSuccessRate;
    } else if (item.key === "growthTrend") {
      normalized = Math.min(100, Math.max(0, 50 + METRICS_GUIDE_EXAMPLE.growthTrend * 50));
    }

    const contribution = Math.round(normalized * item.weight * 10) / 10;

    return {
      ...item,
      normalized: Math.round(normalized),
      contribution,
    };
  });

  return (
    <div className="space-y-4">
      <Link
        href={backLink.href}
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        {backLink.label}
      </Link>

      <div className="space-y-1">
        <h1 className={typography.screenTitle}>How Metrics Work</h1>
        <p className={typography.screenSubtitle}>
          Rizen Score and your Insights explained
        </p>
      </div>

      <Card className="gap-3 py-4">
        <CardHeader className="px-4 pb-0">
          <p className={typography.sectionTitle}>Rizen Score Formula</p>
          <p className={cn(typography.bodyMuted, "text-sm leading-relaxed")}>
            Your Rizen Score is a weighted blend of five factors from the last
            30 days, normalized to a 0–100 scale.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <WeightBarIllustration
            segments={METRICS_GUIDE_WEIGHTS.map((item) => ({
              label: item.label,
              weight: item.weight,
              colorClass: item.colorClass,
            }))}
          />
          <div className="space-y-2">
            {METRICS_GUIDE_WEIGHTS.map((item) => (
              <p key={item.key} className={cn(typography.bodyMuted, "text-xs")}>
                <span className="text-foreground font-medium">
                  {item.label}:
                </span>{" "}
                {item.normalization}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-3 py-4">
        <CardHeader className="px-4 pb-0">
          <p className={typography.sectionTitle}>Worked Example</p>
          <p className={cn(typography.bodyMuted, "text-sm")}>
            Sample inputs and how they combine into a score.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="grid grid-cols-2 gap-2">
            <MiniMetricTile
              metricKey="completionRate"
              value="80%"
              align="left"
            />
            <MiniMetricTile
              metricKey="currentStreak"
              value="12 days"
              align="left"
            />
            <MiniMetricTile
              metricKey="buildSuccess"
              value="85%"
              align="left"
            />
            <MiniMetricTile
              metricKey="quitSuccess"
              value="70%"
              align="left"
            />
            <MiniMetricTile
              metricKey="growthTrend"
              value="+5%"
              trendValue={0.05}
              align="left"
              className="col-span-2"
            />
          </div>

          <div className="divide-border divide-y rounded-lg border">
            {exampleBreakdown.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
              >
                <span className={typography.bodyText}>
                  {item.label} ({item.normalized} × {Math.round(item.weight * 100)}%)
                </span>
                <span className={typography.bodyMuted}>+{item.contribution}</span>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 flex items-center justify-between gap-3 rounded-lg border border-primary/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <ScoreRing score={METRICS_GUIDE_EXAMPLE_SCORE} size="sm" />
              <span className={typography.sectionTitle}>Rizen Score</span>
            </div>
            <span className={typography.metricValue}>{METRICS_GUIDE_EXAMPLE_SCORE}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className={typography.sectionTitle}>Individual Metrics</h2>
        {METRIC_DEFINITIONS.map((metric, index) => (
          <MetricDefinitionCard
            key={metric.title}
            metricKey={METRIC_DEFINITION_KEYS[index] ?? "completionRate"}
            title={metric.title}
            description={metric.description}
            window={metric.window}
          />
        ))}
      </div>

      <Card className="border-dashed py-4">
        <CardContent className="px-4">
          <p className={cn(typography.bodyText, "font-medium")}>
            When do Insights unlock?
          </p>
          <p className={cn(typography.bodyMuted, "mt-1 text-sm leading-relaxed")}>
            {INSIGHTS_READINESS_NOTE}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
