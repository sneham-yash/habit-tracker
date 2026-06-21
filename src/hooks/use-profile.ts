"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  completeOnboarding,
  fetchProfile,
  removeAvatar,
  updateProfile,
  uploadAvatar,
} from "@/lib/profile/api";
import { profileKeys } from "@/lib/profile/keys";

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: fetchProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: { display_name?: string | null }) =>
      updateProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      router.refresh();
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      router.refresh();
    },
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => removeAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      router.refresh();
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => completeOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      router.refresh();
    },
  });
}
