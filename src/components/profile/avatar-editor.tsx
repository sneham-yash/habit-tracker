"use client";

import { CameraIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";

import { UserAvatar } from "@/components/layout/user-avatar";
import { Button } from "@/components/ui/button";
import { useRemoveAvatar, useUploadAvatar } from "@/hooks/use-profile";
import { typography } from "@/lib/typography";

type AvatarEditorProps = {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function AvatarEditor({
  displayName,
  email,
  avatarUrl,
}: AvatarEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar.mutateAsync(file);
    } catch {
      // Error shown below
    } finally {
      event.target.value = "";
    }
  }

  async function handleRemove() {
    try {
      await removeAvatar.mutateAsync();
    } catch {
      // Error shown below
    }
  }

  const error = uploadAvatar.error ?? removeAvatar.error;

  return (
    <div className="flex flex-col items-center gap-3">
      <UserAvatar
        displayName={displayName}
        email={email}
        avatarUrl={avatarUrl}
        size="lg"
      />

      <div className="flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploadAvatar.isPending || removeAvatar.isPending}
          onClick={() => inputRef.current?.click()}
        >
          <CameraIcon className="size-4" />
          {avatarUrl ? "Replace image" : "Upload image"}
        </Button>

        {avatarUrl ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadAvatar.isPending || removeAvatar.isPending}
            onClick={handleRemove}
          >
            <Trash2Icon className="size-4" />
            Remove
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      {error ? (
        <p className="text-destructive text-sm text-center" role="alert">
          {error.message}
        </p>
      ) : null}

      <p className={typography.bodyMuted}>JPEG, PNG, or WebP · max 2MB</p>
    </div>
  );
}
