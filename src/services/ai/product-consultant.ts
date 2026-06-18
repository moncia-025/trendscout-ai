import { forecastData } from "@/data/forecast-data";
import { topTrends } from "@/lib/mock-data";
import { calculateOpportunityScore } from "@/lib/opportunity-engine";
import { deepseek } from "@/services/ai/deepseek";
import {
  ProductConsultantReportSchema,
  type ProductConsultantReport,
} from "@/types/consultant";

const DEEPSEEK_MODEL = "deepseek-chat";

const STAGE_LABELS: Record<string, string> = {
  Emerging: "新兴",
  Growing: "增长中",
  Peak: "峰值",
  Declining: "衰退中",
};

export async function consultProduct(): Promise<ProductConsultantReport> {
  try {
    const response = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: buildProductConsultantMessages(),
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek returned empty content");
    }

    const parsed: unknown = JSON.parse(content);
    return ProductConsultantReportSchema.parse(parsed);
  } catch {
    return buildFallbackProductConsultantReport();
  }
}

function buildProductConsultantMessages(): Array<{
  role: "system" | "user";
  content: string;
}> {
  return [
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: buildUserPrompt() },
  ];
}

function buildSystemPrompt(): string {
  return [
    "你是一名跨境电商 AI 产品顾问，服务于 TrendScout AI 平台。",
    "请根据提供的趋势与预测数据，为卖家推荐最优趋势与 SKU 组合。",
    "",
    "要求：",
    "1. 仅输出 JSON，禁止 Markdown，禁止解释",
    "2. 所有字段内容使用中文",
    "3. opportunityScore 为 0-100 的整数",
    "4. profitEstimate 为预估毛利率区间，如 \"35%-45%\"",
    "",
    "JSON 结构：",
    "{",
    '  "recommendedTrend": "推荐趋势名称",',
    '  "recommendedSkus": ["SKU1", "SKU2", "SKU3"],',
    '  "opportunityScore": 85,',
    '  "profitEstimate": "35%-45%",',
    '  "risks": ["风险1", "风险2"],',
    '  "recommendation": "综合行动建议（1-2句）"',
    "}",
  ].join("\n");
}

function buildUserPrompt(): string {
  const trendBlocks = topTrends
    .map((trend) => {
      const forecast = forecastData.find((item) => item.trendId === trend.slug);
      const skus = trend.recommendedSkus
        .map((sku) => `${sku.name}（竞争度 ${sku.competition}）`)
        .join("、");

      return [
        `【${trend.name}】`,
        `- 阶段：${STAGE_LABELS[trend.stage] ?? trend.stage}`,
        `- 当前评分：${trend.score}`,
        `- 增速：${trend.growth}%`,
        `- 主要市场：${trend.primaryMarket}`,
        `- 趋势洞察：${trend.insight}`,
        `- 市场机会：${trend.marketOpportunity}`,
        `- 候选 SKU：${skus || "无"}`,
        `- 风险等级：${trend.riskAnalysis.level}`,
        `- 风险说明：${trend.riskAnalysis.explanation}`,
        forecast
          ? `- 90天预测：${forecast.forecast90}（可信度 ${forecast.confidence}）`
          : "- 90天预测：无",
      ].join("\n");
    })
    .join("\n\n");

  return [
    "请基于以下趋势与预测数据，输出跨境电商选品咨询 JSON 报告：",
    "",
    trendBlocks,
  ].join("\n");
}

export function buildFallbackProductConsultantReport(): ProductConsultantReport {
  const recommended = [...topTrends].sort((a, b) => b.score - a.score)[0];
  const forecast = forecastData.find(
    (item) => item.trendId === recommended.slug,
  );

  const avgCompetition =
    recommended.recommendedSkus.length > 0
      ? Math.round(
          recommended.recommendedSkus.reduce(
            (sum, sku) => sum + sku.competition,
            0,
          ) / recommended.recommendedSkus.length,
        )
      : 40;

  const { score } = calculateOpportunityScore({
    trendHeat: recommended.score,
    lifecycle: recommended.stage,
    competition: avgCompetition,
  });

  const profitEstimate =
    recommended.stage === "Peak"
      ? "30%-40%"
      : recommended.stage === "Emerging"
        ? "40%-55%"
        : "35%-50%";

  return {
    recommendedTrend: recommended.name,
    recommendedSkus:
      recommended.opportunity.recommendedSkus.length > 0
        ? recommended.opportunity.recommendedSkus.slice(0, 4)
        : recommended.recommendedSkus.map((sku) => sku.name).slice(0, 4),
    opportunityScore: score,
    profitEstimate,
    risks: [
      recommended.riskAnalysis.explanation,
      `风险等级：${recommended.riskAnalysis.level}`,
      forecast && forecast.forecast90 < recommended.score
        ? "90 天预测评分回落，需控制备货节奏"
        : "趋势窗口有限，建议尽快完成测款",
    ],
    recommendation: `${recommended.name} 在 ${recommended.primaryMarket} 市场具备较高机会，${recommended.riskAnalysis.strategy}`,
  };
}
