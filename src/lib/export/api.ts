import { createClient } from "@/lib/supabase/client";
import { fetchHabits } from "@/lib/habits/api";

export async function exportUserData(): Promise<{
  exportedAt: string;
  habits: Awaited<ReturnType<typeof fetchHabits>>;
  habitLogs: { habit_id: string; completed_date: string; created_at: string }[];
  categories: { id: string; name: string; category_type: string; icon: string | null }[];
}> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to export data.");
  }

  const habits = await fetchHabits();

  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("habit_id, completed_date, created_at")
    .order("completed_date", { ascending: false });

  if (logsError) {
    throw new Error(logsError.message);
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, category_type, icon");

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  return {
    exportedAt: new Date().toISOString(),
    habits,
    habitLogs: logs ?? [],
    categories: categories ?? [],
  };
}

export function downloadJsonExport(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
