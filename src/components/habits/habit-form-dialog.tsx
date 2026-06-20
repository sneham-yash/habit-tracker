"use client";

import { useState } from "react";

import { HabitForm } from "@/components/habits/habit-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { HabitFormValues } from "@/lib/habits/api";
import { useCreateHabit, useUpdateHabit } from "@/hooks/use-habits";
import type { Habit } from "@/types/database";

type HabitFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
};

export function HabitFormDialog({
  open,
  onOpenChange,
  habit,
}: HabitFormDialogProps) {
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(habit);
  const isPending = createHabit.isPending || updateHabit.isPending;

  async function handleSubmit(values: HabitFormValues) {
    setError(null);

    try {
      if (habit) {
        await updateHabit.mutateAsync({ id: habit.id, values });
      } else {
        await createHabit.mutateAsync(values);
      }

      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit habit" : "Create habit"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your habit details below."
              : "Add a new habit to track."}
          </DialogDescription>
        </DialogHeader>

        <HabitForm
          key={habit?.id ?? "new"}
          habit={habit}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
