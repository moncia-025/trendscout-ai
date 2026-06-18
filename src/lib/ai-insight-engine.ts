import type { Trend } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";

export type TrendSentiment =
  | "Bullish"
  | "Neutral"
  | "Bearish";

export interface TrendInsight {
  sentiment: TrendSentiment;

  summary: string;

  keywords: string[];

  recommendation: string;
}

export interface GlobalInsight {
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;

  summary: string;
}

export function generateTrendInsight(
  trend: Trend,
  forecast: TrendForecast,
): TrendInsight {
  const sentiment = getSentiment(
    forecast.forecast30,
    forecast.forecast90,
    trend.stage,
  );

  const keywords = buildKeywords(trend);

  return {
    sentiment,

    summary: buildSummary(
      sentiment,
      trend,
      forecast,
    ),

    recommendation: buildRecommendation(
      sentiment,
      trend,
    ),

    keywords,
  };
}

export function generateGlobalInsight(
  trends: Trend[],
  forecasts: TrendForecast[],
): GlobalInsight {
  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;

  trends.forEach((trend) => {
    const forecast = forecasts.find(
      (item) => item.trendId === trend.slug,
    );

    if (!forecast) return;

    const sentiment = getSentiment(
      forecast.forecast30,
      forecast.forecast90,
      trend.stage,
    );

    if (sentiment === "Bullish") bullishCount++;
    else if (sentiment === "Bearish") bearishCount++;
    else neutralCount++;
  });

  return {
    bullishCount,
    bearishCount,
    neutralCount,

    summary: buildGlobalSummary(
      bullishCount,
      bearishCount,
      neutralCount,
    ),
  };
}

function getSentiment(
  forecast30: number,
  forecast90: number,
  stage: Trend["stage"],
): TrendSentiment {
  if (
    forecast90 >= forecast30 &&
    stage !== "Declining"
  ) {
    return "Bullish";
  }

  if (forecast90 < forecast30) {
    return "Bearish";
  }

  return "Neutral";
}

function buildSummary(
  sentiment: TrendSentiment,
  trend: Trend,
  forecast: TrendForecast,
): string {
  if (sentiment === "Bullish") {
    return `${trend.name}未来90天预计保持增长趋势，评分有继续提升空间。`;
  }

  if (sentiment === "Bearish") {
    return `${trend.name}未来90天热度预计逐步回落，需关注趋势衰减风险。`;
  }

  return `${trend.name}预计保持稳定表现，短期内不会出现明显变化。`;
}

function buildRecommendation(
  sentiment: TrendSentiment,
  trend: Trend,
): string {
  if (sentiment === "Bullish") {
    return "建议提前布局相关SKU并进行市场验证。";
  }

  if (sentiment === "Bearish") {
    return "建议以利润回收为主，避免重仓备货。";
  }

  return "建议持续观察趋势信号后再决定投入规模。";
}

function buildKeywords(
  trend: Trend,
): string[] {
  const result: string[] = [];

  if (trend.growth >= 25) {
    result.push("高速增长");
  }

  if (trend.score >= 85) {
    result.push("高热度");
  }

  if (
    trend.stage === "Emerging" ||
    trend.stage === "Growing"
  ) {
    result.push("早期窗口");
  }

  if (trend.stage === "Peak") {
    result.push("峰值阶段");
  }

  return result;
}

function buildGlobalSummary(
  bullish: number,
  bearish: number,
  neutral: number,
): string {
  if (bullish > bearish) {
    return `当前市场呈现增长信号，新兴趋势机会较多，共发现 ${bullish} 条看涨趋势。`;
  }

  if (bearish > bullish) {
    return `当前市场热度分化明显，多数趋势开始降温，共发现 ${bearish} 条看跌趋势。`;
  }

  return "当前市场整体保持稳定，建议持续跟踪趋势变化。";
}