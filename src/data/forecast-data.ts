import { topTrends } from "@/lib/mock-data";
import { forecastTrend } from "@/lib/forecast-engine";

export const forecastData = topTrends.map(forecastTrend);
