"use client";

import { useState } from "react";

import { OnboardingTutorial } from "@/components/tutorial/onboarding-tutorial";

type TutorialProviderProps = {
  showOnboarding: boolean;
  children: React.ReactNode;
};

export function TutorialProvider({
  showOnboarding,
  children,
}: TutorialProviderProps) {
  const [open, setOpen] = useState(showOnboarding);

  return (
    <>
      {children}
      <OnboardingTutorial open={open} onOpenChange={setOpen} />
    </>
  );
}
