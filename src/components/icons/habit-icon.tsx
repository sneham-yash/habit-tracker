"use client";

import {
  getLucideIcon,
  ICON_REGISTRY,
  ICON_TONE_CLASSES,
  resolveIconName,
  type IconName,
} from "@/constants/icons";
import { getCategoryVisuals } from "@/constants/categories";
import { cn } from "@/lib/utils";
import type { HabitType } from "@/types/database";

type HabitIconProps = {
  icon?: string | null;
  habitType?: HabitType;
  categoryName?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-9 rounded-lg [&_svg]:size-4",
  md: "size-11 rounded-xl [&_svg]:size-5",
  lg: "size-14 rounded-2xl [&_svg]:size-6",
};

function getToneForIcon(iconName: IconName, habitType: HabitType) {
  return ICON_TONE_CLASSES[ICON_REGISTRY[iconName]?.tone ?? (habitType === "quit" ? "slate" : "orange")];
}

export function HabitIcon({
  icon,
  habitType = "build",
  categoryName,
  size = "md",
  className,
}: HabitIconProps) {
  let iconName: IconName;

  if (categoryName) {
    const visuals = getCategoryVisuals(categoryName, icon);
    iconName = resolveIconName(visuals.iconName, habitType);
  } else {
    iconName = resolveIconName(icon, habitType);
  }

  const tone = getToneForIcon(iconName, habitType);
  const LucideIcon = getLucideIcon(iconName, habitType);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeClasses[size],
        tone.bg,
        tone.text,
        className,
      )}
      aria-hidden
    >
      <LucideIcon />
    </div>
  );
}
