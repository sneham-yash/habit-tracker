"use client";

import {
  formatDayNumber,
  formatWeekdayLetter,
  getWeekDaysAround,
  isFutureDate,
} from "@/lib/dates";
import { getTodayDateString } from "@/lib/habits/constants";
import { cn } from "@/lib/utils";

type WeekCalendarStripProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function WeekCalendarStrip({
  selectedDate,
  onSelectDate,
}: WeekCalendarStripProps) {
  const today = getTodayDateString();
  const weekDays = getWeekDaysAround(selectedDate);

  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
      role="group"
      aria-label="Select day"
    >
      {weekDays.map((date) => {
        const isSelected = date === selectedDate;
        const isToday = date === today;
        const isFuture = isFutureDate(date, today);

        return (
          <button
            key={date}
            type="button"
            disabled={isFuture}
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex min-w-[3rem] flex-col items-center gap-1 rounded-full px-2 py-2 transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
              isFuture && "cursor-not-allowed opacity-40 hover:text-muted-foreground",
            )}
            aria-label={date}
            aria-pressed={isSelected}
            aria-current={isToday ? "date" : undefined}
          >
            <span className="text-xs font-medium uppercase">
              {formatWeekdayLetter(date)}
            </span>
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                isSelected && "text-primary-foreground",
                !isSelected && isToday && "ring-primary/40 ring-1",
              )}
            >
              {formatDayNumber(date)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
