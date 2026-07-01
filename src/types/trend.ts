import { z } from "zod";

export const RecommendationSchema = z.union([
  z.string(),
  z.object({
    title: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    reason: z.string().optional(),
  }),
]);

export const TrendAnalysisSchema = z.object({
  keyword: z.string(),
  intent: z.string(),
  trend_stage: z.string(),
  trend_score: z.number(),
  product_score: z.number(),
  market_size: z.string(),
  competition: z.string(),
  opportunity_score: z.number(),
  risk_level: z.string(),
  recommendation: z.array(RecommendationSchema),
  insight: z.string(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

export type TrendAnalysis = z.infer<typeof TrendAnalysisSchema>;

export interface TrendResponse {
  success: boolean;
  data?: TrendAnalysis;
  error?: string;
}

export type TrendStage = "Emerging" | "Growing" | "Peak" | "Declining";

export type RiskLevel = "Low" | "Medium" | "High";

/** 规则引擎（Forecast / Alert）使用的趋势输入结构 */
export interface EngineTrend {
  slug: string;
  name: string;
  score: number;
  growth: number;
  stage: TrendStage;
  primaryMarket: string;
  opportunity: {
    recommendedSkus: string[];
  };
  riskAnalysis: {
    strategy: string;
  };
}

export type RequestStatus = "idle" | "loading" | "success" | "error" | "empty";

export function normalizeRecommendation(item: Recommendation): string {
  if (typeof item === "string") {
    return item;
  }

  return (
    item.title ??
    item.name ??
    item.description ??
    item.reason ??
    JSON.stringify(item)
  );
}

export function slugifyKeyword(keyword: string): string {
  return keyword.trim().toLowerCase().replace(/\s+/g, "-");
}

export function getTrendHref(keyword: string): string {
  return `/trend/${slugifyKeyword(keyword)}`;
}

export function parseDefaultQueries(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_DEFAULT_QUERIES ??
    process.env.DEFAULT_TREND_QUERIES ??
    "";

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
