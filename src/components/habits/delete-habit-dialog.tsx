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
import { useDeleteHabit } from "@/hooks/use-habits";
import type { Habit } from "@/types/database";

type DeleteHabitDialogProps = {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteHabitDialog({
  habit,
  open,
  onOpenChange,
}: DeleteHabitDialogProps) {
  const deleteHabit = useDeleteHabit();

  async function handleDelete() {
    if (!habit) {
      return;
    }

    try {
      await deleteHabit.mutateAsync(habit.id);
      onOpenChange(false);
    } catch {
      // Error surfaced via mutation state if needed later.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive habit?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive{" "}
            <span className="font-medium text-foreground">{habit?.name}</span>.
            Your completion history is preserved for Steps Forward.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteHabit.error && (
          <p className="text-destructive text-sm" role="alert">
            {deleteHabit.error.message}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteHabit.isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteHabit.isPending}
          >
            {deleteHabit.isPending ? "Archiving…" : "Archive"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
