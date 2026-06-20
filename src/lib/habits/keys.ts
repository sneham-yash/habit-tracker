export const habitsKeys = {
  all: ["habits"] as const,
  detail: (id: string) => ["habits", id] as const,
};
