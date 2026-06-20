/** Fixed locale so SSR and client hydration produce identical date strings. */
export const DISPLAY_LOCALE = "en-US";

export function formatDisplayDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  return date.toLocaleDateString(DISPLAY_LOCALE, options);
}

export function formatTodayLabel(dateString: string): string {
  return formatDisplayDate(dateString, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0]!;
}

/** Returns Mon–Sun week containing the given date. */
export function getWeekDaysAround(dateString: string): string[] {
  const date = new Date(`${dateString}T12:00:00.000Z`);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(dateString, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function formatWeekdayLetter(dateString: string): string {
  return formatDisplayDate(dateString, { weekday: "narrow" });
}

export function formatDayNumber(dateString: string): string {
  return formatDisplayDate(dateString, { day: "numeric" });
}

export function isFutureDate(dateString: string, today: string): boolean {
  return dateString > today;
}
