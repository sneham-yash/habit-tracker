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
import { useArchiveHabit } from "@/hooks/use-habits";
import type { Habit } from "@/types/database";

type ArchiveHabitDialogProps = {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ArchiveHabitDialog({
  habit,
  open,
  onOpenChange,
}: ArchiveHabitDialogProps) {
  const archiveHabit = useArchiveHabit();

  async function handleArchive() {
    if (!habit) {
      return;
    }

    try {
      await archiveHabit.mutateAsync(habit.id);
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

        {archiveHabit.error && (
          <p className="text-destructive text-sm" role="alert">
            {archiveHabit.error.message}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={archiveHabit.isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleArchive}
            disabled={archiveHabit.isPending}
          >
            {archiveHabit.isPending ? "Archiving…" : "Archive"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
