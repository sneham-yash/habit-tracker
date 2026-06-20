"use client";

import {
  ICON_PICKER_OPTIONS,
  ICON_TONE_CLASSES,
  type IconName,
} from "@/constants/icons";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type IconPickerProps = {
  value: IconName | null;
  onChange: (icon: IconName) => void;
  label?: string;
};

export function IconPicker({ value, onChange, label = "Choose icon" }: IconPickerProps) {
  return (
    <div className="space-y-2">
      <p className={typography.formLabel}>{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {ICON_PICKER_OPTIONS.map((option) => {
          const isSelected = value === option.name;
          const tone = ICON_TONE_CLASSES[option.tone];
          const Icon = option.icon;

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => onChange(option.name)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-xl border transition-colors",
                tone.bg,
                isSelected
                  ? "border-primary ring-primary/30 ring-2"
                  : "border-transparent hover:border-primary/40",
              )}
              aria-label={option.label}
              aria-pressed={isSelected}
            >
              <Icon className={cn("size-5", tone.text)} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
