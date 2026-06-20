export const dashboardKeys = {
  all: ["dashboard"] as const,
  today: (date: string) => ["dashboard", "today", date] as const,
};
