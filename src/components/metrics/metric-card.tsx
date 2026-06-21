import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { InfoIcon } from "lucide-react";

import { getMetricConfig, type MetricKey } from "@/lib/analytics/metric-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { MetricIconBadge } from "./metric-icon-badge";

type MetricCardProps = {
  metricKey: MetricKey;
  value: string | number;
  description?: string;
  prominent?: boolean;
  infoHref?: string;
  icon?: LucideIcon;
  className?: string;
};

export function MetricCard({
  metricKey,
  value,
  description,
  prominent = false,
  infoHref,
  icon,
  className,
}: MetricCardProps) {
  const config = getMetricConfig(metricKey);
  const Icon = icon ?? config.icon;

  return (
    <Card className={cn("gap-3 py-4", className)}>
      <CardHeader className="gap-2 px-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <MetricIconBadge icon={Icon} tone={config.tone} size="sm" />
            <p className={typography.metricLabel}>{config.label}</p>
          </div>
          {infoHref ? (
            <Link
              href={infoHref}
              className="text-muted-foreground hover:text-foreground shrink-0 rounded-sm p-0.5 transition-colors"
              aria-label={`Learn how ${config.label} is calculated`}
            >
              <InfoIcon className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
        <p
          className={cn(
            prominent ? typography.metricValue : typography.metricValueSm,
            "pl-0",
          )}
        >
          {value}
        </p>
      </CardHeader>
      {description ? (
        <CardContent className={cn(typography.bodyMuted, "px-4 pt-0 text-sm")}>
          {description}
        </CardContent>
      ) : null}
    </Card>
  );
}

type MetricDefinitionCardProps = {
  metricKey: MetricKey;
  title: string;
  description: string;
  window: string;
  className?: string;
};

export function MetricDefinitionCard({
  metricKey,
  title,
  description,
  window,
  className,
}: MetricDefinitionCardProps) {
  const config = getMetricConfig(metricKey);

  return (
    <Card className={cn("gap-2 py-4", className)}>
      <CardHeader className="flex-row items-start gap-3 space-y-0 px-4 pb-0">
        <MetricIconBadge icon={config.icon} tone={config.tone} />
        <div className="min-w-0 space-y-1">
          <p className={typography.bodyText}>{title}</p>
          <p className={cn(typography.bodyMuted, "text-sm leading-relaxed")}>
            {description}
          </p>
          <p className={cn(typography.metricLabel, "text-[10px]")}>{window}</p>
        </div>
      </CardHeader>
    </Card>
  );
}
