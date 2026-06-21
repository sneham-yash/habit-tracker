import {
  getMetricConfig,
  type MetricKey,
} from "@/lib/analytics/metric-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

import { MetricIconBadge } from "./metric-icon-badge";

type CategoryInsightCardProps = {
  metricKey: Extract<MetricKey, "strongestCategory" | "needsAttention">;
  value: string;
  description?: string;
  className?: string;
};

export function CategoryInsightCard({
  metricKey,
  value,
  description,
  className,
}: CategoryInsightCardProps) {
  const config = getMetricConfig(metricKey);

  return (
    <Card className={cn("gap-2 py-4", className)}>
      <CardHeader className="gap-2 px-4 pb-0">
        <div className="flex items-center gap-2">
          <MetricIconBadge icon={config.icon} tone={config.tone} size="sm" />
          <p className={typography.metricLabel}>{config.label}</p>
        </div>
        <p className={typography.metricValueSm}>{value}</p>
      </CardHeader>
      {description ? (
        <CardContent className={cn(typography.bodyMuted, "px-4 pt-0 text-sm")}>
          {description}
        </CardContent>
      ) : null}
    </Card>
  );
}
