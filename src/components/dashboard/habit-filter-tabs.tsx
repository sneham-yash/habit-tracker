"use client";

import type { HabitFilterTab } from "@/constants/habits";
import { HABIT_FILTER_TABS } from "@/constants/habits";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type HabitFilterTabsProps = {
  value: HabitFilterTab;
  onChange: (value: HabitFilterTab) => void;
  counts?: Partial<Record<HabitFilterTab, number>>;
};

function formatTabLabel(
  label: string,
  count: number | undefined,
): string {
  if (count !== undefined && count > 0) {
    return `${label} (${count})`;
  }
  return label;
}

export function HabitFilterTabs({
  value,
  onChange,
  counts,
}: HabitFilterTabsProps) {
  return (
    <div
      className="bg-muted inline-flex w-full rounded-lg p-1"
      role="tablist"
      aria-label="Filter habits"
    >
      {HABIT_FILTER_TABS.map((tab) => {
        const isActive = value === tab.value;
        const count = counts?.[tab.value];

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              typography.navLabel,
              "flex-1 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {formatTabLabel(tab.label, count)}
          </button>
        );
      })}
    </div>
  );
}
