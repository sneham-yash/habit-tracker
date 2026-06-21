import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function fetchProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile | null;
}

export async function updateProfile(values: {
  display_name?: string | null;
  avatar_url?: string | null;
  onboarding_completed_at?: string | null;
}): Promise<Profile> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function completeOnboarding(): Promise<Profile> {
  return updateProfile({ onboarding_completed_at: new Date().toISOString() });
}

function getAvatarExtension(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadAvatar(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPEG, PNG, or WebP image.");
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("Image must be 2MB or smaller.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in.");
  }

  const ext = getAvatarExtension(file);
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;
  await updateProfile({ avatar_url: cacheBustedUrl });

  return cacheBustedUrl;
}

export async function removeAvatar(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in.");
  }

  const { data: files } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(user.id);

  if (files && files.length > 0) {
    const paths = files.map((file) => `${user.id}/${file.name}`);
    await supabase.storage.from(AVATAR_BUCKET).remove(paths);
  }

  await updateProfile({ avatar_url: null });
}
