"use client";

import { useCallback, useEffect, useState } from "react";
import { analyzeTrendQuery } from "@/services/trend-analysis";
import type { RequestStatus, TrendAnalysis } from "@/types/trend";

interface UseMultiTrendAnalysisResult {
  status: RequestStatus;
  items: TrendAnalysis[];
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMultiTrendAnalysis(
  queries: string[],
): UseMultiTrendAnalysisResult {
  const [status, setStatus] = useState<RequestStatus>("empty");
  const [items, setItems] = useState<TrendAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const normalized = [...new Set(queries.map((q) => q.trim()).filter(Boolean))];

    if (normalized.length === 0) {
      setStatus("empty");
      setItems([]);
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const results: TrendAnalysis[] = [];

      for (const query of normalized) {
        const result = await analyzeTrendQuery(query);
        results.push(result);
        setItems([...results]);
      }

      setStatus("success");
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : "Unknown Error");
      setStatus("error");
    }
  }, [queries]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, items, error, refresh };
}
