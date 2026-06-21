"use client";

import {
  CheckIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const themeOptions = [
  {
    value: "system",
    label: "System",
    description: "Match your device",
    icon: MonitorIcon,
  },
  {
    value: "light",
    label: "Light",
    description: "Bright and clear",
    icon: SunIcon,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes",
    icon: MoonIcon,
  },
] as const;

type ThemeValue = (typeof themeOptions)[number]["value"];

function getActiveTheme(theme: string | undefined): ThemeValue {
  return themeOptions.find((option) => option.value === theme)?.value ?? "system";
}

type ThemeModeOptionsProps = {
  activeTheme: ThemeValue;
  onSelect: (value: ThemeValue) => void;
  showLabel?: boolean;
  className?: string;
};

function ThemeModeOptions({
  activeTheme,
  onSelect,
  showLabel = true,
  className,
}: ThemeModeOptionsProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <p
          className={cn(
            typography.metricLabel,
            "text-muted-foreground px-2 pt-1 pb-2",
          )}
        >
          Appearance
        </p>
      )}

      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = activeTheme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
              isSelected
                ? "border-primary/25 bg-primary/8"
                : "hover:bg-accent/50 border-transparent",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                isSelected
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="font-sans text-sm font-medium text-foreground">
                {option.label}
              </span>
              <span className="font-sans text-muted-foreground block text-xs leading-snug">
                {option.description}
              </span>
            </span>

            {isSelected && (
              <CheckIcon className="text-primary size-4 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

type ThemeModePickerProps = {
  className?: string;
  variant?: "popover" | "inline";
};

export function ThemeModePicker({
  className,
  variant = "popover",
}: ThemeModePickerProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || variant === "inline") return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, variant]);

  if (!mounted) {
    if (variant === "inline") {
      return <div className={cn("space-y-1", className)} aria-hidden />;
    }

    return (
      <div className={className}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-border/60 bg-background/60 size-10 rounded-full shadow-sm backdrop-blur-md"
          disabled
          aria-label="Choose appearance"
        />
      </div>
    );
  }

  const activeTheme = getActiveTheme(theme);
  const activeOption =
    themeOptions.find((option) => option.value === activeTheme) ??
    themeOptions[0];
  const TriggerIcon = activeOption.icon;

  function handleSelect(value: ThemeValue) {
    setTheme(value);
    if (variant === "popover") {
      setOpen(false);
    }
  }

  if (variant === "inline") {
    return (
      <div
        role="listbox"
        aria-label="Appearance modes"
        className={className}
      >
        <ThemeModeOptions
          activeTheme={activeTheme}
          onSelect={handleSelect}
          showLabel={false}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground size-10 rounded-full shadow-sm backdrop-blur-md transition-all",
          open && "border-primary/30 bg-background text-foreground ring-primary/20 ring-2",
        )}
        onClick={() => setOpen((current) => !current)}
        aria-label="Choose appearance"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <TriggerIcon className="size-4" />
      </Button>

      {open && (
        <div
          role="listbox"
          aria-label="Appearance modes"
          className={cn(
            "border-border/60 bg-background/95 absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border p-2 shadow-lg backdrop-blur-xl",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200",
          )}
        >
          <ThemeModeOptions
            activeTheme={activeTheme}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
