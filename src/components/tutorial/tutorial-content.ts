import { HABIT_TYPE_OPTIONS } from "@/constants/habits";
import {
  calculateRizenScore,
  RIZEN_SCORE_WEIGHTS,
} from "@/lib/analytics/rizen-score";

export const ONBOARDING_STEP_COUNT = 3;

export const ONBOARDING_STEPS = [
  {
    id: "habits",
    title: "Build & Quit Habits",
    description:
      "Rizen tracks two kinds of habits. Build habits grow positive routines; Quit habits help you break patterns that hold you back.",
    bullets: [
      "Tap Create in the bottom nav to start a new habit.",
      "Choose Build or Quit, then add a name, schedule, and optional reminders.",
      "Build habits can include a daily target (e.g. 30 minutes of reading).",
    ],
    habitTypes: HABIT_TYPE_OPTIONS,
  },
  {
    id: "categories",
    title: "Categories & Management",
    description:
      "Categories keep your habits organized and power your Insights — showing where you shine and where small steps help most.",
    bullets: [
      "Each habit belongs to a build or quit category (Health & Fitness, Digital, Substance, etc.).",
      "Default categories are ready to use; add your own under Settings → Manage Categories.",
      "Edit, archive, or delete habits anytime under Settings → Manage Habits.",
    ],
    buildCategories: ["Health & Fitness", "Mindfulness", "Learning"],
    quitCategories: ["Digital", "Substance", "Mental Wellness"],
  },
  {
    id: "metrics",
    title: "Your Rizen Journey",
    description:
      "Your Rizen Score (0–100) reflects how consistently you show up over the last 30 days.",
    bullets: [
      "Key drivers: completion rate, current streak, build success, quit success, and growth trend.",
      "Visit Insights to see your score, streaks, and category highlights.",
      "See the full breakdown anytime under Settings → Tutorial → How Metrics Work.",
    ],
    previewScore: 72,
    previewMetrics: [
      { metricKey: "completionRate" as const, value: "85%" },
      { metricKey: "currentStreak" as const, value: "12", unit: "days" },
      { metricKey: "growthTrend" as const, value: "+5%", trendValue: 0.05 },
    ],
  },
] as const;

export const METRICS_GUIDE_WEIGHTS = [
  {
    key: "completionRate",
    label: "Completion Rate",
    weight: RIZEN_SCORE_WEIGHTS.completionRate,
    normalization: "Used as-is (0–100%)",
    colorClass: "bg-primary",
  },
  {
    key: "currentStreak",
    label: "Current Streak",
    weight: RIZEN_SCORE_WEIGHTS.currentStreak,
    normalization: "Streak ÷ 30 × 100, capped at 100",
    colorClass: "bg-primary/80",
  },
  {
    key: "buildSuccess",
    label: "Build Success",
    weight: RIZEN_SCORE_WEIGHTS.buildSuccess,
    normalization: "Build habit completion rate (0–100%)",
    colorClass: "bg-primary/60",
  },
  {
    key: "quitSuccess",
    label: "Quit Success",
    weight: RIZEN_SCORE_WEIGHTS.quitSuccess,
    normalization: "Quit habit completion rate (0–100%)",
    colorClass: "bg-primary/40",
  },
  {
    key: "growthTrend",
    label: "Growth Trend",
    weight: RIZEN_SCORE_WEIGHTS.growthTrend,
    normalization: "50 + trend × 50 (trend is month-over-month change)",
    colorClass: "bg-muted-foreground/40",
  },
] as const;

export const METRICS_GUIDE_EXAMPLE = {
  completionRate: 80,
  currentStreak: 12,
  buildSuccessRate: 85,
  quitSuccessRate: 70,
  growthTrend: 0.05,
} as const;

export const METRICS_GUIDE_EXAMPLE_SCORE = calculateRizenScore(
  METRICS_GUIDE_EXAMPLE,
);

export const METRIC_DEFINITIONS = [
  {
    title: "Completion Rate",
    description:
      "Completed scheduled days divided by total scheduled days across all active habits in the last 30 days.",
    window: "Rolling 30 days",
  },
  {
    title: "Build Score",
    description:
      "Same completion ratio, calculated only for build habits. Shows how well you maintain positive routines.",
    window: "Rolling 30 days",
  },
  {
    title: "Quit Score",
    description:
      "Same completion ratio, calculated only for quit habits. Tracks how consistently you avoid negative patterns.",
    window: "Rolling 30 days",
  },
  {
    title: "Current Streak",
    description:
      "The longest active streak across all habits. Rest days and grace periods keep streaks fair when you miss a non-scheduled day.",
    window: "All time",
  },
  {
    title: "Transformation",
    description:
      "How your completion rate changed compared to the previous 30-day window. Positive means you are improving.",
    window: "30 days vs prior 30 days",
  },
  {
    title: "Steps Forward",
    description:
      "Total lifetime habit completions — every check-in counts as a step on your journey.",
    window: "All time",
  },
  {
    title: "Strongest Category",
    description:
      "The category with the highest completion rate in the current window.",
    window: "Rolling 30 days",
  },
  {
    title: "Needs Attention",
    description:
      "The category with the lowest completion rate — a place where small, consistent steps can help most.",
    window: "Rolling 30 days",
  },
  {
    title: "Score Trend",
    description:
      "Your Rizen Score recalculated each day using a rolling 30-day window, plotted over the last 30 days.",
    window: "Daily rolling 30 days",
  },
] as const;

export const INSIGHTS_READINESS_NOTE =
  "Insights unlock once you have at least one habit and either 3+ total completions or any completion rate above 0%.";
