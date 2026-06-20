"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { DeleteHabitDialog } from "@/components/habits/delete-habit-dialog";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { HabitList } from "@/components/habits/habit-list";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/hooks/use-habits";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/database";

export function HabitsPage() {
  const { data: habits, isLoading, error } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>();

  function openCreateDialog() {
    setSelectedHabit(undefined);
    setFormOpen(true);
  }

  function openEditDialog(habit: Habit) {
    setSelectedHabit(habit);
    setFormOpen(true);
  }

  function openDeleteDialog(habit: Habit) {
    setSelectedHabit(habit);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className={typography.screenTitle}>Habits</h1>
          <p className={typography.screenSubtitle}>
            Create and manage the habits you want to track.
          </p>
        </div>

        <Button onClick={openCreateDialog}>
          <PlusIcon />
          New habit
        </Button>
      </div>

      {isLoading && (
        <p className={typography.bodyMuted}>Loading habits…</p>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      )}

      {!isLoading && !error && habits?.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className={typography.bodyText}>No habits yet</p>
          <p className={cn(typography.bodyMuted, "mt-1")}>
            Create your first habit to get started.
          </p>
          <Button className="mt-4" onClick={openCreateDialog}>
            <PlusIcon />
            Create habit
          </Button>
        </div>
      )}

      {!isLoading && !error && habits && habits.length > 0 && (
        <HabitList
          habits={habits}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      )}

      <HabitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        habit={selectedHabit}
      />

      <DeleteHabitDialog
        habit={selectedHabit ?? null}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
