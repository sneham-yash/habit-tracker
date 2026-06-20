"use client";

import { useEffect, useState } from "react";

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
import { resolveIconName, type IconName } from "@/constants/icons";
import { useUpdateCategory } from "@/hooks/use-update-category";
import type { Category } from "@/types/database";

type EditCategoryDialogProps = {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const updateCategory = useUpdateCategory();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName>("sparkles");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category && open) {
      setName(category.name);
      setIcon(resolveIconName(category.icon, category.category_type));
      setError(null);
    }
  }, [category, open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!category) return;

    setError(null);
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        name,
        icon,
      });
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update category.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_category_name">Category name</Label>
            <Input
              id="edit_category_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            disabled={updateCategory.isPending}
          >
            {updateCategory.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
