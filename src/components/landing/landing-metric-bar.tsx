"use client";

import { useInView } from "@/hooks/use-in-view";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type LandingMetricBarProps = {
  label: string;
  weight: number;
  colorClass: string;
  delay?: number;
};

function formatWeight(weight: number) {
  return `${Math.round(weight * 100)}%`;
}

export function LandingMetricBar({
  label,
  weight,
  colorClass,
  delay = 0,
}: LandingMetricBarProps) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className={typography.bodyText}>{label}</span>
        <span className={typography.bodyMuted}>{formatWeight(weight)}</span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-[900ms] ease-out motion-reduce:transition-none",
            colorClass,
          )}
          style={{
            width: isInView ? `${weight * 100}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
