import type { RizenMetricsRow } from "@/lib/analytics/rizen-score";

export function isInsightsReady(
  metrics: RizenMetricsRow,
  habitCount: number,
): boolean {
  return (
    habitCount > 0 &&
    (metrics.steps_forward >= 3 || metrics.completion_rate > 0)
  );
}
