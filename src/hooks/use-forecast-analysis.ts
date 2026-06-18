"use client";

import { useEffect, useState } from "react";
import { forecastData } from "@/data/forecast-data";
import { topTrends } from "@/lib/mock-data";

export type ForecastOutlook = "bullish" | "bearish" | "neutral";

export interface ForecastAnalysisTrend {
  trendName: string;
  outlook: ForecastOutlook;
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendation: string;
  confidence: number;
}

export interface ForecastAnalysisData {
  overview: string;
  highlights: string[];
  trends: ForecastAnalysisTrend[];
}

interface ForecastAnalysisRequestTrend {
  name: string;
  score: number;
  stage: string;
  forecast30: number;
  forecast60: number;
  forecast90: number;
  confidence: number;
}

function buildRequestPayload(): { trends: ForecastAnalysisRequestTrend[] } {
  const trends = topTrends
    .map((trend) => {
      const forecast = forecastData.find((item) => item.trendId === trend.slug);
      if (!forecast) return null;

      return {
        name: trend.name,
        score: trend.score,
        stage: trend.stage as string,
        forecast30: forecast.forecast30,
        forecast60: forecast.forecast60,
        forecast90: forecast.forecast90,
        confidence: forecast.confidence,
      } satisfies ForecastAnalysisRequestTrend;
    })
    .filter((item): item is ForecastAnalysisRequestTrend => item !== null);

  return { trends };
}

export function useForecastAnalysis() {
  const [data, setData] = useState<ForecastAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalysis() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/forecast-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildRequestPayload()),
        });

        const result: unknown = await response.json();

        if (
          !response.ok ||
          (typeof result === "object" &&
            result !== null &&
            "success" in result &&
            result.success === false)
        ) {
          const message =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "Failed to fetch forecast analysis";
          throw new Error(message);
        }

        if (!cancelled) {
          setData(result as ForecastAnalysisData);
          setFetchedAt(new Date().toISOString());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown Error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchAnalysis();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error, fetchedAt };
}
