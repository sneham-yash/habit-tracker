"use client";

import { ArchiveIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { HabitIcon } from "@/components/icons/habit-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDisplayDate } from "@/lib/dates";
import { formatFrequencyLabel } from "@/lib/habits/constants";
import type { Habit } from "@/types/database";
import { cn } from "@/lib/utils";

type HabitListProps = {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onArchive: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

function getHabitSubtitle(habit: Habit): string {
  const frequency = formatFrequencyLabel(
    habit.frequency,
    habit.frequency_days,
  );
  const started = formatDisplayDate(habit.start_date, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (habit.description && habit.description.length <= 48) {
    return habit.description;
  }

  return `${frequency} · Started ${started}`;
}

export function HabitList({ habits, onEdit, onArchive, onDelete }: HabitListProps) {
  return (
    <div className="grid gap-2">
      {habits.map((habit) => {
        const habitType = habit.habit_type ?? "build";
        const subtitle = getHabitSubtitle(habit);

        return (
          <Card
            key={habit.id}
            className={cn(
              "gap-0 py-0 shadow-none",
              habitType === "build" ? "border-primary/15" : undefined,
            )}
          >
            <CardHeader className="flex-row items-center gap-3 space-y-0 px-4 py-3">
              <HabitIcon
                icon={habit.icon}
                habitType={habitType}
                size="sm"
                className="shrink-0"
              />

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex min-w-0 items-center gap-2">
                  <CardTitle
                    className="min-w-0 flex-1 truncate text-base"
                    title={habit.name}
                  >
                    {habit.name}
                  </CardTitle>
                  <Badge
                    variant={habitType === "build" ? "default" : "secondary"}
                    className="shrink-0 text-xs"
                  >
                    {habitType === "build" ? "Build" : "Quit"}
                  </Badge>
                </div>
                <CardDescription className="truncate" title={subtitle}>
                  {subtitle}
                </CardDescription>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 px-0"
                  onClick={() => onEdit(habit)}
                  aria-label={`Edit ${habit.name}`}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 px-0"
                  onClick={() => onArchive(habit)}
                  aria-label={`Archive ${habit.name}`}
                >
                  <ArchiveIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 px-0"
                  onClick={() => onDelete(habit)}
                  aria-label={`Delete ${habit.name} permanently`}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
