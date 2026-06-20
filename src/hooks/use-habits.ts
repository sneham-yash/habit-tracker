"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveHabit,
  createHabit,
  permanentlyDeleteHabit,
  fetchHabits,
  updateHabit,
  type HabitFormValues,
} from "@/lib/habits/api";
import { habitsKeys } from "@/lib/habits/keys";
import { insightsKeys } from "@/lib/analytics/keys";
import { categoriesKeys } from "@/lib/categories/keys";

export function useHabits() {
  return useQuery({
    queryKey: habitsKeys.all,
    queryFn: fetchHabits,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: HabitFormValues) => createHabit(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.all });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.habitCounts });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: HabitFormValues }) =>
      updateHabit(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.all });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.habitCounts });
    },
  });
}

export function useArchiveHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.all });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.habitCounts });
    },
  });
}

export function usePermanentlyDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permanentlyDeleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.all });
      queryClient.invalidateQueries({ queryKey: insightsKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.habitCounts });
    },
  });
}
