"use client";

import { useState } from "react";

import { IconPicker } from "@/components/icons/icon-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { getCategoryVisuals } from "@/constants/categories";
import {
  DEFAULT_BUILD_ICON,
  DEFAULT_QUIT_ICON,
  type IconName,
} from "@/constants/icons";
import type { HabitFormValues } from "@/lib/habits/api";
import {
  DEFAULT_HABIT_COLOR,
  FREQUENCY_OPTIONS,
  WEEKDAYS,
} from "@/lib/habits/constants";
import { validateHabitForm } from "@/lib/habits/validation";
import type { Habit, HabitFrequency, HabitType } from "@/types/database";
import { cn } from "@/lib/utils";

type HabitFormProps = {
  habit?: Habit;
  habitType?: HabitType;
  defaultCategoryId?: string | null;
  onSubmit: (values: HabitFormValues) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

function getInitialValues(
  habit?: Habit,
  habitType: HabitType = "build",
  defaultCategoryId?: string | null,
): HabitFormValues {
  if (habit) {
    return {
      name: habit.name,
      description: habit.description ?? "",
      color: habit.color,
      frequency: habit.frequency,
      frequency_days: habit.frequency_days,
      start_date: habit.start_date,
      habit_type: habit.habit_type ?? "build",
      category_id: habit.category_id,
      icon: habit.icon,
      target_minutes: habit.target_minutes,
      reminder_enabled: habit.reminder_enabled ?? false,
      reminder_time: habit.reminder_time,
    };
  }

  return {
    name: "",
    description: "",
    color: DEFAULT_HABIT_COLOR,
    frequency: "daily",
    frequency_days: null,
    start_date: new Date().toISOString().split("T")[0]!,
    habit_type: habitType,
    category_id: defaultCategoryId ?? null,
    icon: habitType === "quit" ? DEFAULT_QUIT_ICON : DEFAULT_BUILD_ICON,
    target_minutes: null,
    reminder_enabled: false,
    reminder_time: "09:00",
  };
}

export function HabitForm({
  habit,
  habitType = "build",
  defaultCategoryId,
  onSubmit,
  onCancel,
  isPending = false,
  error,
}: HabitFormProps) {
  const resolvedType = habit?.habit_type ?? habitType;
  const { data: categories } = useCategories(resolvedType);
  const [values, setValues] = useState<HabitFormValues>(() =>
    getInitialValues(habit, habitType, defaultCategoryId),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const showDayPicker =
    values.frequency === "weekly" || values.frequency === "custom";

  function updateField<K extends keyof HabitFormValues>(
    key: K,
    value: HabitFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleDay(day: number) {
    setValues((current) => {
      const selected = current.frequency_days ?? [];
      const next = selected.includes(day)
        ? selected.filter((value) => value !== day)
        : [...selected, day];
      return { ...current, frequency_days: next };
    });
  }

  function selectAllDays() {
    updateField(
      "frequency_days",
      WEEKDAYS.map((day) => day.value),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateHabitForm({ ...values, habit_type: resolvedType });
    if (message) {
      setValidationError(message);
      return;
    }
    setValidationError(null);
    await onSubmit({ ...values, habit_type: resolvedType });
  }

  const displayError = validationError ?? error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Habit name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder={
            resolvedType === "build" ? "e.g. Read a book" : "e.g. No smoking"
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description ?? ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Optional details"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={values.category_id ?? ""}
          onValueChange={(value) => {
            const category = categories?.find((c) => c.id === value);
            const visuals = category
              ? getCategoryVisuals(category.name, category.icon)
              : null;
            setValues((current) => ({
              ...current,
              category_id: value || null,
              icon: visuals?.iconName ?? current.icon,
            }));
          }}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {(categories ?? []).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <IconPicker
        value={(values.icon as IconName) ?? null}
        onChange={(icon) => updateField("icon", icon)}
      />

      <div className="space-y-2">
        <Label htmlFor="frequency">Repeat</Label>
        <Select
          value={values.frequency}
          onValueChange={(value: HabitFrequency) => {
            setValues((current) => ({
              ...current,
              frequency: value,
              frequency_days:
                value === "daily" ? null : current.frequency_days ?? [],
            }));
          }}
        >
          <SelectTrigger id="frequency" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDayPicker && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Repeat days</Label>
            <Button type="button" variant="ghost" size="sm" onClick={selectAllDays}>
              Select all days
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => {
              const selected = values.frequency_days?.includes(day.value);
              return (
                <Button
                  key={day.value}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  className={cn("min-w-12")}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {resolvedType === "build" && (
        <div className="space-y-2">
          <Label htmlFor="target_minutes">Target minutes (optional)</Label>
          <Input
            id="target_minutes"
            type="number"
            min={1}
            value={values.target_minutes ?? ""}
            onChange={(e) =>
              updateField(
                "target_minutes",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            placeholder="e.g. 30"
          />
        </div>
      )}

      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox
          id="reminder_enabled"
          checked={values.reminder_enabled ?? false}
          onCheckedChange={(checked) =>
            updateField("reminder_enabled", checked === true)
          }
        />
        <div className="space-y-2">
          <Label htmlFor="reminder_enabled">Daily reminder</Label>
          {values.reminder_enabled ? (
            <Input
              id="reminder_time"
              type="time"
              value={values.reminder_time ?? "09:00"}
              onChange={(e) => updateField("reminder_time", e.target.value)}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              Get a nudge to stay on track.
            </p>
          )}
        </div>
      </div>

      {displayError && (
        <p className="text-destructive text-sm" role="alert">
          {displayError}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saving…" : habit ? "Save changes" : "Create habit"}
        </Button>
      </div>
    </form>
  );
}
