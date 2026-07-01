import type { EngineTrend, TrendStage } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";

interface ForecastStageConfig {
  d30: number;
  d60: number;
  d90: number;
  peakDay: number;
  declineDay: number;
}

const FORECAST_MAP: Record<TrendStage, ForecastStageConfig> = {
  Emerging: {
    d30: 25,
    d60: 40,
    d90: 60,
    peakDay: 90,
    declineDay: 180,
  },
  Growing: {
    d30: 15,
    d60: 8,
    d90: -10,
    peakDay: 45,
    declineDay: 90,
  },
  Peak: {
    d30: -5,
    d60: -20,
    d90: -40,
    peakDay: 0,
    declineDay: 30,
  },
  Declining: {
    d30: -20,
    d60: -40,
    d90: -70,
    peakDay: 0,
    declineDay: 0,
  },
};

export function forecastTrend(trend: EngineTrend): TrendForecast {
  const config = FORECAST_MAP[trend.stage];
  const confidence = clamp(
    Math.round(trend.score * 0.7 + trend.growth * 0.3),
    50,
    95,
  );

  return {
    trendId: trend.slug,
    forecast30: clamp(trend.score + config.d30, 0, 100),
    forecast60: clamp(trend.score + config.d60, 0, 100),
    forecast90: clamp(trend.score + config.d90, 0, 100),
    confidence,
    predictedPeakDay: config.peakDay,
    predictedDeclineDay: config.declineDay,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
