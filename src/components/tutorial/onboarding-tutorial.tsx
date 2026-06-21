"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  CategoriesIllustration,
  HabitTypesIllustration,
  MetricsPreviewIllustration,
} from "@/components/tutorial/tutorial-illustrations";
import {
  ONBOARDING_STEP_COUNT,
  ONBOARDING_STEPS,
} from "@/components/tutorial/tutorial-content";
import { TutorialStepLayout } from "@/components/tutorial/tutorial-step-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompleteOnboarding } from "@/hooks/use-profile";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type OnboardingTutorialProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replayMode?: boolean;
};

export function OnboardingTutorial({
  open,
  onOpenChange,
  replayMode = false,
}: OnboardingTutorialProps) {
  const router = useRouter();
  const completeOnboarding = useCompleteOnboarding();
  const [step, setStep] = useState(1);
  const hasCompletedRef = useRef(false);

  const currentStep = ONBOARDING_STEPS[step - 1];
  const isLastStep = step === ONBOARDING_STEP_COUNT;

  async function markCompleteIfNeeded(): Promise<boolean> {
    if (replayMode || hasCompletedRef.current) {
      return true;
    }

    try {
      await completeOnboarding.mutateAsync();
      hasCompletedRef.current = true;
      return true;
    } catch {
      return false;
    }
  }

  function closeDialog() {
    setStep(1);
    onOpenChange(false);
  }

  async function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      const completed = await markCompleteIfNeeded();
      if (!completed) {
        return;
      }
      closeDialog();
      return;
    }

    onOpenChange(nextOpen);
  }

  async function handleDismiss(options?: { navigateToCreate?: boolean }) {
    const completed = await markCompleteIfNeeded();
    if (!completed) {
      return;
    }

    closeDialog();

    if (options?.navigateToCreate) {
      router.push("/create");
    }
  }

  async function handleMetricsLinkClick() {
    const completed = await markCompleteIfNeeded();
    if (!completed) {
      return;
    }

    closeDialog();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => void handleOpenChange(nextOpen)}
    >
      <DialogContent
        className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => {
          if (!replayMode) {
            event.preventDefault();
          }
        }}
      >
        <DialogTitle className="sr-only">Getting Started Tutorial</DialogTitle>
        <DialogDescription className="sr-only">
          Learn how to create habits, use categories, and understand your
          Rizen Score.
        </DialogDescription>

        <TutorialStepLayout
          step={step}
          totalSteps={ONBOARDING_STEP_COUNT}
          title={currentStep.title}
          description={currentStep.description}
          isLastStep={isLastStep}
          isPending={completeOnboarding.isPending}
          showSkip={!replayMode}
          onBack={step > 1 ? () => setStep((value) => value - 1) : undefined}
          onNext={() => setStep((value) => value + 1)}
          onSkip={() => void handleDismiss()}
          onFinish={() => void handleDismiss({ navigateToCreate: true })}
        >
          {currentStep.id === "habits" ? (
            <div className="space-y-4">
              <HabitTypesIllustration />
              <TutorialBulletList items={currentStep.bullets} />
            </div>
          ) : null}

          {currentStep.id === "categories" ? (
            <div className="space-y-4">
              <CategoriesIllustration
                buildCategories={currentStep.buildCategories}
                quitCategories={currentStep.quitCategories}
              />
              <TutorialBulletList items={currentStep.bullets} />
            </div>
          ) : null}

          {currentStep.id === "metrics" ? (
            <div className="space-y-4">
              <MetricsPreviewIllustration
                score={currentStep.previewScore}
                metrics={currentStep.previewMetrics}
              />
              <TutorialBulletList items={currentStep.bullets} />
              <Link
                href="/settings/metrics-guide"
                className={cn(
                  typography.bodyText,
                  "text-primary block text-center text-sm font-medium hover:underline",
                )}
                onClick={() => void handleMetricsLinkClick()}
              >
                See full metrics breakdown
              </Link>
            </div>
          ) : null}
        </TutorialStepLayout>
      </DialogContent>
    </Dialog>
  );
}

function TutorialBulletList({
  items,
}: {
  items: readonly string[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className={cn(typography.bodyMuted, "flex gap-2 text-sm leading-relaxed")}
        >
          <span className="text-primary mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
