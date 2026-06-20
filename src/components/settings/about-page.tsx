"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import {
  APP_NAME,
  APP_TAGLINE,
  RIZEN_LOGO_SRC,
  RIZEN_LOGO_WHITE_SRC,
} from "@/constants/brand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type AboutPageProps = {
  version: string;
};

export function AboutPage({ version }: AboutPageProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/settings"
        className={cn(
          typography.bodyText,
          "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Settings
      </Link>

      <div className="space-y-1">
        <h1 className={typography.screenTitle}>About Rizen</h1>
        <p className={typography.screenSubtitle}>{APP_TAGLINE}</p>
      </div>

      <Card>
        <CardHeader className="items-center text-center">
          <Image
            src={RIZEN_LOGO_SRC}
            alt={APP_NAME}
            width={120}
            height={40}
            className="h-10 w-auto object-contain dark:hidden"
          />
          <Image
            src={RIZEN_LOGO_WHITE_SRC}
            alt={APP_NAME}
            width={120}
            height={40}
            className="hidden h-10 w-auto object-contain dark:block"
          />
          <CardTitle className="text-base">{APP_NAME}</CardTitle>
          <CardDescription>{APP_TAGLINE}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-center">
          <p className={typography.bodyText}>Version {version}</p>
          <p className={typography.bodyMuted}>
            Build better habits. Quit the ones holding you back. One step closer,
            every day.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
