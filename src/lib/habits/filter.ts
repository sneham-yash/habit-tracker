import type { HabitFilterTab } from "@/constants/habits";

export function filterHabitsByTab<T extends { habit_type?: string }>(
  habits: T[],
  tab: HabitFilterTab,
): T[] {
  if (tab === "all") return habits;
  return habits.filter((habit) => (habit.habit_type ?? "build") === tab);
}

export function getHabitTabCounts<T extends { habit_type?: string }>(
  habits: T[],
): Record<HabitFilterTab, number> {
  const build = habits.filter((h) => (h.habit_type ?? "build") === "build");
  const quit = habits.filter((h) => h.habit_type === "quit");
  return {
    all: habits.length,
    build: build.length,
    quit: quit.length,
  };
}
