import { fetchHabits } from "@/lib/habits/api";
import { isHabitScheduled } from "@/lib/habits/schedule";
import { createClient } from "@/lib/supabase/client";
import type { Habit } from "@/types/database";

export type TodayHabit = Habit & {
  completed: boolean;
};

export async function fetchTodayHabits(date: string): Promise<TodayHabit[]> {
  const habits = await fetchHabits();
  const scheduled = habits.filter((habit) => isHabitScheduled(habit, date));

  if (scheduled.length === 0) {
    return [];
  }

  const supabase = createClient();
  const habitIds = scheduled.map((habit) => habit.id);
  const { data: logs, error } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .eq("completed_date", date)
    .in("habit_id", habitIds);

  if (error) {
    throw new Error(error.message);
  }

  const completedIds = new Set((logs ?? []).map((log) => log.habit_id));

  return scheduled.map((habit) => ({
    ...habit,
    completed: completedIds.has(habit.id),
  }));
}

export async function toggleHabitCompletion(
  habitId: string,
  date: string,
): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("toggle_habit_completion", {
    p_habit_id: habitId,
    p_date: date,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
