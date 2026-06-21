"use client";

import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { HabitFilterTabs } from "@/components/dashboard/habit-filter-tabs";
import { ArchiveHabitDialog } from "@/components/habits/archive-habit-dialog";
import { DeleteHabitDialog } from "@/components/habits/delete-habit-dialog";
import { HabitFormDialog } from "@/components/habits/habit-form-dialog";
import { HabitList } from "@/components/habits/habit-list";
import { Button } from "@/components/ui/button";
import type { HabitFilterTab } from "@/constants/habits";
import { useHabits } from "@/hooks/use-habits";
import {
  filterHabitsByTab,
  getHabitTabCounts,
} from "@/lib/habits/filter";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/database";

const FILTER_EMPTY_MESSAGES: Record<Exclude<HabitFilterTab, "all">, string> = {
  build: "No build habits yet.",
  quit: "No quit habits yet.",
};

export function ManageHabitsPage() {
  const { data: habits, isLoading, error } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>();
  const [filterTab, setFilterTab] = useState<HabitFilterTab>("all");

  const allHabits = habits ?? [];
  const tabCounts = useMemo(() => getHabitTabCounts(allHabits), [allHabits]);
  const filteredHabits = useMemo(
    () => filterHabitsByTab(allHabits, filterTab),
    [allHabits, filterTab],
  );
  const hasHabits = allHabits.length > 0;

  function openCreateDialog() {
    setSelectedHabit(undefined);
    setFormOpen(true);
  }

  function openEditDialog(habit: Habit) {
    setSelectedHabit(habit);
    setFormOpen(true);
  }

  function openArchiveDialog(habit: Habit) {
    setSelectedHabit(habit);
    setArchiveOpen(true);
  }

  function openDeleteDialog(habit: Habit) {
    setSelectedHabit(habit);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-4">
      <Link
        href="/settings"
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Settings
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className={typography.screenTitle}>Manage Habits</h1>
          <p className={typography.screenSubtitle}>
            Edit, archive, or delete your habits.
          </p>
          {hasHabits ? (
            <p className={typography.metricLabel}>
              {allHabits.length}{" "}
              {allHabits.length === 1 ? "habit" : "habits"}
            </p>
          ) : null}
        </div>

        <Button size="icon" variant="outline" onClick={openCreateDialog}>
          <PlusIcon />
          <span className="sr-only">New habit</span>
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

      {!isLoading && !error && hasHabits ? (
        <HabitFilterTabs
          value={filterTab}
          onChange={setFilterTab}
          counts={tabCounts}
        />
      ) : null}

      {!isLoading && !error && !hasHabits ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className={typography.bodyText}>No habits yet</p>
          <p className={cn(typography.bodyMuted, "mt-1")}>
            Create your first build or quit habit to get started.
          </p>
          <Button className="mt-4" size="sm" onClick={openCreateDialog}>
            <PlusIcon />
            Create habit
          </Button>
        </div>
      ) : null}

      {!isLoading && !error && hasHabits && filteredHabits.length === 0 ? (
        <p className={cn(typography.bodyMuted, "text-center py-6")}>
          {filterTab === "all"
            ? "No habits match this filter."
            : FILTER_EMPTY_MESSAGES[filterTab]}
        </p>
      ) : null}

      {!isLoading && !error && filteredHabits.length > 0 ? (
        <HabitList
          habits={filteredHabits}
          onEdit={openEditDialog}
          onArchive={openArchiveDialog}
          onDelete={openDeleteDialog}
        />
      ) : null}

      <HabitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        habit={selectedHabit}
      />

      <ArchiveHabitDialog
        habit={selectedHabit ?? null}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
      />

      <DeleteHabitDialog
        habit={selectedHabit ?? null}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
