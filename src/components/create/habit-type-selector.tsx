"use client";

import { HABIT_TYPE_OPTIONS } from "@/constants/habits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HabitType } from "@/types/database";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

type HabitTypeSelectorProps = {
  value: HabitType;
  onChange: (value: HabitType) => void;
  onContinue: () => void;
};

export function HabitTypeSelector({
  value,
  onChange,
  onContinue,
}: HabitTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <p className={typography.bodyMuted}>
        Choose the kind of transformation you want to track.
      </p>

      <div className="grid gap-3">
        {HABIT_TYPE_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const Icon = option.value === "build" ? ArrowUpIcon : ArrowDownIcon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="text-left"
            >
              <Card
                className={cn(
                  "gap-0 py-0 transition-colors",
                  isSelected
                    ? "border-primary ring-primary/20 ring-2"
                    : "hover:border-primary/40",
                )}
              >
                <CardHeader className="flex-row items-start gap-3 px-4 py-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      option.value === "build"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{option.label}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </button>
          );
        })}
      </div>

      <Button className="w-full" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
