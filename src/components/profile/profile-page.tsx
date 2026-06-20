"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { signOut } from "@/app/(auth)/actions";
import { APP_TAGLINE } from "@/constants/brand";
import { ThemeToggle } from "@/components/profile/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInsights } from "@/hooks/use-insights";
import { formatDisplayName, typography } from "@/lib/typography";

type ProfilePageProps = {
  email: string;
  displayName: string | null;
  memberSince: string;
};

export function ProfilePage({
  email,
  displayName,
  memberSince,
}: ProfilePageProps) {
  const { data: insightsData } = useInsights();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const nameLabel = displayName
    ? formatDisplayName(displayName)
    : "Your Profile";

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className={typography.screenTitle}>{nameLabel}</h1>
        <p className={typography.screenSubtitle}>{APP_TAGLINE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>{email}</CardDescription>
          <CardTitle className="text-base">Member since {memberSince}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <p className={typography.metricValueSm}>
              {insightsData?.insights.rizenScore ?? 0}
            </p>
            <p className={typography.metricLabel}>Rizen Score</p>
          </div>
          <div className="space-y-1">
            <p className={typography.metricValueSm}>
              {insightsData?.insights.longestStreak ?? 0}
            </p>
            <p className={typography.metricLabel}>Longest Streak</p>
          </div>
          <div className="space-y-1">
            <p className={typography.metricValueSm}>
              {insightsData?.insights.stepsForward ?? 0}
            </p>
            <p className={typography.metricLabel}>Steps Forward</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={typography.bodyText}>Theme</span>
            <ThemeToggle />
          </div>
          <p className={typography.bodyMuted}>
            Current: {mounted ? (theme ?? "system") : "system"}
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href="/habits">Manage habits</Link>
          </Button>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
