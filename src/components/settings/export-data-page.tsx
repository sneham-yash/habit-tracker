"use client";

import Link from "next/link";
import { ArrowLeftIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadJsonExport, exportUserData } from "@/lib/export/api";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function ExportDataPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setError(null);

    try {
      const data = await exportUserData();
      const date = new Date().toISOString().split("T")[0];
      downloadJsonExport(data, `rizen-export-${date}.json`);
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "Failed to export data.",
      );
    } finally {
      setIsExporting(false);
    }
  }

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
        <h1 className={typography.screenTitle}>Export Data</h1>
        <p className={typography.screenSubtitle}>
          Download a copy of your habits and completion history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">JSON export</CardTitle>
          <CardDescription>
            Includes habits, categories, and completion logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full"
            onClick={handleExport}
            disabled={isExporting}
          >
            <DownloadIcon />
            {isExporting ? "Exporting…" : "Download export"}
          </Button>

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
