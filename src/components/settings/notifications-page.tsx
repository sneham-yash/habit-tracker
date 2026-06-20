"use client";

import Link from "next/link";
import { ArrowLeftIcon, BellIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/settings"
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Settings
      </Link>

      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Notifications</h1>
        <p className={typography.screenSubtitle}>
          Reminder preferences for your habits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BellIcon className="size-4" />
            Coming soon
          </CardTitle>
          <CardDescription>
            Habit reminders and daily check-in notifications are on the way.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={typography.bodyMuted}>
            You&apos;ll be able to configure reminders here in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
