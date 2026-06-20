"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchCategories,
  fetchCategory,
  fetchCategoryAnalytics,
  fetchCategoryHabitCounts,
} from "@/lib/categories/api";
import { categoriesKeys } from "@/lib/categories/keys";
import type { CategoryType } from "@/types/database";

export function useCategories(categoryType?: CategoryType) {
  return useQuery({
    queryKey: categoryType
      ? categoriesKeys.byType(categoryType)
      : categoriesKeys.all,
    queryFn: () => fetchCategories(categoryType),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => fetchCategory(id),
    enabled: Boolean(id),
  });
}

export function useCategoryAnalytics(id: string) {
  return useQuery({
    queryKey: categoriesKeys.analytics(id),
    queryFn: () => fetchCategoryAnalytics(id),
    enabled: Boolean(id),
  });
}

export function useCategoryHabitCounts() {
  return useQuery({
    queryKey: categoriesKeys.habitCounts,
    queryFn: fetchCategoryHabitCounts,
  });
}
