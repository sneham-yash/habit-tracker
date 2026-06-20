"use client";

import { DailyHabitsView } from "@/components/habits/daily-habits-view";
import { typography } from "@/lib/typography";

export function DailyHabitsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Habits</h1>
        <p className={typography.screenSubtitle}>What should I do today?</p>
      </div>
      <DailyHabitsView />
    </div>
  );
}
