import type { Habit } from "@/types/database";

function getIsoDayOfWeek(dateString: string): number {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

export function isHabitScheduled(habit: Habit, date: string): boolean {
  if (date < habit.start_date) {
    return false;
  }

  if (habit.frequency === "daily") {
    return true;
  }

  if (habit.frequency === "weekly" || habit.frequency === "custom") {
    const days = habit.frequency_days ?? [1, 2, 3, 4, 5, 6, 7];
    return days.includes(getIsoDayOfWeek(date));
  }

  return false;
}
