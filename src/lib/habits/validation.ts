import type { HabitFormValues } from "@/lib/habits/api";

export function validateHabitForm(values: HabitFormValues): string | null {
  if (!values.name.trim()) {
    return "Name is required.";
  }

  if (
    (values.frequency === "weekly" || values.frequency === "custom") &&
    (!values.frequency_days || values.frequency_days.length === 0)
  ) {
    return "Select at least one day for weekly or custom habits.";
  }

  if (!values.start_date) {
    return "Start date is required.";
  }

  return null;
}
