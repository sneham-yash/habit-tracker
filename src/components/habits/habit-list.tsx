"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";

import { HabitIcon } from "@/components/icons/habit-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFrequencyLabel } from "@/lib/habits/constants";
import { typography } from "@/lib/typography";
import type { Habit } from "@/types/database";

type HabitListProps = {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitList({ habits, onEdit, onDelete }: HabitListProps) {
  return (
    <div className="grid gap-4">
      {habits.map((habit) => {
        const habitType = habit.habit_type ?? "build";

        return (
          <Card key={habit.id}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="flex min-w-0 items-start gap-3">
                <HabitIcon
                  icon={habit.icon}
                  habitType={habitType}
                  size="md"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="truncate">{habit.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {habitType === "build" ? "Build" : "Quit"}
                    </Badge>
                  </div>
                  {habit.description && (
                    <CardDescription>{habit.description}</CardDescription>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(habit)}
                  aria-label={`Edit ${habit.name}`}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(habit)}
                  aria-label={`Delete ${habit.name}`}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {formatFrequencyLabel(habit.frequency, habit.frequency_days)}
              </Badge>
              <span className={typography.bodyMuted}>
                Started {habit.start_date}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
