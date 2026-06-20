import { createClient } from "@/lib/supabase/client";
import type { Category, CategoryInsert, CategoryType } from "@/types/database";

export async function fetchCategories(
  categoryType?: CategoryType,
): Promise<Category[]> {
  const supabase = createClient();
  let query = supabase
    .from("categories")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  if (categoryType) {
    query = query.eq("category_type", categoryType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Category[];
}

export async function fetchCategory(id: string): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function createCategory(
  name: string,
  categoryType: CategoryType,
  icon?: string | null,
): Promise<Category> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in to create a category.");
  }

  const insertData: CategoryInsert = {
    user_id: user.id,
    name: name.trim(),
    category_type: categoryType,
    icon: icon ?? null,
    is_default: false,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export type CategoryAnalytics = {
  category_id: string;
  category_name: string;
  category_type: CategoryType;
  habit_count: number;
  scheduled_days: number;
  completed_days: number;
  completion_rate: number;
  best_streak: number;
};

export async function fetchCategoryAnalytics(
  categoryId: string,
): Promise<CategoryAnalytics | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_category_analytics", {
    p_category_id: categoryId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}

export async function fetchCategoryHabitCounts(): Promise<
  Record<string, number>
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("category_id")
    .is("archived_at", null)
    .not("category_id", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.category_id) {
      counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
    }
  }
  return counts;
}
