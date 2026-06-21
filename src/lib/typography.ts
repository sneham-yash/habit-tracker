export const typography = {
  screenTitle:
    "font-display text-2xl font-semibold tracking-tight text-foreground",
  screenSubtitle: "font-sans text-sm text-muted-foreground leading-relaxed",
  sectionTitle: "font-display text-lg font-semibold tracking-tight",
  metricLabel:
    "font-display text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground",
  metricValue:
    "font-display text-4xl font-bold tracking-tight text-foreground",
  metricValueSm: "font-display text-2xl font-bold tracking-tight",
  greetingTime: "font-sans text-sm text-muted-foreground",
  greetingName:
    "font-display text-[1.75rem] font-semibold leading-tight tracking-tight",
  bodyText: "font-sans text-sm leading-relaxed text-foreground",
  bodyMuted: "font-sans text-sm leading-relaxed text-muted-foreground",
  navLabel: "font-sans text-xs font-medium",
  formLabel: "font-sans text-sm font-medium leading-none",
  dialogTitle: "font-display text-lg font-semibold leading-none",
  authHeadline:
    "font-display text-[1.625rem] font-semibold tracking-tight leading-tight text-foreground",
  authTagline:
    "font-display text-sm font-medium tracking-wide text-primary",
} as const;

export function formatDisplayName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? name;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
