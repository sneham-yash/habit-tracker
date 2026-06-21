"use client";

import Link from "next/link";

import { RizenLogo } from "@/components/brand/rizen-logo";
import { ThemeModePicker } from "@/components/theme/theme-mode-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  return (
    <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
          aria-label="RIZEN home"
        >
          <RizenLogo size="sm" priority />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeModePicker className="hidden sm:flex" />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function LandingSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto max-w-6xl px-6",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700",
        className,
      )}
    >
      {children}
    </section>
  );
}
