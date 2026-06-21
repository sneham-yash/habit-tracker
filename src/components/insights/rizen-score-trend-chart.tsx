"use client";

import { LineChartIcon } from "lucide-react";

import { MetricIconBadge } from "@/components/metrics";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { RizenScoreTrendPoint } from "@/lib/analytics/rizen-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type RizenScoreTrendChartProps = {
  data: RizenScoreTrendPoint[];
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 140;
const PADDING = { top: 12, right: 8, bottom: 28, left: 28 };

function formatAxisDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildChartPath(
  data: RizenScoreTrendPoint[],
  plotWidth: number,
  plotHeight: number,
): string {
  if (data.length === 0) return "";

  const xStep = data.length <= 1 ? 0 : plotWidth / (data.length - 1);

  return data
    .map((point, index) => {
      const x = PADDING.left + index * xStep;
      const y = PADDING.top + plotHeight - (point.score / 100) * plotHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function describeTrend(data: RizenScoreTrendPoint[]): string {
  if (data.length === 0) return "No score trend data available.";
  const first = data[0]?.score ?? 0;
  const last = data[data.length - 1]?.score ?? 0;
  const delta = last - first;
  if (delta > 0) {
    return `Rizen Score trend over the last ${data.length} days, rising from ${first} to ${last}.`;
  }
  if (delta < 0) {
    return `Rizen Score trend over the last ${data.length} days, falling from ${first} to ${last}.`;
  }
  return `Rizen Score trend over the last ${data.length} days, stable at ${last}.`;
}

export function RizenScoreTrendChart({ data }: RizenScoreTrendChartProps) {
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const path = buildChartPath(data, plotWidth, plotHeight);

  const labelIndices =
    data.length <= 1
      ? [0]
      : [0, Math.floor((data.length - 1) / 2), data.length - 1];

  const yTicks = [0, 50, 100];

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="gap-1 px-4 pb-0">
        <div className="flex items-center gap-2">
          <MetricIconBadge icon={LineChartIcon} tone="neutral" size="sm" />
          <p className={typography.metricLabel}>Rizen Score Trend</p>
        </div>
        <p className={cn(typography.bodyMuted, "text-sm")}>
          Rolling 30-day score over time
        </p>
      </CardHeader>
      <CardContent className="px-4 pt-0">
        {data.length === 0 ? (
          <p className={typography.bodyMuted}>Not enough data yet.</p>
        ) : (
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full max-w-full"
            role="img"
            aria-label={describeTrend(data)}
          >
            {yTicks.map((tick) => {
              const y = PADDING.top + plotHeight - (tick / 100) * plotHeight;
              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    y1={y}
                    x2={CHART_WIDTH - PADDING.right}
                    y2={y}
                    className="stroke-border"
                    strokeWidth="1"
                    strokeDasharray={tick === 50 ? "4 4" : undefined}
                  />
                  <text
                    x={PADDING.left - 6}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            <path
              d={path}
              fill="none"
              stroke="var(--chart-1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((point, index) => {
              const xStep =
                data.length <= 1 ? 0 : plotWidth / (data.length - 1);
              const x = PADDING.left + index * xStep;
              const y =
                PADDING.top + plotHeight - (point.score / 100) * plotHeight;
              const isLabel = labelIndices.includes(index);

              return (
                <g key={point.date}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    className="fill-[var(--chart-1)]"
                  />
                  {isLabel ? (
                    <text
                      x={x}
                      y={CHART_HEIGHT - 6}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px]"
                    >
                      {formatAxisDate(point.date)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        )}
      </CardContent>
    </Card>
  );
}
