"use client";

import Image from "next/image";

import { APP_NAME, RIZEN_LOGO_SRC, RIZEN_LOGO_WHITE_SRC } from "@/constants/brand";
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
    <header className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Image
          src={RIZEN_LOGO_SRC}
          alt={APP_NAME}
          width={100}
          height={32}
          className="h-8 w-auto object-contain dark:hidden"
          priority
        />
        <Image
          src={RIZEN_LOGO_WHITE_SRC}
          alt={APP_NAME}
          width={100}
          height={32}
          className="hidden h-8 w-auto object-contain dark:block"
          priority
        />
      </div>
      <div className="space-y-1.5">
        <p className={typography.greetingTime}>{greetingTime},</p>
        {formattedName ? (
          <h1 className={typography.greetingName}>{formattedName} 👋</h1>
        ) : (
          <h1 className={typography.greetingName}>{greetingTime} 👋</h1>
        )}
        <p className={cn(typography.greetingTime, "text-muted-foreground/80")}>
          {dateLabel}
        </p>
      </div>
    </header>
  );
}

export { getGreetingTime };
