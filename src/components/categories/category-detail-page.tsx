"use client";

import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { TodayHabitList } from "@/components/dashboard/today-habit-list";
import { HabitIcon } from "@/components/icons/habit-icon";
import { MiniMetricTile, ScoreRing } from "@/components/metrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CATEGORY_TYPE_LABELS } from "@/constants/habits";
import {
  useCategory,
  useCategoryAnalytics,
} from "@/hooks/use-categories";
import { fetchHabitsByCategory } from "@/lib/habits/api";
import { getTodayDateString } from "@/lib/habits/constants";
import {
  useTodayHabits,
  useToggleHabitCompletion,
} from "@/hooks/use-dashboard";
import { calculateRizenScore } from "@/lib/analytics/rizen-score";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

type CategoryDetailPageProps = {
  categoryId: string;
};

export function CategoryDetailPage({ categoryId }: CategoryDetailPageProps) {
  const today = getTodayDateString();
  const { data: category, isLoading: categoryLoading } =
    useCategory(categoryId);
  const { data: analytics, isLoading: analyticsLoading } =
    useCategoryAnalytics(categoryId);
  const { data: habits } = useQuery({
    queryKey: ["habits", "category", categoryId],
    queryFn: () => fetchHabitsByCategory(categoryId),
  });
  const { data: todayHabits } = useTodayHabits(today);
  const toggleCompletion = useToggleHabitCompletion(today);
  const [pendingHabitId, setPendingHabitId] = useState<string>();

  const categoryTodayHabits = useMemo(() => {
    const ids = new Set((habits ?? []).map((h) => h.id));
    return (todayHabits ?? []).filter((h) => ids.has(h.id));
  }, [habits, todayHabits]);

  const categoryScore = useMemo(() => {
    if (analytics) {
      return calculateRizenScore({
        completionRate: analytics.completion_rate,
        currentStreak: analytics.best_streak,
        buildSuccessRate:
          analytics.category_type === "build" ? analytics.completion_rate : 0,
        quitSuccessRate:
          analytics.category_type === "quit" ? analytics.completion_rate : 0,
        growthTrend: 0,
      });
    }
    return 0;
  }, [analytics]);

  async function handleToggle(habitId: string) {
    setPendingHabitId(habitId);
    try {
      await toggleCompletion.mutateAsync(habitId);
    } finally {
      setPendingHabitId(undefined);
    }
  }

  if (categoryLoading) {
    return <p className={typography.bodyMuted}>Loading category…</p>;
  }

  if (!category) {
    return <p className="text-destructive text-sm">Category not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings/categories">
            <ArrowLeftIcon />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <HabitIcon
              icon={category.icon}
              habitType={category.category_type}
              categoryName={category.name}
              size="lg"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={cn(typography.screenTitle, "truncate")}>
                  {category.name}
                </h1>
                <Badge
                  variant={
                    category.category_type === "build" ? "default" : "secondary"
                  }
                >
                  {CATEGORY_TYPE_LABELS[category.category_type]}
                </Badge>
              </div>
              <p className={typography.bodyMuted}>
                {analytics?.habit_count ?? habits?.length ?? 0} habits
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/20 gap-3 py-4">
        <CardContent className="px-4">
          <div className="flex items-center gap-4">
            <ScoreRing
              score={analyticsLoading ? 0 : categoryScore}
              size="sm"
            />
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className={typography.metricLabel}>Category Score</p>
              <p className={typography.metricValueSm}>
                {analyticsLoading ? "…" : categoryScore}
                <span
                  className={cn(
                    typography.bodyMuted,
                    "ml-1.5 text-base font-normal",
                  )}
                >
                  / 100
                </span>
              </p>
              <p className={cn(typography.bodyMuted, "text-sm")}>
                {analytics
                  ? `${Math.round(analytics.completion_rate)}% completion over the last 30 days`
                  : "Complete habits to build your score"}
              </p>
            </div>
          </div>
          {analytics ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniMetricTile
                metricKey="completionRate"
                value={`${Math.round(analytics.completion_rate)}%`}
                align="left"
              />
              <MiniMetricTile
                metricKey="currentStreak"
                value={`${analytics.best_streak} days`}
                align="left"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      {categoryTodayHabits.length > 0 ? (
        <TodayHabitList
          habits={categoryTodayHabits}
          pendingHabitId={pendingHabitId}
          onToggle={handleToggle}
          showSectionTitle={false}
        />
      ) : (
        <div className={cn("rounded-xl border border-dashed p-6 text-center", typography.bodyMuted)}>
          No habits due today in this category.
        </div>
      )}

      <Button className="w-full" asChild>
        <Link href={`/create?category=${categoryId}&type=${category.category_type}`}>
          <PlusIcon />
          Add habit
        </Link>
      </Button>
    </div>
  );
}
