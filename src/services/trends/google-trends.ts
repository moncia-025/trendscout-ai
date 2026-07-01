import { z } from "zod";
import googleTrends from "google-trends-api";

export const TrendDataPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export const GoogleTrendsResultSchema = z.object({
  keyword: z.string(),
  trendData: z.array(TrendDataPointSchema).min(1),
  currentScore: z.number(),
  growthRate: z.number(),
});

export type TrendDataPoint = z.infer<typeof TrendDataPointSchema>;
export type GoogleTrendsResult = z.infer<typeof GoogleTrendsResultSchema>;

const DAYS = 30;

interface GoogleTimelineResponse {
  default?: {
    timelineData?: Array<{
      formattedTime?: string;
      time?: string;
      value?: number[];
    }>;
  };
}

export async function getGoogleTrends(
  keyword: string,
): Promise<GoogleTrendsResult> {
  const normalizedKeyword = keyword.trim();

  if (!normalizedKeyword) {
    throw new Error("Keyword is required");
  }

  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(endTime.getDate() - DAYS);

  const raw = await googleTrends.interestOverTime({
    keyword: normalizedKeyword,
    startTime,
    endTime,
  });

  const parsed = parseGoogleTimeline(raw);
  const trendData = normalizeTrendData(parsed, DAYS);

  if (trendData.length === 0) {
    throw new Error("Google Trends returned empty timeline");
  }

  const currentScore = trendData[trendData.length - 1]?.value ?? 0;
  const growthRate = calculateGrowthRate(trendData);

  return GoogleTrendsResultSchema.parse({
    keyword: normalizedKeyword,
    trendData,
    currentScore,
    growthRate,
  });
}

function parseGoogleTimeline(raw: string): GoogleTimelineResponse {
  const parsed: unknown = JSON.parse(raw);
  return parsed as GoogleTimelineResponse;
}

function normalizeTrendData(
  response: GoogleTimelineResponse,
  maxPoints: number,
): TrendDataPoint[] {
  const timeline = response.default?.timelineData ?? [];

  return timeline
    .map((point) => {
      const value = point.value?.[0] ?? 0;
      const date = point.time
        ? new Date(Number(point.time) * 1000).toISOString().slice(0, 10)
        : (point.formattedTime ?? "");

      return {
        date,
        value: clamp(value, 0, 100),
      };
    })
    .filter((point) => point.date.length > 0)
    .slice(-maxPoints);
}

function calculateGrowthRate(trendData: TrendDataPoint[]): number {
  if (trendData.length < 2) return 0;

  const first = trendData[0]?.value ?? 0;
  const last = trendData[trendData.length - 1]?.value ?? 0;

  if (first === 0) {
    return last > 0 ? 100 : 0;
  }

  return Math.round(((last - first) / first) * 100);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
