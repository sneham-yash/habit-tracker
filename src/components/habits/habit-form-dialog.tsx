"use client";

import { useEffect, useState } from "react";

import { HabitTypeSelector } from "@/components/create/habit-type-selector";
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
import type { Habit, HabitType } from "@/types/database";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [habitType, setHabitType] = useState<HabitType>("build");

  const isEditing = Boolean(habit);
  const isPending = createHabit.isPending || updateHabit.isPending;
  const showTypeSelector = !isEditing && step === 1;

  useEffect(() => {
    if (open) {
      setStep(isEditing ? 2 : 1);
      setHabitType("build");
      setError(null);
    }
  }, [open, isEditing]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setStep(1);
      setHabitType("build");
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(values: HabitFormValues) {
    setError(null);

    try {
      if (habit) {
        await updateHabit.mutateAsync({ id: habit.id, values });
      } else {
        await createHabit.mutateAsync(values);
      }

      handleOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit habit" : "Create habit"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your habit details below."
              : showTypeSelector
                ? "Choose the kind of habit you want to track."
                : "Add a new habit to track."}
          </DialogDescription>
        </DialogHeader>

        {showTypeSelector ? (
          <HabitTypeSelector
            value={habitType}
            onChange={setHabitType}
            onContinue={() => setStep(2)}
          />
        ) : (
          <HabitForm
            key={habit?.id ?? `new-${habitType}`}
            habit={habit}
            habitType={habitType}
            onSubmit={handleSubmit}
            onCancel={() =>
              isEditing ? handleOpenChange(false) : setStep(1)
            }
            isPending={isPending}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
