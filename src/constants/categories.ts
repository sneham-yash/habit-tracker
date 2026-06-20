import type { IconName, IconTone } from "@/constants/icons";

export type CategoryDefault = {
  name: string;
  icon: IconName;
  tone: IconTone;
};

export const DEFAULT_BUILD_CATEGORIES: CategoryDefault[] = [
  { name: "Health & Fitness", icon: "heart-pulse", tone: "rose" },
  { name: "Mindfulness", icon: "leaf", tone: "emerald" },
  { name: "Personal Growth", icon: "book-open", tone: "orange" },
  { name: "Productivity", icon: "zap", tone: "sky" },
  { name: "Learning", icon: "graduation-cap", tone: "violet" },
  { name: "Finance", icon: "dollar-sign", tone: "emerald" },
];

export const DEFAULT_QUIT_CATEGORIES: CategoryDefault[] = [
  { name: "Smoking", icon: "cigarette-off", tone: "slate" },
  { name: "Alcohol", icon: "wine", tone: "rose" },
  { name: "Junk Food", icon: "hamburger", tone: "amber" },
  { name: "Social Media", icon: "smartphone", tone: "slate" },
];

const categoryLookup = new Map<string, CategoryDefault>();

for (const category of [...DEFAULT_BUILD_CATEGORIES, ...DEFAULT_QUIT_CATEGORIES]) {
  categoryLookup.set(category.name.toLowerCase(), category);
}

/** Legacy names from first migration → mockup defaults */
const LEGACY_NAME_MAP: Record<string, string> = {
  fitness: "Health & Fitness",
  sugar: "Junk Food",
};

export function getCategoryVisuals(
  name: string,
  icon?: string | null,
): { iconName: IconName; tone: IconTone } {
  const normalized = LEGACY_NAME_MAP[name.toLowerCase()] ?? name;
  const match = categoryLookup.get(normalized.toLowerCase());

  if (icon && icon.length > 0) {
    return {
      iconName: icon as IconName,
      tone: match?.tone ?? "orange",
    };
  }

  if (match) {
    return { iconName: match.icon, tone: match.tone };
  }

  return { iconName: "sparkles", tone: "orange" };
}
