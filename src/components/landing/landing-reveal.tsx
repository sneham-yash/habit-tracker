"use client";

import { useEffect, useState } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type LandingRevealVariant =
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right"
  | "scale-up";

type LandingRevealProps = {
  children: React.ReactNode;
  variant?: LandingRevealVariant;
  delay?: number;
  className?: string;
  /** When true, reveals on mount instead of on scroll. */
  immediate?: boolean;
};

const hiddenVariants: Record<LandingRevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-5",
  "fade-in": "opacity-0",
  "slide-left": "opacity-0 -translate-x-6",
  "slide-right": "opacity-0 translate-x-6",
  "scale-up": "opacity-0 scale-[0.98]",
};

const visibleVariants: Record<LandingRevealVariant, string> = {
  "fade-up": "opacity-100 translate-y-0",
  "fade-in": "opacity-100",
  "slide-left": "opacity-100 translate-x-0",
  "slide-right": "opacity-100 translate-x-0",
  "scale-up": "opacity-100 scale-100",
};

export function LandingReveal({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  immediate = false,
}: LandingRevealProps) {
  const { ref, isInView } = useInView();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!immediate) return;

    if (prefersReducedMotion) {
      setHasMounted(true);
      return;
    }

    const frame = requestAnimationFrame(() => setHasMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [immediate, prefersReducedMotion]);

  const isVisible =
    prefersReducedMotion || (immediate ? hasMounted : isInView);

  return (
    <div
      ref={immediate ? undefined : ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "motion-reduce:translate-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        isVisible ? visibleVariants[variant] : hiddenVariants[variant],
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
