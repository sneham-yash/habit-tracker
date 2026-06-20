"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

import { signOut } from "@/app/(auth)/actions";
import { APP_NAME, APP_TAGLINE } from "@/constants/brand";
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

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          {APP_NAME}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {displayName ?? "Your profile"}
        </h1>
        <p className="text-muted-foreground text-sm">{APP_TAGLINE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>{email}</CardDescription>
          <CardTitle className="text-base">Member since {memberSince}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold">{insightsData?.insights.rizenScore ?? 0}</p>
            <p className="text-muted-foreground text-xs">Rizen Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{insightsData?.insights.longestStreak ?? 0}</p>
            <p className="text-muted-foreground text-xs">Longest Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{insightsData?.insights.stepsForward ?? 0}</p>
            <p className="text-muted-foreground text-xs">Steps Forward</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-xs">
            Current: {theme ?? "system"}
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
