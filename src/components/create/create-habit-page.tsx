"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { HabitTypeSelector } from "@/components/create/habit-type-selector";
import { HabitForm } from "@/components/habits/habit-form";
import { useCreateHabit } from "@/hooks/use-habits";
import { typography } from "@/lib/typography";
import { useUiStore } from "@/stores/ui-store";

export function CreateHabitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createHabit = useCreateHabit();
  const step = useUiStore((s) => s.createStep);
  const habitType = useUiStore((s) => s.createHabitType);
  const setStep = useUiStore((s) => s.setCreateStep);
  const setHabitType = useUiStore((s) => s.setCreateHabitType);
  const resetCreateFlow = useUiStore((s) => s.resetCreateFlow);
  const [error, setError] = useState<string | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    if (type === "build" || type === "quit") {
      setHabitType(type);
      setStep(2);
    }
    if (category) {
      setDefaultCategoryId(category);
    }
  }, [searchParams, setHabitType, setStep]);

  async function handleSubmit(
    values: Parameters<typeof createHabit.mutateAsync>[0],
  ) {
    setError(null);
    try {
      await createHabit.mutateAsync({
        ...values,
        habit_type: habitType,
        category_id: values.category_id ?? defaultCategoryId,
      });
      resetCreateFlow();
      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create habit.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className={typography.bodyMuted}>Step {step} of 2</p>
        <h1 className={typography.screenTitle}>Create Habit</h1>
      </div>

      {step === 1 ? (
        <HabitTypeSelector
          value={habitType}
          onChange={setHabitType}
          onContinue={() => setStep(2)}
        />
      ) : (
        <HabitForm
          habitType={habitType}
          defaultCategoryId={defaultCategoryId}
          onSubmit={handleSubmit}
          onCancel={() => setStep(1)}
          isPending={createHabit.isPending}
          error={error}
        />
      )}
    </div>
  );
}
