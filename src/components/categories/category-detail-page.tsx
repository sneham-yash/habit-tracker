"use client";

import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { TodayHabitList } from "@/components/dashboard/today-habit-list";
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
    return <p className="text-muted-foreground text-sm">Loading category…</p>;
  }

  if (!category) {
    return <p className="text-destructive text-sm">Category not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/categories">
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
                <h1 className="truncate text-2xl font-bold">{category.name}</h1>
                <Badge
                  variant={
                    category.category_type === "build" ? "default" : "secondary"
                  }
                >
                  {CATEGORY_TYPE_LABELS[category.category_type]}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {analytics?.habit_count ?? habits?.length ?? 0} habits
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardDescription>Category score</CardDescription>
          <CardTitle className="text-3xl">
            {analyticsLoading ? "…" : categoryScore}
            <span className="text-muted-foreground ml-2 text-base font-normal">
              / 100
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {analytics
              ? `${Math.round(analytics.completion_rate)}% completion over the last 30 days`
              : "Complete habits to build your score"}
          </p>
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
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
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
