"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeftIcon, BarChart3Icon, ChevronRightIcon, GraduationCapIcon } from "lucide-react";

import { OnboardingTutorial } from "@/components/tutorial/onboarding-tutorial";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const tutorialItems = [
  {
    id: "getting-started",
    label: "Getting Started Tutorial",
    description: "Replay the 3-step walkthrough for habits, categories, and metrics",
    icon: GraduationCapIcon,
    action: "replay" as const,
  },
  {
    id: "metrics",
    label: "How Metrics & Rizen Score Work",
    description: "Full formula, weights, and metric definitions",
    icon: BarChart3Icon,
    href: "/settings/metrics-guide",
    action: "link" as const,
  },
] as const;

export function TutorialHubPage() {
  const [replayOpen, setReplayOpen] = useState(false);

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
        <h1 className={typography.screenTitle}>Tutorial</h1>
        <p className={typography.screenSubtitle}>
          Learn the app and how your metrics are calculated
        </p>
      </div>

      <Card>
        <CardContent className="divide-border divide-y p-0">
          {tutorialItems.map((item) => {
            const Icon = item.icon;

            if (item.action === "replay") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReplayOpen(true)}
                  className="hover:bg-muted/50 flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors"
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
                </button>
              );
            }

            return (
              <Link
                key={item.id}
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

      <OnboardingTutorial
        open={replayOpen}
        onOpenChange={setReplayOpen}
        replayMode
      />
    </div>
  );
}
