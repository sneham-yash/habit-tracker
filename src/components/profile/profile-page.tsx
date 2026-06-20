"use client";

import Link from "next/link";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";

import { AvatarEditor } from "@/components/profile/avatar-editor";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInsights } from "@/hooks/use-insights";
import { formatDisplayName, typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type ProfilePageProps = {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  memberSince: string;
};

export function ProfilePage({
  email,
  displayName,
  avatarUrl,
  memberSince,
}: ProfilePageProps) {
  const { data: insightsData } = useInsights();
  const [editOpen, setEditOpen] = useState(false);
  const nameLabel = displayName
    ? formatDisplayName(displayName)
    : "Your Profile";

  return (
    <div className="space-y-6">
      <AvatarEditor
        displayName={displayName}
        email={email}
        avatarUrl={avatarUrl}
      />

      <div className="space-y-1 text-center">
        <h1 className={typography.screenTitle}>{nameLabel}</h1>
        <p className={typography.bodyMuted}>{email}</p>
        <p className={cn(typography.bodyMuted, "text-sm")}>
          Member since {memberSince}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your stats</CardTitle>
          <CardDescription>Recent performance over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <p className={typography.metricValueSm}>
                {insightsData?.insights.rizenScore ?? 0}
              </p>
              <p className={typography.metricLabel}>Rizen Score</p>
            </div>
            <div className="space-y-1">
              <p className={typography.metricValueSm}>
                {insightsData?.insights.stepsForward ?? 0}
              </p>
              <p className={typography.metricLabel}>Steps Forward</p>
            </div>
            <div className="space-y-1">
              <p className={typography.metricValueSm}>
                {insightsData?.insights.longestStreak ?? 0}
              </p>
              <p className={typography.metricLabel}>Longest Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        <Button className="w-full" onClick={() => setEditOpen(true)}>
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/settings">
            <SettingsIcon />
            Settings
          </Link>
        </Button>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        displayName={displayName}
      />
    </div>
  );
}
