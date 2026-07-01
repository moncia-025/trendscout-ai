import type { EngineTrend } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";

export interface TrendAlert {
  trendId: string;
  trendName: string;
  level: "high" | "medium" | "low";
  score: number;
  title: string;
  message: string;
  action: string;
}

type AlertLevel = TrendAlert["level"];

const TITLES: Record<AlertLevel, string> = {
  high: "发现趋势爆发信号",
  medium: "趋势进入增长阶段",
  low: "趋势变化有限",
};

export function generateTrendAlert(
  trend: EngineTrend,
  forecast: TrendForecast,
): TrendAlert {
  const level = getAlertLevel(trend.score, forecast.forecast90);

  return {
    trendId: trend.slug,
    trendName: trend.name,
    level,
    score: trend.score,
    title: TITLES[level],
    message: buildMessage(trend, forecast, level),
    action: buildAction(trend, forecast, level),
  };
}

function getAlertLevel(score: number, forecast90: number): AlertLevel {
  const delta = forecast90 - score;

  if (delta >= 10) {
    return "high";
  }

  if (delta >= 5) {
    return "medium";
  }

  return "low";
}

function buildMessage(
  trend: EngineTrend,
  forecast: TrendForecast,
  level: AlertLevel,
): string {
  const delta = forecast.forecast90 - trend.score;

  if (level === "high") {
    return `${trend.name} 90 天预测评分 ${forecast.forecast90}，较当前 ${trend.score} 提升 ${delta} 分，出现明显爆发信号，${trend.primaryMarket} 市场窗口正在打开。`;
  }

  if (level === "medium") {
    return `${trend.name} 90 天预测评分 ${forecast.forecast90}，较当前 ${trend.score} 提升 ${delta} 分，趋势处于增长阶段，可开始小批量测款。`;
  }

  if (delta >= 0) {
    return `${trend.name} 90 天预测评分 ${forecast.forecast90}，与当前 ${trend.score} 相比变化有限，建议持续观察后再加大投入。`;
  }

  return `${trend.name} 90 天预测评分 ${forecast.forecast90}，较当前 ${trend.score} 回落 ${Math.abs(delta)} 分，趋势变化有限，宜谨慎布局。`;
}

function buildAction(
  trend: EngineTrend,
  forecast: TrendForecast,
  level: AlertLevel,
): string {
  if (level === "high") {
    return `优先在 ${trend.primaryMarket} 市场布局 ${trend.opportunity.recommendedSkus.slice(0, 2).join("、") || "核心 SKU"}，并在 ${forecast.predictedPeakDay || 45} 天内完成测款与放量。`;
  }

  if (level === "medium") {
    return `建议以低 MOQ 测试 ${trend.opportunity.recommendedSkus[0] ?? "关联 SKU"}，结合 ${trend.riskAnalysis.strategy}`;
  }

  return trend.riskAnalysis.strategy;
}
