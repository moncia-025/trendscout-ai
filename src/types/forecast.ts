export interface TrendForecast {
  trendId: string;

  forecast30: number;
  forecast60: number;
  forecast90: number;

  confidence: number;

  predictedPeakDay: number;

  predictedDeclineDay: number;
}
