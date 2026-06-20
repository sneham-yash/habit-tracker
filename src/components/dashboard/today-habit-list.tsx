"use client";

import { CheckIcon } from "lucide-react";

import { HabitIcon } from "@/components/icons/habit-icon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TodayHabit } from "@/lib/habit-logs/api";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type TodayHabitListProps = {
  habits: TodayHabit[];
  pendingHabitId?: string;
  onToggle: (habitId: string) => void;
  showSectionTitle?: boolean;
};

function getHabitSubtitle(habit: TodayHabit): string {
  const habitType = habit.habit_type ?? "build";

  if (habit.completed) {
    return habitType === "quit" ? "Stayed clean" : "Completed";
  }

  if (habitType === "build" && habit.target_minutes) {
    return `${habit.target_minutes} min`;
  }

  return habit.description || "Tap to mark progress";
}

export function TodayHabitList({
  habits,
  pendingHabitId,
  onToggle,
  showSectionTitle = true,
}: TodayHabitListProps) {
  return (
    <section className="space-y-3">
      {showSectionTitle ? (
        <h2 className={typography.sectionTitle}>Today&apos;s Habits</h2>
      ) : null}
      <div className="grid gap-3">
        {habits.map((habit) => {
          const isPending = pendingHabitId === habit.id;
          const habitType = habit.habit_type ?? "build";

          return (
            <Card key={habit.id} className="py-0">
              <CardHeader className="!flex min-w-0 flex-row items-center gap-3 space-y-0 py-4">
                <HabitIcon
                  icon={habit.icon}
                  habitType={habitType}
                  size="md"
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <CardTitle
                      className={cn(
                        "min-w-0 flex-1 truncate text-base",
                        habit.completed && "text-muted-foreground line-through",
                      )}
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
                  <CardDescription
                    className="truncate"
                    title={getHabitSubtitle(habit)}
                  >
                    {getHabitSubtitle(habit)}
                  </CardDescription>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onToggle(habit.id)}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    habit.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-muted-foreground/30 hover:border-primary/50",
                    isPending && "opacity-50",
                  )}
                  aria-label={
                    habit.completed
                      ? `Mark ${habit.name} incomplete`
                      : habitType === "quit"
                        ? `Mark ${habit.name} as stayed clean today`
                        : `Mark ${habit.name} complete`
                  }
                >
                  {habit.completed ? <CheckIcon className="size-4" /> : null}
                </button>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
