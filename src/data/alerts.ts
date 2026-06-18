import { forecastData } from "@/data/forecast-data";
import { topTrends } from "@/lib/mock-data";
import {
  generateTrendAlert,
  type TrendAlert,
} from "@/lib/alert-engine";

const LEVEL_ORDER: Record<TrendAlert["level"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const alerts: TrendAlert[] = topTrends
  .map((trend) => {
    const forecast = forecastData.find((item) => item.trendId === trend.slug);
    if (!forecast) return null;
    return generateTrendAlert(trend, forecast);
  })
  .filter((alert): alert is TrendAlert => alert !== null)
  .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
