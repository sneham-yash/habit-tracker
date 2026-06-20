"use client";

import {
  formatDisplayName,
  getGreetingTime,
  typography,
} from "@/lib/typography";
import { cn } from "@/lib/utils";

type HomeHeaderProps = {
  greetingTime?: string;
  displayName?: string | null;
  dateLabel: string;
};

export function HomeHeader({
  greetingTime = getGreetingTime(),
  displayName,
  dateLabel,
}: HomeHeaderProps) {
  const formattedName = displayName ? formatDisplayName(displayName) : null;

  return (
    <header className="space-y-1.5">
      <p className={typography.greetingTime}>{greetingTime},</p>
      {formattedName ? (
        <h1 className={typography.greetingName}>{formattedName} 👋</h1>
      ) : (
        <h1 className={typography.greetingName}>{greetingTime} 👋</h1>
      )}
      <p className={cn(typography.greetingTime, "text-muted-foreground/80")}>
        {dateLabel}
      </p>
    </header>
  );
}

export { getGreetingTime };
