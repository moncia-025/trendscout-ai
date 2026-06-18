import type { Trend } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";

const STAGE_LABELS: Record<Trend["stage"], string> = {
  Emerging: "新兴",
  Growing: "增长中",
  Peak: "峰值",
  Declining: "衰退中",
};

export function buildTrendAnalystSystemPrompt(): string {
  return [
    "你是一位专业的跨境电商趋势分析师，服务于 TrendScout AI 平台。",
    "请根据提供的趋势数据与 90 天预测结果，生成结构化分析报告。",
    "",
    "要求：",
    "1. 仅返回合法 JSON，不要包含 markdown 代码块或额外说明",
    "2. 所有字段内容使用中文",
    "3. 分析应结合趋势阶段、评分、增速、目标市场与预测曲线",
    "",
    "JSON 结构：",
    "{",
    '  "summary": "90天趋势总结（1-2句）",',
    '  "opportunities": ["市场机会1", "市场机会2"],',
    '  "risks": ["风险1", "风险2"],',
    '  "skuSuggestions": ["SKU建议1", "SKU建议2", "SKU建议3"],',
    '  "recommendation": "具体行动建议（1-2句）"',
    "}",
  ].join("\n");
}

export function buildTrendAnalystUserPrompt(
  trend: Trend,
  forecast: TrendForecast,
): string {
  const recommendedSkus = trend.recommendedSkus
    .map((sku) => `${sku.name}（竞争度 ${sku.competition}）`)
    .join("、");

  return [
    "请分析以下趋势并返回 JSON 报告：",
    "",
    "【趋势信息】",
    `- 名称：${trend.name}`,
    `- 阶段：${STAGE_LABELS[trend.stage]}（${trend.stage}）`,
    `- 当前评分：${trend.score}`,
    `- 增速：${trend.growth}%`,
    `- 主要市场：${trend.primaryMarket}`,
    `- 趋势洞察：${trend.insight}`,
    `- 市场机会：${trend.marketOpportunity}`,
    `- 已有 SKU 信号：${recommendedSkus || "无"}`,
    `- 风险等级：${trend.riskAnalysis.level}`,
    `- 风险说明：${trend.riskAnalysis.explanation}`,
    "",
    "【90 天预测】",
    `- 30 天预测评分：${forecast.forecast30}`,
    `- 60 天预测评分：${forecast.forecast60}`,
    `- 90 天预测评分：${forecast.forecast90}`,
    `- 预测可信度：${forecast.confidence}`,
    `- 预计峰值时间：${formatPeakDay(forecast.predictedPeakDay)}`,
    `- 预计衰退时间：${formatDeclineDay(forecast.predictedDeclineDay)}`,
  ].join("\n");
}

export function buildTrendAnalystMessages(
  trend: Trend,
  forecast: TrendForecast,
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: buildTrendAnalystSystemPrompt() },
    { role: "user", content: buildTrendAnalystUserPrompt(trend, forecast) },
  ];
}

function formatPeakDay(days: number): string {
  if (days === 0) return "已处于当前阶段";
  return `${days} 天`;
}

function formatDeclineDay(days: number): string {
  if (days === 0) return "暂无明确衰退信号";
  return `${days} 天`;
}
