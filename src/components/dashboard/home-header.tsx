"use client";

import Image from "next/image";

import { APP_NAME } from "@/constants/brand";

type HomeHeaderProps = {
  greeting: string;
  dateLabel: string;
};

export function HomeHeader({ greeting, dateLabel }: HomeHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Image
          src="/brand/rizen-logo.png"
          alt={APP_NAME}
          width={100}
          height={32}
          className="h-8 w-auto object-contain"
          priority
        />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground text-sm">{dateLabel}</p>
      </div>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getHomeGreeting(displayName?: string | null): string {
  const greeting = getGreeting();
  return displayName ? `${greeting}, ${displayName}` : greeting;
}
