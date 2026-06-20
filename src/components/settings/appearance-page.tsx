"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { ThemeSelector } from "@/components/settings/theme-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function AppearancePage() {
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
        <h1 className={typography.screenTitle}>Appearance</h1>
        <p className={typography.screenSubtitle}>
          Choose how RIZEN looks on your device.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Light, dark, or match your system</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelector />
        </CardContent>
      </Card>
    </div>
  );
}
