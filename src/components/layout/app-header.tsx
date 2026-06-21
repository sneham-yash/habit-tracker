"use client";

import Link from "next/link";

import { RizenLogo } from "@/components/brand/rizen-logo";
import { UserAvatar } from "@/components/layout/user-avatar";
import { APP_NAME } from "@/constants/brand";

type AppHeaderProps = {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function AppHeader({ displayName, email, avatarUrl }: AppHeaderProps) {
  return (
    <header className="border-border bg-background/95 fixed inset-x-0 top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="shrink-0" aria-label={`${APP_NAME} home`}>
          <RizenLogo size="sm" priority />
        </Link>

        <Link
          href="/profile"
          className="flex size-11 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          aria-label="Open profile"
        >
          <UserAvatar
            displayName={displayName}
            email={email}
            avatarUrl={avatarUrl}
            size="md"
          />
        </Link>
      </div>
    </header>
  );
}
