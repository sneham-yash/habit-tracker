import type { LucideIcon } from "lucide-react";

import {
  getMetricConfig,
  getTrendValueClass,
  getTransformationIcon,
  type MetricKey,
} from "@/lib/analytics/metric-config";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { MetricIconBadge } from "./metric-icon-badge";

type MiniMetricTileProps = {
  metricKey: MetricKey;
  value: string | number;
  unit?: string;
  align?: "center" | "left";
  trendValue?: number;
  icon?: LucideIcon;
  className?: string;
};

export function MiniMetricTile({
  metricKey,
  value,
  unit,
  align = "center",
  trendValue,
  icon,
  className,
}: MiniMetricTileProps) {
  const config = getMetricConfig(metricKey);
  const Icon =
    icon ??
    (metricKey === "transformation" || metricKey === "growthTrend"
      ? getTransformationIcon(trendValue ?? 0)
      : config.icon);
  const label = config.shortLabel ?? config.label;
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "bg-muted/30 flex min-h-[4.5rem] flex-col rounded-lg border px-2 py-2.5",
        isCentered ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <MetricIconBadge
        icon={Icon}
        tone={config.tone}
        size="sm"
        className={cn(isCentered ? "mb-1.5" : "mb-2")}
      />
      <p
        className={cn(
          typography.metricValueSm,
          "text-lg leading-tight",
          (metricKey === "transformation" || metricKey === "growthTrend") &&
            trendValue !== undefined
            ? getTrendValueClass(trendValue)
            : undefined,
        )}
      >
        {value}
      </p>
      {unit ? (
        <p className={cn(typography.bodyMuted, "text-[10px] leading-tight")}>
          {unit}
        </p>
      ) : null}
      <p className={cn(typography.metricLabel, "mt-0.5 text-[10px]")}>
        {label}
      </p>
    </div>
  );
}
