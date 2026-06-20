"use client";

import { useState } from "react";

import { IconPicker } from "@/components/icons/icon-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_BUILD_ICON, DEFAULT_QUIT_ICON, type IconName } from "@/constants/icons";
import { HABIT_TYPE_OPTIONS } from "@/constants/habits";
import { useCreateCategory } from "@/hooks/use-create-category";
import type { CategoryType } from "@/types/database";
import { cn } from "@/lib/utils";

type CreateCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const createCategory = useCreateCategory();
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("build");
  const [icon, setIcon] = useState<IconName>(DEFAULT_BUILD_ICON);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setCategoryType("build");
    setIcon(DEFAULT_BUILD_ICON);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createCategory.mutateAsync({ name, categoryType, icon });
      resetForm();
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create category.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_name">Category name</Label>
            <Input
              id="category_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Health & Fitness"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category type</Label>
            <div className="grid grid-cols-2 gap-2">
              {HABIT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setCategoryType(option.value);
                    setIcon(
                      option.value === "quit"
                        ? DEFAULT_QUIT_ICON
                        : DEFAULT_BUILD_ICON,
                    );
                  }}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition-colors",
                    categoryType === option.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/40",
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <IconPicker value={icon} onChange={setIcon} />

          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={createCategory.isPending}
          >
            {createCategory.isPending ? "Creating…" : "Create category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
