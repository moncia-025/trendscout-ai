"use client";

import { useCallback, useEffect, useState } from "react";
import { analyzeTrendQuery } from "@/services/trend-analysis";
import type { RequestStatus, TrendAnalysis } from "@/types/trend";

interface UseMultiTrendAnalysisOptions {
  autoStart?: boolean;
}

interface UseMultiTrendAnalysisResult {
  status: RequestStatus;
  items: TrendAnalysis[];
  error: string | null;
  refresh: () => Promise<void>;
}

function normalizeQueries(queries: string[]): string[] {
  return [...new Set(queries.map((q) => q.trim()).filter(Boolean))];
}

export function useMultiTrendAnalysis(
  queries: string[],
  options: UseMultiTrendAnalysisOptions = {},
): UseMultiTrendAnalysisResult {
  const { autoStart = false } = options;
  const [status, setStatus] = useState<RequestStatus>(() => {
    return normalizeQueries(queries).length === 0 ? "empty" : "idle";
  });
  const [items, setItems] = useState<TrendAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const normalized = normalizeQueries(queries);

    if (normalized.length === 0) {
      setStatus("empty");
      setItems([]);
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);

    const results: TrendAnalysis[] = [];

    try {
      for (const query of normalized) {
        const result = await analyzeTrendQuery(query);
        results.push(result);
        setItems([...results]);
      }

      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown Error");
      setStatus(results.length > 0 ? "success" : "error");
    }
  }, [queries]);

  useEffect(() => {
    const normalized = normalizeQueries(queries);

    if (normalized.length === 0) {
      setStatus("empty");
      setItems([]);
      setError(null);
      return;
    }

    if (!autoStart) {
      setStatus("idle");
      setItems([]);
      setError(null);
      return;
    }

    void refresh();
  }, [queries, autoStart, refresh]);

  return { status, items, error, refresh };
}
