import { forecastData } from "@/data/forecast-data";
import { topTrends } from "@/lib/mock-data";
import type { Trend } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";
import {
  TrendComparisonResultSchema,
  type ComparisonRankingItem,
  type TrendComparisonResult,
} from "@/types/comparison";

const WEIGHTS = {
  score: 0.4,
  forecast90: 0.3,
  growth: 0.2,
  confidence: 0.1,
} as const;

const STAGE_LABELS: Record<Trend["stage"], string> = {
  Emerging: "新兴",
  Growing: "增长中",
  Peak: "峰值",
  Declining: "衰退中",
};

interface TrendComparisonInput {
  trend: Trend;
  forecast: TrendForecast;
}

export function compareTrends(trendNames: string[]): TrendComparisonResult {
  const inputs = trendNames.map((name) => resolveTrendInput(name));
  const ranking = inputs
    .map(({ trend, forecast }) => buildRankingItem(trend, forecast))
    .sort((a, b) => b.comparisonScore - a.comparisonScore);

  const top = ranking[0];
  const topInput = inputs.find((item) => item.trend.name === top.trendName);

  return TrendComparisonResultSchema.parse({
    ranking,
    overallRecommendation: buildOverallRecommendation(
      top,
      topInput?.trend,
      topInput?.forecast,
    ),
  });
}

function resolveTrendInput(trendName: string): TrendComparisonInput {
  const trend = topTrends.find(
    (item) => item.name.toLowerCase() === trendName.trim().toLowerCase(),
  );

  if (!trend) {
    throw new Error(`Trend not found: ${trendName}`);
  }

  const forecast = forecastData.find((item) => item.trendId === trend.slug);

  if (!forecast) {
    throw new Error(`Forecast not found for trend: ${trendName}`);
  }

  return { trend, forecast };
}

function buildRankingItem(
  trend: Trend,
  forecast: TrendForecast,
): ComparisonRankingItem {
  const comparisonScore = calculateComparisonScore(trend, forecast);

  return {
    trendName: trend.name,
    comparisonScore,
    reason: buildReason(trend, forecast, comparisonScore),
  };
}

export function calculateComparisonScore(
  trend: Trend,
  forecast: TrendForecast,
): number {
  const rawScore =
    trend.score * WEIGHTS.score +
    forecast.forecast90 * WEIGHTS.forecast90 +
    trend.growth * WEIGHTS.growth +
    forecast.confidence * WEIGHTS.confidence;

  return Math.round(rawScore * 10) / 10;
}

function buildReason(
  trend: Trend,
  forecast: TrendForecast,
  comparisonScore: number,
): string {
  return [
    `${trend.name} 综合对比评分 ${comparisonScore}。`,
    `当前热度 ${trend.score}（权重 40%）、`,
    `90 天预测 ${forecast.forecast90}（权重 30%）、`,
    `增速 ${trend.growth}%（权重 20%）、`,
    `可信度 ${forecast.confidence}（权重 10%）。`,
    `阶段：${STAGE_LABELS[trend.stage]}，主要市场 ${trend.primaryMarket}。`,
  ].join("");
}

function buildOverallRecommendation(
  top: ComparisonRankingItem,
  trend?: Trend,
  forecast?: TrendForecast,
): string {
  if (!trend || !forecast) {
    return `推荐优先关注 ${top.trendName}，其综合对比评分 ${top.comparisonScore} 在参与对比的趋势中最高。`;
  }

  const forecastDirection =
    forecast.forecast90 > trend.score
      ? "90 天预测仍具上升空间"
      : forecast.forecast90 < trend.score
        ? "90 天预测有所回落，需控制备货节奏"
        : "90 天预测保持稳定";

  return [
    `推荐优先布局 ${top.trendName}。`,
    `综合对比评分 ${top.comparisonScore} 位列第一，`,
    `当前热度 ${trend.score}、增速 ${trend.growth}%，${forecastDirection}。`,
    trend.marketOpportunity,
  ].join("");
}
