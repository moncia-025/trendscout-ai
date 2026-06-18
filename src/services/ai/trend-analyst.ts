import { z } from "zod";
import type { Trend } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";
import { deepseek } from "@/services/ai/deepseek";
import { buildTrendAnalystMessages } from "@/services/ai/prompts";

export const TrendAnalystReportSchema = z.object({
  summary: z.string().min(1),
  opportunities: z.array(z.string().min(1)).min(1),
  risks: z.array(z.string().min(1)).min(1),
  skuSuggestions: z.array(z.string().min(1)).min(1),
  recommendation: z.string().min(1),
});

export type TrendAnalystReport = z.infer<typeof TrendAnalystReportSchema>;

const DEEPSEEK_MODEL = "deepseek-chat";

export async function analyzeTrend(
  trend: Trend,
  forecast: TrendForecast,
): Promise<TrendAnalystReport> {
  try {
    const response = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: buildTrendAnalystMessages(trend, forecast),
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek returned empty content");
    }

    const parsed: unknown = JSON.parse(content);
    return TrendAnalystReportSchema.parse(parsed);
  } catch {
    return buildFallbackTrendAnalystReport(trend, forecast);
  }
}

export function buildFallbackTrendAnalystReport(
  trend: Trend,
  forecast: TrendForecast,
): TrendAnalystReport {
  const direction =
    forecast.forecast90 > trend.score
      ? "上升"
      : forecast.forecast90 < trend.score
        ? "回落"
        : "持平";

  return {
    summary: `${trend.name} 当前评分 ${trend.score}，90 天预测 ${forecast.forecast90}，整体呈${direction}走势。${trend.insight}`,
    opportunities: [
      trend.marketOpportunity,
      trend.aiInsight.forecast,
      `${trend.primaryMarket} 市场 ${trend.opportunity.estimatedLifecycle} 内仍有机会窗口`,
    ],
    risks: [
      trend.riskAnalysis.explanation,
      `风险等级：${trend.riskAnalysis.level}`,
    ],
    skuSuggestions:
      trend.opportunity.recommendedSkus.length > 0
        ? trend.opportunity.recommendedSkus
        : trend.recommendedSkus.map((sku) => sku.name),
    recommendation: trend.riskAnalysis.strategy,
  };
}
