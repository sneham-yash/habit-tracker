"use client";

import Link from "next/link";
import {
  BellIcon,
  ChevronRightIcon,
  DownloadIcon,
  FolderOpenIcon,
  InfoIcon,
  ListChecksIcon,
  LogOutIcon,
  PaletteIcon,
} from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const settingsItems = [
  {
    href: "/settings/manage-habits",
    label: "Manage Habits",
    description: "Edit, archive, or delete habits",
    icon: ListChecksIcon,
  },
  {
    href: "/settings/categories",
    label: "Manage Categories",
    description: "Organize build and quit categories",
    icon: FolderOpenIcon,
  },
  {
    href: "/settings/appearance",
    label: "Appearance",
    description: "Light, dark, or system theme",
    icon: PaletteIcon,
  },
  {
    href: "/settings/notifications",
    label: "Notifications",
    description: "Reminder preferences",
    icon: BellIcon,
  },
  {
    href: "/settings/export",
    label: "Export Data",
    description: "Download your habit data",
    icon: DownloadIcon,
  },
  {
    href: "/settings/about",
    label: "About Rizen",
    description: "App info and version",
    icon: InfoIcon,
  },
] as const;

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className={typography.screenTitle}>Settings</h1>
        <p className={typography.screenSubtitle}>Configuration</p>
      </div>

      <Card>
        <CardContent className="divide-border divide-y p-0">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-muted/50 flex items-center gap-3 px-4 py-3.5 transition-colors"
              >
                <Icon className="text-muted-foreground size-5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className={typography.bodyText}>{item.label}</p>
                  <p className={cn(typography.bodyMuted, "text-xs")}>
                    {item.description}
                  </p>
                </div>
                <ChevronRightIcon
                  className="text-muted-foreground size-4 shrink-0"
                  aria-hidden
                />
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <form action={signOut}>
        <Button type="submit" variant="outline" className="w-full">
          <LogOutIcon />
          Logout
        </Button>
      </form>
    </div>
  );
}
