import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  CigaretteOff,
  Coffee,
  DollarSign,
  Dumbbell,
  Flame,
  Gamepad2,
  GraduationCap,
  Hamburger,
  Headphones,
  HeartPulse,
  Leaf,
  Moon,
  Pencil,
  Smartphone,
  Sparkles,
  StretchHorizontal,
  Target,
  Wine,
  Zap,
  type LucideProps,
} from "lucide-react";

export type IconName =
  | "book-open"
  | "brain"
  | "cigarette-off"
  | "coffee"
  | "dollar-sign"
  | "dumbbell"
  | "flame"
  | "gamepad-2"
  | "graduation-cap"
  | "hamburger"
  | "headphones"
  | "heart-pulse"
  | "leaf"
  | "moon"
  | "pencil"
  | "smartphone"
  | "sparkles"
  | "stretch-horizontal"
  | "target"
  | "wine"
  | "zap";

export type IconTone =
  | "orange"
  | "rose"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "slate";

export const ICON_REGISTRY: Record<
  IconName,
  { icon: LucideIcon; label: string; tone: IconTone }
> = {
  "book-open": { icon: BookOpen, label: "Book", tone: "orange" },
  brain: { icon: Brain, label: "Brain", tone: "violet" },
  "cigarette-off": { icon: CigaretteOff, label: "No smoking", tone: "slate" },
  coffee: { icon: Coffee, label: "Coffee", tone: "amber" },
  "dollar-sign": { icon: DollarSign, label: "Finance", tone: "emerald" },
  dumbbell: { icon: Dumbbell, label: "Fitness", tone: "rose" },
  flame: { icon: Flame, label: "Energy", tone: "orange" },
  "gamepad-2": { icon: Gamepad2, label: "Gaming", tone: "violet" },
  "graduation-cap": { icon: GraduationCap, label: "Learning", tone: "sky" },
  hamburger: { icon: Hamburger, label: "Food", tone: "amber" },
  headphones: { icon: Headphones, label: "Audio", tone: "sky" },
  "heart-pulse": { icon: HeartPulse, label: "Health", tone: "rose" },
  leaf: { icon: Leaf, label: "Mindfulness", tone: "emerald" },
  moon: { icon: Moon, label: "Sleep", tone: "violet" },
  pencil: { icon: Pencil, label: "Journal", tone: "orange" },
  smartphone: { icon: Smartphone, label: "Phone", tone: "slate" },
  sparkles: { icon: Sparkles, label: "Growth", tone: "orange" },
  "stretch-horizontal": {
    icon: StretchHorizontal,
    label: "Stretch",
    tone: "sky",
  },
  target: { icon: Target, label: "Goal", tone: "orange" },
  wine: { icon: Wine, label: "Alcohol", tone: "rose" },
  zap: { icon: Zap, label: "Productivity", tone: "sky" },
};

export const ICON_PICKER_OPTIONS = Object.entries(ICON_REGISTRY).map(
  ([name, meta]) => ({
    name: name as IconName,
    ...meta,
  }),
);

export const DEFAULT_BUILD_ICON: IconName = "sparkles";
export const DEFAULT_QUIT_ICON: IconName = "target";

export const ICON_TONE_CLASSES: Record<
  IconTone,
  { bg: string; text: string }
> = {
  orange: {
    bg: "bg-orange-100 dark:bg-orange-950/50",
    text: "text-orange-600 dark:text-orange-400",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-950/50",
    text: "text-rose-600 dark:text-rose-400",
  },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    bg: "bg-sky-100 dark:bg-sky-950/50",
    text: "text-sky-600 dark:text-sky-400",
  },
  violet: {
    bg: "bg-violet-100 dark:bg-violet-950/50",
    text: "text-violet-600 dark:text-violet-400",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-950/50",
    text: "text-amber-600 dark:text-amber-400",
  },
  slate: {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-600 dark:text-slate-300",
  },
};

export function resolveIconName(
  icon: string | null | undefined,
  habitType: "build" | "quit" = "build",
): IconName {
  if (icon && icon in ICON_REGISTRY) {
    return icon as IconName;
  }
  return habitType === "quit" ? DEFAULT_QUIT_ICON : DEFAULT_BUILD_ICON;
}

export function getLucideIcon(
  icon: string | null | undefined,
  habitType: "build" | "quit" = "build",
): LucideIcon {
  return ICON_REGISTRY[resolveIconName(icon, habitType)].icon;
}

export type IconDisplayProps = LucideProps;
