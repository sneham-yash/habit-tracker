"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-muted grid grid-cols-3 gap-1 rounded-lg p-1">
        {themes.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            size="sm"
            disabled
            className="w-full"
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-muted grid grid-cols-3 gap-1 rounded-lg p-1">
      {themes.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "w-full",
            theme === option.value && "bg-background shadow-sm",
          )}
          onClick={() => setTheme(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
