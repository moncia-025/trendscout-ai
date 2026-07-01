"use client";

import { useCallback, useState } from "react";
import { analyzeTrendQuery } from "@/services/trend-analysis";
import type { RequestStatus, TrendAnalysis } from "@/types/trend";

interface UseTrendAnalysisResult {
  status: RequestStatus;
  data: TrendAnalysis | null;
  error: string | null;
  analyze: (query: string) => Promise<void>;
  reset: () => void;
}

export function useTrendAnalysis(): UseTrendAnalysisResult {
  const [status, setStatus] = useState<RequestStatus>("empty");
  const [data, setData] = useState<TrendAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus("empty");
    setData(null);
    setError(null);
  }, []);

  const analyze = useCallback(async (query: string) => {
    const normalized = query.trim();

    if (!normalized) {
      setStatus("empty");
      setData(null);
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const result = await analyzeTrendQuery(normalized);
      setData(result);
      setStatus("success");
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Unknown Error");
      setStatus("error");
    }
  }, []);

  return { status, data, error, analyze, reset };
}
