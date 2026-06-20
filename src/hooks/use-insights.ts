"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchRizenInsights } from "@/lib/analytics/api";
import { insightsKeys } from "@/lib/analytics/keys";

export function useInsights() {
  return useQuery({
    queryKey: insightsKeys.all,
    queryFn: fetchRizenInsights,
  });
}
