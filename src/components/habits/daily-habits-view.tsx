"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { HabitFilterTabs } from "@/components/dashboard/habit-filter-tabs";
import { TodayProgress } from "@/components/dashboard/today-progress";
import { TodayHabitList } from "@/components/dashboard/today-habit-list";
import { WeekCalendarStrip } from "@/components/dashboard/week-calendar-strip";
import { Button } from "@/components/ui/button";
import {
  filterHabitsByTab,
  getHabitTabCounts,
} from "@/lib/habits/filter";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import {
  useTodayHabits,
  useToggleHabitCompletion,
} from "@/hooks/use-dashboard";
import { useHabits } from "@/hooks/use-habits";
import { useUiStore } from "@/stores/ui-store";

type DailyHabitsViewProps = {
  showCreateButton?: boolean;
};

export function DailyHabitsView({ showCreateButton = true }: DailyHabitsViewProps) {
  const homeTab = useUiStore((s) => s.homeTab);
  const setHomeTab = useUiStore((s) => s.setHomeTab);
  const selectedDate = useUiStore((s) => s.selectedDate);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const { data: allHabits, isLoading: habitsLoading } = useHabits();
  const { data: todayHabits, isLoading, error } = useTodayHabits(selectedDate);
  const toggleCompletion = useToggleHabitCompletion(selectedDate);
  const [pendingHabitId, setPendingHabitId] = useState<string>();

  const allToday = useMemo(() => todayHabits ?? [], [todayHabits]);
  const filteredHabits = useMemo(
    () => filterHabitsByTab(allToday, homeTab),
    [allToday, homeTab],
  );
  const tabCounts = useMemo(() => getHabitTabCounts(allToday), [allToday]);
  const hasAnyHabits = (allHabits?.length ?? 0) > 0;
  const completedAll = allToday.filter((h) => h.completed).length;
  const totalAll = allToday.length;
  const totalFiltered = filteredHabits.length;

  async function handleToggle(habitId: string) {
    setPendingHabitId(habitId);
    try {
      await toggleCompletion.mutateAsync(habitId);
    } finally {
      setPendingHabitId(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <WeekCalendarStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {isLoading || habitsLoading ? (
        <p className="text-muted-foreground text-sm">Loading today&apos;s habits…</p>
      ) : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      {!isLoading && !habitsLoading && !error && hasAnyHabits && totalAll > 0 ? (
        <TodayProgress
          completedCount={completedAll}
          totalCount={totalAll}
          compact
        />
      ) : null}

      {!isLoading && !habitsLoading && !error && hasAnyHabits ? (
        <HabitFilterTabs
          value={homeTab}
          onChange={setHomeTab}
          counts={tabCounts}
        />
      ) : null}

      {!isLoading && !habitsLoading && !error && !hasAnyHabits ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className={typography.bodyText}>One step starts here</p>
          <p className={cn(typography.bodyMuted, "mt-1")}>
            Create your first habit to begin your transformation.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/create">
              <PlusIcon />
              Create habit
            </Link>
          </Button>
        </div>
      ) : null}

      {!isLoading && !habitsLoading && !error && hasAnyHabits && totalFiltered === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className={typography.bodyText}>Nothing in this view today</p>
          <p className={cn(typography.bodyMuted, "mt-1")}>
            No {homeTab === "all" ? "" : `${homeTab} `}habits scheduled for today.
          </p>
        </div>
      ) : null}

      {!isLoading && !habitsLoading && !error && totalFiltered > 0 ? (
        <TodayHabitList
          habits={filteredHabits}
          pendingHabitId={pendingHabitId}
          onToggle={handleToggle}
        />
      ) : null}

      {showCreateButton && hasAnyHabits ? (
        <Button className="w-full" asChild>
          <Link href="/create">
            <PlusIcon />
            New Habit
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
