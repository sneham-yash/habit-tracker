import { ExternalLinkIcon, LinkedinIcon } from "lucide-react";

import {
  APP_NAME,
  CREATOR_LINKEDIN_URL,
  CREATOR_NAME,
} from "@/constants/brand";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type CreatorCreditProps = {
  variant: "landing" | "auth" | "about";
  className?: string;
};

function CreatorLink({
  children,
  className,
  showLinkedInIcon = false,
}: {
  children: React.ReactNode;
  className?: string;
  showLinkedInIcon?: boolean;
}) {
  return (
    <a
      href={CREATOR_LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${CREATOR_NAME} on LinkedIn`}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline hover:underline-offset-4",
        className,
      )}
    >
      {children}
      {showLinkedInIcon ? (
        <LinkedinIcon className="size-3 shrink-0 opacity-70" aria-hidden />
      ) : null}
    </a>
  );
}

export function CreatorCredit({ variant, className }: CreatorCreditProps) {
  const year = new Date().getFullYear();

  if (variant === "landing") {
    return (
      <p
        className={cn(
          "text-muted-foreground py-6 text-center text-xs",
          className,
        )}
      >
        © {year} {APP_NAME}
        <span className="text-muted-foreground/50 mx-2">·</span>
        Crafted by{" "}
        <CreatorLink className="text-muted-foreground font-medium">
          {CREATOR_NAME}
        </CreatorLink>
      </p>
    );
  }

  if (variant === "auth") {
    return (
      <p
        className={cn(
          "text-muted-foreground/80 text-center text-xs",
          className,
        )}
      >
        Crafted by{" "}
        <CreatorLink
          className="text-muted-foreground/80 font-medium"
          showLinkedInIcon
        >
          {CREATOR_NAME}
        </CreatorLink>
      </p>
    );
  }

  return (
    <div
      className={cn(
        "border-border/40 flex flex-col items-center gap-3 border-t pt-6 text-center",
        className,
      )}
    >
      <div
        className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-sm font-semibold"
        aria-hidden
      >
        SB
      </div>
      <div className="space-y-1">
        <p className={typography.bodyMuted}>Crafted by</p>
        <p className={typography.sectionTitle}>{CREATOR_NAME}</p>
      </div>
      <CreatorLink
        className={cn(typography.bodyMuted, "text-primary gap-1.5 font-medium")}
      >
        Connect on LinkedIn
        <ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
      </CreatorLink>
    </div>
  );
}
