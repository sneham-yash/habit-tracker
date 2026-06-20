import {
  mapMetricsToInsights,
  type RizenInsights,
  type RizenMetricsRow,
} from "@/lib/analytics/rizen-score";
import { isInsightsReady } from "@/lib/analytics/insights-readiness";
import { createClient } from "@/lib/supabase/client";

const EMPTY_METRICS: RizenMetricsRow = {
  completion_rate: 0,
  current_streak: 0,
  build_success_rate: 0,
  quit_success_rate: 0,
  growth_trend: 0,
  steps_forward: 0,
  longest_streak: 0,
  favorite_habit_id: null,
  favorite_habit_name: null,
  strongest_category_id: null,
  strongest_category_name: null,
  needs_attention_category_id: null,
  needs_attention_category_name: null,
};

export type InsightsPayload = {
  insights: RizenInsights;
  isReady: boolean;
  habitCount: number;
  metrics: RizenMetricsRow;
};

async function fetchActiveHabitCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("habits")
    .select("*", { count: "exact", head: true })
    .is("archived_at", null);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function fetchRizenInsights(): Promise<InsightsPayload> {
  const supabase = createClient();
  const [metricsResult, habitCount] = await Promise.all([
    supabase.rpc("get_rizen_metrics"),
    fetchActiveHabitCount(),
  ]);

  if (metricsResult.error) {
    throw new Error(metricsResult.error.message);
  }

  const metrics = (metricsResult.data?.[0] ?? EMPTY_METRICS) as RizenMetricsRow;
  const insights = mapMetricsToInsights(metrics);

  return {
    insights,
    isReady: isInsightsReady(metrics, habitCount),
    habitCount,
    metrics,
  };
}
