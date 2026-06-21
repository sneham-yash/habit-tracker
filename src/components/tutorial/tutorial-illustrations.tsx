"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  FolderOpenIcon,
} from "lucide-react";

import { MiniMetricTile, ScoreRing } from "@/components/metrics";
import type { MetricKey } from "@/lib/analytics/metric-config";

import { HABIT_TYPE_OPTIONS } from "@/constants/habits";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type HabitTypesIllustrationProps = {
  className?: string;
};

export function HabitTypesIllustration({
  className,
}: HabitTypesIllustrationProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {HABIT_TYPE_OPTIONS.map((option) => {
        const Icon = option.value === "build" ? ArrowUpIcon : ArrowDownIcon;
        return (
          <div
            key={option.value}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3",
              option.value === "build"
                ? "border-primary/30 bg-primary/5"
                : "bg-muted/40",
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                option.value === "build"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className={cn(typography.bodyText, "text-sm font-medium")}>
                {option.label}
              </p>
              <p className={cn(typography.bodyMuted, "text-xs leading-snug")}>
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type CategoriesIllustrationProps = {
  buildCategories: readonly string[];
  quitCategories: readonly string[];
  className?: string;
};

export function CategoriesIllustration({
  buildCategories,
  quitCategories,
  className,
}: CategoriesIllustrationProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <CategoryGroup label="Build" categories={buildCategories} tone="build" />
      <CategoryGroup label="Quit" categories={quitCategories} tone="quit" />
      <div className="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed p-3">
        <FolderOpenIcon className="size-4 shrink-0" aria-hidden />
        <p className={cn(typography.bodyMuted, "text-xs")}>
          Settings → Manage Categories
        </p>
      </div>
    </div>
  );
}

function CategoryGroup({
  label,
  categories,
  tone,
}: {
  label: string;
  categories: readonly string[];
  tone: "build" | "quit";
}) {
  return (
    <div className="space-y-1.5">
      <p className={cn(typography.metricLabel, "text-xs")}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {categories.map((name) => (
          <span
            key={name}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              tone === "build"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

type MetricsPreviewIllustrationProps = {
  score: number;
  metrics: readonly {
    metricKey: MetricKey;
    value: string;
    unit?: string;
    trendValue?: number;
  }[];
  className?: string;
};

export function MetricsPreviewIllustration({
  score,
  metrics,
  className,
}: MetricsPreviewIllustrationProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="bg-primary/5 flex items-center gap-4 rounded-lg border border-primary/20 p-4">
        <ScoreRing score={score} size="md" />
        <div className="min-w-0 space-y-0.5">
          <p className={cn(typography.sectionTitle, "text-base")}>
            Rizen Score
          </p>
          <p className={cn(typography.bodyMuted, "text-xs")}>
            Last 30 days · 0–100
          </p>
          <p className="text-primary pt-1 text-xs font-medium">
            Insights preview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric) => (
          <MiniMetricTile
            key={metric.metricKey}
            metricKey={metric.metricKey}
            value={metric.value}
            unit={metric.unit}
            trendValue={metric.trendValue}
            align="center"
          />
        ))}
      </div>
    </div>
  );
}

type WeightBarIllustrationProps = {
  segments: readonly {
    label: string;
    weight: number;
    colorClass: string;
  }[];
  className?: string;
};

export function WeightBarIllustration({
  segments,
  className,
}: WeightBarIllustrationProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex h-4 overflow-hidden rounded-full">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={cn(segment.colorClass, "h-full")}
            style={{ width: `${segment.weight * 100}%` }}
            title={`${segment.label}: ${Math.round(segment.weight * 100)}%`}
          />
        ))}
      </div>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn("size-2.5 shrink-0 rounded-full", segment.colorClass)}
                aria-hidden
              />
              <span className={typography.bodyText}>{segment.label}</span>
            </div>
            <span className={cn(typography.bodyMuted, "text-xs")}>
              {Math.round(segment.weight * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
