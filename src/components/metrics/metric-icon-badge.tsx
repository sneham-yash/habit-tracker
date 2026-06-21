import type { LucideIcon } from "lucide-react";

import {
  getMetricToneClass,
  type MetricTone,
} from "@/lib/analytics/metric-config";
import { cn } from "@/lib/utils";

type MetricIconBadgeProps = {
  icon: LucideIcon;
  tone?: MetricTone;
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASSES = {
  sm: "size-7 rounded-md [&_svg]:size-3.5",
  md: "size-8 rounded-lg [&_svg]:size-4",
} as const;

export function MetricIconBadge({
  icon: Icon,
  tone = "primary",
  size = "md",
  className,
}: MetricIconBadgeProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZE_CLASSES[size],
        getMetricToneClass(tone),
        className,
      )}
    >
      <Icon aria-hidden />
    </div>
  );
}
