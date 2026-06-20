export function getInitials(
  displayName?: string | null,
  email?: string | null,
): string {
  const source = displayName?.trim() || email?.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }

  if (parts[0]!.length >= 2) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return parts[0]!.slice(0, 1).toUpperCase();
}
