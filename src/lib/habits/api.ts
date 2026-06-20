import { DEFAULT_BUILD_ICON, DEFAULT_QUIT_ICON } from "@/constants/icons";
import { createClient } from "@/lib/supabase/client";
import type {
  Habit,
  HabitFrequency,
  HabitInsert,
  HabitType,
} from "@/types/database";

export type HabitFormValues = {
  name: string;
  description?: string;
  color: string;
  icon?: string | null;
  frequency: HabitFrequency;
  frequency_days?: number[] | null;
  start_date: string;
  habit_type?: HabitType;
  category_id?: string | null;
  target_minutes?: number | null;
  reminder_enabled?: boolean;
  reminder_time?: string | null;
};

function normalizeFormValues(values: HabitFormValues) {
  const name = values.name.trim();
  const habitType = values.habit_type ?? "build";
  const frequencyDays =
    values.frequency === "daily" ? null : values.frequency_days ?? null;

  return {
    name,
    description: values.description?.trim() || null,
    color: values.color,
    icon:
      values.icon ??
      (habitType === "quit" ? DEFAULT_QUIT_ICON : DEFAULT_BUILD_ICON),
    frequency: values.frequency,
    frequency_days: frequencyDays,
    start_date: values.start_date,
    habit_type: habitType,
    category_id: values.category_id ?? null,
    target_minutes:
      habitType === "quit" ? null : values.target_minutes ?? null,
    reminder_enabled: values.reminder_enabled ?? false,
    reminder_time: values.reminder_enabled ? values.reminder_time ?? null : null,
  };
}

export async function fetchHabits(): Promise<Habit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Habit[];
}

export async function fetchHabitsByCategory(
  categoryId: string,
): Promise<Habit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("category_id", categoryId)
    .is("archived_at", null)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Habit[];
}

export async function createHabit(values: HabitFormValues): Promise<Habit> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to create a habit.");
  }

  const payload = normalizeFormValues(values);
  const insertData: HabitInsert = {
    ...payload,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("habits")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Habit;
}

export async function updateHabit(
  id: string,
  values: HabitFormValues,
): Promise<Habit> {
  const supabase = createClient();
  const payload = normalizeFormValues(values);

  const { data, error } = await supabase
    .from("habits")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Habit;
}

export async function archiveHabit(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("habits")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteHabit(id: string): Promise<void> {
  return archiveHabit(id);
}

export async function permanentlyDeleteHabit(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("habits").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
