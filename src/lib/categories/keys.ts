export const categoriesKeys = {
  all: ["categories"] as const,
  byType: (type: string) => ["categories", type] as const,
  detail: (id: string) => ["categories", id] as const,
  analytics: (id: string) => ["categories", id, "analytics"] as const,
  habitCounts: ["categories", "habit-counts"] as const,
};
