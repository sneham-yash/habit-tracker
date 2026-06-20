"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { HabitFilterTabs } from "@/components/dashboard/habit-filter-tabs";
import {
  getHomeGreeting,
  HomeHeader,
} from "@/components/dashboard/home-header";
import { RizenHeroCard } from "@/components/dashboard/rizen-hero-card";
import { TodayHabitList } from "@/components/dashboard/today-habit-list";
import { WeekCalendarStrip } from "@/components/dashboard/week-calendar-strip";
import { Button } from "@/components/ui/button";
import type { HabitFilterTab } from "@/constants/habits";
import { calculateRizenScore } from "@/lib/analytics/rizen-score";
import { formatTodayLabel } from "@/lib/dates";
import { useInsights } from "@/hooks/use-insights";
import { useHabits } from "@/hooks/use-habits";
import {
  useTodayHabits,
  useToggleHabitCompletion,
} from "@/hooks/use-dashboard";
import { useUiStore } from "@/stores/ui-store";

function filterHabitsByTab<T extends { habit_type?: string }>(
  habits: T[],
  tab: HabitFilterTab,
): T[] {
  if (tab === "all") return habits;
  return habits.filter((habit) => (habit.habit_type ?? "build") === tab);
}

type DashboardPageProps = {
  displayName?: string | null;
};

export function DashboardPage({ displayName }: DashboardPageProps) {
  const homeTab = useUiStore((s) => s.homeTab);
  const setHomeTab = useUiStore((s) => s.setHomeTab);
  const selectedDate = useUiStore((s) => s.selectedDate);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const { data: allHabits, isLoading: habitsLoading } = useHabits();
  const { data: todayHabits, isLoading, error } = useTodayHabits(selectedDate);
  const { data: insightsData } = useInsights();
  const toggleCompletion = useToggleHabitCompletion(selectedDate);
  const [pendingHabitId, setPendingHabitId] = useState<string>();

  const filteredHabits = useMemo(
    () => filterHabitsByTab(todayHabits ?? [], homeTab),
    [todayHabits, homeTab],
  );

  const allToday = useMemo(() => todayHabits ?? [], [todayHabits]);
  const completedCount = filteredHabits.filter((h) => h.completed).length;
  const totalCount = filteredHabits.length;
  const hasAnyHabits = (allHabits?.length ?? 0) > 0;

  const todayRizenScore = useMemo(() => {
    if (insightsData?.insights) return insightsData.insights.rizenScore;
    const build = allToday.filter((h) => (h.habit_type ?? "build") === "build");
    const quit = allToday.filter((h) => h.habit_type === "quit");
    const rate =
      allToday.length === 0
        ? 0
        : (allToday.filter((h) => h.completed).length / allToday.length) * 100;
    const buildRate =
      build.length === 0
        ? 0
        : (build.filter((h) => h.completed).length / build.length) * 100;
    const quitRate =
      quit.length === 0
        ? 0
        : (quit.filter((h) => h.completed).length / quit.length) * 100;
    return calculateRizenScore({
      completionRate: rate,
      currentStreak: 0,
      buildSuccessRate: buildRate,
      quitSuccessRate: quitRate,
      growthTrend: 0,
    });
  }, [allToday, insightsData]);

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
      <HomeHeader
        greeting={getHomeGreeting(displayName)}
        dateLabel={formatTodayLabel(selectedDate)}
      />

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

      {!isLoading && !habitsLoading && !error && hasAnyHabits ? (
        <>
          <RizenHeroCard
            rizenScore={todayRizenScore}
            completedCount={completedCount}
            totalCount={totalCount || allToday.length}
          />
          <HabitFilterTabs value={homeTab} onChange={setHomeTab} />
        </>
      ) : null}

      {!isLoading && !habitsLoading && !error && !hasAnyHabits ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">One step starts here</p>
          <p className="text-muted-foreground mt-1 text-sm">
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

      {!isLoading && !habitsLoading && !error && hasAnyHabits && totalCount === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">Nothing in this view today</p>
          <p className="text-muted-foreground mt-1 text-sm">
            No {homeTab === "all" ? "" : `${homeTab} `}habits scheduled for today.
          </p>
        </div>
      ) : null}

      {!isLoading && !habitsLoading && !error && totalCount > 0 ? (
        <TodayHabitList
          habits={filteredHabits}
          pendingHabitId={pendingHabitId}
          onToggle={handleToggle}
        />
      ) : null}

      {hasAnyHabits ? (
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
