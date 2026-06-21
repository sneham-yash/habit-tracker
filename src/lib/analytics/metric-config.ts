import type { LucideIcon } from "lucide-react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleCheckIcon,
  FlameIcon,
  FocusIcon,
  FootprintsIcon,
  LineChartIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";

export type MetricKey =
  | "rizenScore"
  | "transformation"
  | "stepsForward"
  | "currentStreak"
  | "longestStreak"
  | "completionRate"
  | "buildScore"
  | "quitScore"
  | "buildSuccess"
  | "quitSuccess"
  | "growthTrend"
  | "strongestCategory"
  | "needsAttention"
  | "scoreTrend"
  | "categoryScore";

export type MetricTone = "positive" | "neutral" | "attention" | "primary";

export type MetricConfig = {
  key: MetricKey;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  tone: MetricTone;
};

const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {
  rizenScore: {
    key: "rizenScore",
    label: "Rizen Score",
    icon: TargetIcon,
    tone: "primary",
  },
  transformation: {
    key: "transformation",
    label: "Transformation",
    shortLabel: "Growth",
    icon: TrendingUpIcon,
    tone: "positive",
  },
  stepsForward: {
    key: "stepsForward",
    label: "Steps Forward",
    shortLabel: "Steps",
    icon: FootprintsIcon,
    tone: "neutral",
  },
  currentStreak: {
    key: "currentStreak",
    label: "Current Streak",
    shortLabel: "Streak",
    icon: FlameIcon,
    tone: "primary",
  },
  longestStreak: {
    key: "longestStreak",
    label: "Longest Streak",
    shortLabel: "Longest",
    icon: FlameIcon,
    tone: "primary",
  },
  completionRate: {
    key: "completionRate",
    label: "Completion Rate",
    shortLabel: "Completion",
    icon: CircleCheckIcon,
    tone: "neutral",
  },
  buildScore: {
    key: "buildScore",
    label: "Build Score",
    shortLabel: "Build",
    icon: ArrowUpIcon,
    tone: "positive",
  },
  quitScore: {
    key: "quitScore",
    label: "Quit Score",
    shortLabel: "Quit",
    icon: ArrowDownIcon,
    tone: "neutral",
  },
  buildSuccess: {
    key: "buildSuccess",
    label: "Build Success",
    shortLabel: "Build",
    icon: ArrowUpIcon,
    tone: "positive",
  },
  quitSuccess: {
    key: "quitSuccess",
    label: "Quit Success",
    shortLabel: "Quit",
    icon: ArrowDownIcon,
    tone: "neutral",
  },
  growthTrend: {
    key: "growthTrend",
    label: "Growth Trend",
    shortLabel: "Growth",
    icon: TrendingUpIcon,
    tone: "positive",
  },
  strongestCategory: {
    key: "strongestCategory",
    label: "Strongest Category",
    icon: TrophyIcon,
    tone: "positive",
  },
  needsAttention: {
    key: "needsAttention",
    label: "Needs Attention",
    icon: FocusIcon,
    tone: "attention",
  },
  scoreTrend: {
    key: "scoreTrend",
    label: "Rizen Score Trend",
    icon: LineChartIcon,
    tone: "neutral",
  },
  categoryScore: {
    key: "categoryScore",
    label: "Category Score",
    icon: TargetIcon,
    tone: "primary",
  },
};

/** Maps metric guide definition titles to config keys. */
export const METRIC_DEFINITION_KEYS: MetricKey[] = [
  "completionRate",
  "buildScore",
  "quitScore",
  "currentStreak",
  "transformation",
  "stepsForward",
  "strongestCategory",
  "needsAttention",
  "scoreTrend",
];

export function getMetricConfig(key: MetricKey): MetricConfig {
  return METRIC_CONFIG[key];
}

export function getTransformationIcon(value: number): LucideIcon {
  if (value < 0) return TrendingDownIcon;
  return TrendingUpIcon;
}

export function getMetricToneClass(tone: MetricTone): string {
  switch (tone) {
    case "positive":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "attention":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "primary":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getTrendValueClass(value: number): string {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-muted-foreground";
  return "text-foreground";
}
