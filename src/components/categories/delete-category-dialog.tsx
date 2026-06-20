"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCategory } from "@/hooks/use-update-category";
import type { Category } from "@/types/database";

type DeleteCategoryDialogProps = {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();

  async function handleDelete() {
    if (!category) return;

    try {
      await deleteCategory.mutateAsync(category.id);
      onOpenChange(false);
    } catch {
      // Error surfaced via mutation state if needed later.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete{" "}
            <span className="font-medium text-foreground">{category?.name}</span>.
            Habits in this category will remain but lose their category link.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteCategory.error && (
          <p className="text-destructive text-sm" role="alert">
            {deleteCategory.error.message}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteCategory.isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
          >
            {deleteCategory.isPending ? "Deleting…" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
