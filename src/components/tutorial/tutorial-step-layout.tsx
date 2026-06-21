"use client";

import { Button } from "@/components/ui/button";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type TutorialStepLayoutProps = {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  onFinish?: () => void;
  isLastStep?: boolean;
  isPending?: boolean;
  showSkip?: boolean;
};

export function TutorialStepLayout({
  step,
  totalSteps,
  title,
  description,
  children,
  onBack,
  onNext,
  onSkip,
  onFinish,
  isLastStep = false,
  isPending = false,
  showSkip = true,
}: TutorialStepLayoutProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 pr-8">
        <div className="space-y-1">
          <p className={typography.bodyMuted}>
            Step {step} of {totalSteps}
          </p>
          <h2 className={typography.sectionTitle}>{title}</h2>
          <p className={cn(typography.bodyText, "leading-relaxed")}>
            {description}
          </p>
        </div>
        {showSkip && onSkip ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={onSkip}
            disabled={isPending}
          >
            Skip
          </Button>
        ) : null}
      </div>

      <div className="flex justify-center gap-1.5" aria-hidden>
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index + 1 === step
                ? "bg-primary w-6"
                : "bg-muted w-1.5",
            )}
          />
        ))}
      </div>

      <div>{children}</div>

      <div className="flex gap-2 pt-1">
        {step > 1 && onBack ? (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={isPending}
          >
            Back
          </Button>
        ) : null}
        {isLastStep ? (
          <Button
            type="button"
            className="flex-1"
            onClick={onFinish}
            disabled={isPending}
          >
            Get Started
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            onClick={onNext}
            disabled={isPending}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
