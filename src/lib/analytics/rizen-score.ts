export type RizenScoreInput = {
  completionRate: number;
  currentStreak: number;
  buildSuccessRate: number;
  quitSuccessRate: number;
  growthTrend: number;
};

export const RIZEN_SCORE_WEIGHTS = {
  completionRate: 0.4,
  currentStreak: 0.25,
  buildSuccess: 0.15,
  quitSuccess: 0.15,
  growthTrend: 0.05,
} as const;

const MAX_STREAK_FOR_SCORE = 30;

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeRate(value: number): number {
  return clamp(value);
}

function normalizeStreak(streak: number): number {
  if (streak <= 0) return 0;
  return clamp((streak / MAX_STREAK_FOR_SCORE) * 100);
}

function normalizeTrend(trend: number): number {
  return clamp(50 + trend * 50);
}

export function calculateRizenScore(input: RizenScoreInput): number {
  const score =
    normalizeRate(input.completionRate) * RIZEN_SCORE_WEIGHTS.completionRate +
    normalizeStreak(input.currentStreak) * RIZEN_SCORE_WEIGHTS.currentStreak +
    normalizeRate(input.buildSuccessRate) * RIZEN_SCORE_WEIGHTS.buildSuccess +
    normalizeRate(input.quitSuccessRate) * RIZEN_SCORE_WEIGHTS.quitSuccess +
    normalizeTrend(input.growthTrend) * RIZEN_SCORE_WEIGHTS.growthTrend;

  return Math.round(clamp(score));
}

export type RizenMetricsRow = {
  completion_rate: number;
  current_streak: number;
  build_success_rate: number;
  quit_success_rate: number;
  growth_trend: number;
  steps_forward: number;
  longest_streak: number;
  favorite_habit_id: string | null;
  favorite_habit_name: string | null;
  strongest_category_id: string | null;
  strongest_category_name: string | null;
  needs_attention_category_id: string | null;
  needs_attention_category_name: string | null;
};

export type RizenInsights = {
  rizenScore: number;
  transformation: number;
  currentStreak: number;
  completionRate: number;
  stepsForward: number;
  buildScore: number;
  quitScore: number;
  longestStreak: number;
  favoriteHabitName: string | null;
  strongestCategoryName: string | null;
  needsAttentionCategoryName: string | null;
};

export type RizenScoreTrendRow = {
  score_date: string;
  completion_rate: number;
  current_streak: number;
  build_success_rate: number;
  quit_success_rate: number;
  growth_trend: number;
};

export type RizenScoreTrendPoint = {
  date: string;
  score: number;
};

export function formatTransformation(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded > 0) return `+${rounded}%`;
  if (rounded < 0) return `${rounded}%`;
  return "0%";
}

export function formatStreakDays(streak: number): string {
  return `${streak} ${streak === 1 ? "Day" : "Days"}`;
}

export function mapTrendRowToScore(row: RizenScoreTrendRow): RizenScoreTrendPoint {
  return {
    date: row.score_date,
    score: calculateRizenScore({
      completionRate: row.completion_rate,
      currentStreak: row.current_streak,
      buildSuccessRate: row.build_success_rate,
      quitSuccessRate: row.quit_success_rate,
      growthTrend: row.growth_trend,
    }),
  };
}

export function mapMetricsToInsights(
  metrics: RizenMetricsRow,
): RizenInsights {
  return {
    rizenScore: calculateRizenScore({
      completionRate: metrics.completion_rate,
      currentStreak: metrics.current_streak,
      buildSuccessRate: metrics.build_success_rate,
      quitSuccessRate: metrics.quit_success_rate,
      growthTrend: metrics.growth_trend,
    }),
    transformation: Math.round(metrics.growth_trend * 100 * 10) / 10,
    currentStreak: metrics.current_streak,
    completionRate: metrics.completion_rate,
    stepsForward: metrics.steps_forward,
    buildScore: metrics.build_success_rate,
    quitScore: metrics.quit_success_rate,
    longestStreak: metrics.longest_streak,
    favoriteHabitName: metrics.favorite_habit_name,
    strongestCategoryName: metrics.strongest_category_name,
    needsAttentionCategoryName: metrics.needs_attention_category_name,
  };
}
