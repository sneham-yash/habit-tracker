"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/use-profile";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string | null;
};

export function EditProfileDialog({
  open,
  onOpenChange,
  displayName,
}: EditProfileDialogProps) {
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(displayName ?? "");

  useEffect(() => {
    if (open) {
      setName(displayName ?? "");
    }
  }, [open, displayName]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await updateProfile.mutateAsync({
        display_name: name.trim() || null,
      });
      onOpenChange(false);
    } catch {
      // Error shown below
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update how your name appears across RIZEN.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          {updateProfile.error ? (
            <p className="text-destructive text-sm" role="alert">
              {updateProfile.error.message}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
