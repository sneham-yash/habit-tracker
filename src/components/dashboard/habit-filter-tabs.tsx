"use client";

import type { HabitFilterTab } from "@/constants/habits";
import { HABIT_FILTER_TABS } from "@/constants/habits";
import { cn } from "@/lib/utils";

type HabitFilterTabsProps = {
  value: HabitFilterTab;
  onChange: (value: HabitFilterTab) => void;
};

export function HabitFilterTabs({ value, onChange }: HabitFilterTabsProps) {
  return (
    <div
      className="bg-muted inline-flex w-full rounded-lg p-1"
      role="tablist"
      aria-label="Filter habits"
    >
      {HABIT_FILTER_TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
