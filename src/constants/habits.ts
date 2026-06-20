import type { CategoryType, HabitType } from "@/types/database";

export const HABIT_TYPE_OPTIONS: {
  value: HabitType;
  label: string;
  description: string;
}[] = [
  {
    value: "build",
    label: "Build Habit",
    description:
      "Create positive routines like reading, exercise, or meditation.",
  },
  {
    value: "quit",
    label: "Quit Habit",
    description:
      "Break negative patterns like smoking, junk food, or social media.",
  },
];

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  build: "Build",
  quit: "Quit",
};

export type HabitFilterTab = "all" | "build" | "quit";

export const HABIT_FILTER_TABS: { value: HabitFilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "build", label: "Build" },
  { value: "quit", label: "Quit" },
];
