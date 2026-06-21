import { APP_TAGLINE } from "@/constants/brand";
import { RizenLogo } from "@/components/brand/rizen-logo";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const copy = {
  login: {
    headline: "Welcome back",
    subcopy:
      "Continue the habits that move you forward. Every day, one step closer.",
  },
  signup: {
    headline: "Your next step starts here",
    subcopy:
      "Build better habits. Release what holds you back. Transformation begins with one choice.",
  },
} as const;

type AuthShellProps = {
  variant: keyof typeof copy;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ variant, children, footer }: AuthShellProps) {
  const { headline, subcopy } = copy[variant];

  return (
    <div
      className={cn(
        "relative space-y-8",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
      )}
    >
      <header className="space-y-3 pt-2 text-center">
        <div className="flex justify-center opacity-90">
          <RizenLogo size="sm" priority />
        </div>
        <p className={typography.authTagline}>{APP_TAGLINE}</p>
        <div className="space-y-2">
          <h1 className={typography.authHeadline}>{headline}</h1>
          <p className={cn(typography.bodyMuted, "text-pretty")}>{subcopy}</p>
        </div>
      </header>

      <div className="space-y-5">{children}</div>

      <footer className="text-center">{footer}</footer>
    </div>
  );
}
