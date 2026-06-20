"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchTodayHabits,
  toggleHabitCompletion,
  type TodayHabit,
} from "@/lib/habit-logs/api";
import { dashboardKeys } from "@/lib/habit-logs/keys";
import { insightsKeys } from "@/lib/analytics/keys";
import { getTodayDateString } from "@/lib/habits/constants";

export function useTodayHabits(date = getTodayDateString()) {
  return useQuery({
    queryKey: dashboardKeys.today(date),
    queryFn: () => fetchTodayHabits(date),
  });
}

export function useToggleHabitCompletion(date = getTodayDateString()) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => toggleHabitCompletion(habitId, date),
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: dashboardKeys.today(date) });

      const previous = queryClient.getQueryData<TodayHabit[]>(
        dashboardKeys.today(date),
      );

      queryClient.setQueryData<TodayHabit[]>(
        dashboardKeys.today(date),
        (current) =>
          current?.map((habit) =>
            habit.id === habitId
              ? { ...habit, completed: !habit.completed }
              : habit,
          ),
      );

      return { previous };
    },
    onError: (_error, _habitId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(dashboardKeys.today(date), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.today(date) });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
    },
  });
}
