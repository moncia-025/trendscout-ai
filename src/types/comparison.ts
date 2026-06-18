import { z } from "zod";

export const ComparisonRankingItemSchema = z.object({
  trendName: z.string(),
  comparisonScore: z.number(),
  reason: z.string(),
});

export const TrendComparisonResultSchema = z.object({
  ranking: z.array(ComparisonRankingItemSchema).min(1),
  overallRecommendation: z.string(),
});

export const TrendComparisonRequestSchema = z.union([
  z.object({
    trends: z.array(z.string().trim().min(1)).min(1),
  }),
  z
    .array(z.string().trim().min(1))
    .min(1)
    .transform((trends) => ({ trends })),
]);

export type ComparisonRankingItem = z.infer<
  typeof ComparisonRankingItemSchema
>;
export type TrendComparisonResult = z.infer<
  typeof TrendComparisonResultSchema
>;
export type TrendComparisonRequest = z.infer<
  typeof TrendComparisonRequestSchema
>;
