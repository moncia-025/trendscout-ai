import type { Trend, TrendStage } from "@/lib/mock-data";
import type { SkuOpportunity, SkuSignal } from "@/types/sku";

const TREND_HEAT_WEIGHT = 0.3;
const LIFECYCLE_WEIGHT = 0.2;
const MARGIN_WEIGHT = 0.25;
const LOGISTICS_WEIGHT = 0.15;
const COMPETITION_WEIGHT = 0.1;

const LIFECYCLE_SCORES: Record<TrendStage, number> = {
  Emerging: 100,
  Growing: 80,
  Peak: 50,
  Declining: 20,
};

const LIFECYCLE_DAYS: Record<TrendStage, number> = {
  Emerging: 120,
  Growing: 90,
  Peak: 45,
  Declining: 15,
};

export function calculateSkuOpportunity(
  trend: Trend,
  sku: SkuSignal,
): SkuOpportunity {
  const trendHeat = clamp(trend.score, 0, 100);
  const lifecycleScore = LIFECYCLE_SCORES[trend.stage];
  const margin = clamp(sku.margin, 0, 100);
  const logistics = clamp(sku.logistics, 0, 100);
  const competition = clamp(sku.competition, 0, 100);

  const rawOpportunity =
    trendHeat * TREND_HEAT_WEIGHT +
    lifecycleScore * LIFECYCLE_WEIGHT +
    margin * MARGIN_WEIGHT +
    logistics * LOGISTICS_WEIGHT -
    competition * COMPETITION_WEIGHT;

  const opportunityScore = Math.round(clamp(rawOpportunity, 0, 100));
  const estimatedProfitMargin = round(margin * 0.7, 1);
  const estimatedLifecycleDays = LIFECYCLE_DAYS[trend.stage];
  const recommendedInventory = getRecommendedInventory(opportunityScore);
  const reasonPoints = buildReasonPoints({
    competition,
    margin,
    logistics,
    productionDifficulty: clamp(sku.productionDifficulty, 0, 100),
    trendStage: trend.stage,
  });
  const reason = reasonPoints.join("；");

  return {
    sku,
    opportunityScore,
    estimatedProfitMargin,
    estimatedLifecycleDays,
    recommendedInventory,
    reason,
    reasonPoints,
  };
}

function getRecommendedInventory(opportunityScore: number): number {
  if (opportunityScore >= 85) return 500;
  if (opportunityScore >= 70) return 300;
  if (opportunityScore >= 55) return 100;
  return 50;
}

function buildReasonPoints({
  competition,
  margin,
  logistics,
  productionDifficulty,
  trendStage,
}: {
  competition: number;
  margin: number;
  logistics: number;
  productionDifficulty: number;
  trendStage: TrendStage;
}): string[] {
  const points: string[] = [];

  if (competition <= 35) {
    points.push("竞争较低");
  } else if (competition >= 65) {
    points.push("竞争较为激烈");
  } else {
    points.push("竞争适中");
  }

  if (logistics >= 80) {
    points.push("物流成本低");
  } else if (logistics >= 60) {
    points.push("物流成本可控");
  } else {
    points.push("物流成本偏高");
  }

  if (margin >= 75) {
    points.push("利润空间高");
  } else if (margin >= 55) {
    points.push("利润空间尚可");
  } else {
    points.push("利润空间一般");
  }

  if (productionDifficulty <= 30) {
    points.push("生产门槛低");
  }

  if (trendStage === "Growing" || trendStage === "Emerging") {
    points.push("趋势窗口期较好");
  } else if (trendStage === "Peak") {
    points.push("需抓住峰值窗口");
  }

  return points;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
