"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory } from "@/lib/categories/api";
import { categoriesKeys } from "@/lib/categories/keys";
import type { CategoryType } from "@/types/database";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      categoryType,
      icon,
    }: {
      name: string;
      categoryType: CategoryType;
      icon?: string | null;
    }) => createCategory(name, categoryType, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}
