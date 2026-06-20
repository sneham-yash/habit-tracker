"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteCategory,
  updateCategory,
} from "@/lib/categories/api";
import { categoriesKeys } from "@/lib/categories/keys";
import type { IconName } from "@/constants/icons";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
      icon,
    }: {
      id: string;
      name?: string;
      icon?: IconName | null;
    }) => updateCategory(id, { name, icon }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.habitCounts });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.habitCounts });
    },
  });
}
