export type ForecastOutlook = "bullish" | "bearish" | "neutral";

export interface TrendForecastReport {
  trendId: string;
  trendName: string;
  outlook: ForecastOutlook;
  outlookLabel: string;
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendation: string;
  confidence: number;
}

export interface ForecastAiReport {
  overview: string;
  highlights: string[];
  trends: TrendForecastReport[];
  generatedAt: string;
}
