import { z } from "zod";
import { topTrends } from "@/lib/mock-data";
import type { Trend, TrendStage } from "@/types/trend";
import type { TrendForecast } from "@/types/forecast";
import { analyzeTrend } from "@/services/ai/trend-analyst";

const TrendInputSchema = z.object({
  name: z.string().min(1),
  score: z.number(),
  stage: z.string().min(1),
  forecast30: z.number(),
  forecast60: z.number(),
  forecast90: z.number(),
  confidence: z.number(),
});

const RequestBodySchema = z.object({
  trends: z.array(TrendInputSchema).min(1),
});

type TrendInput = z.infer<typeof TrendInputSchema>;
type ForecastOutlook = "bullish" | "bearish" | "neutral";

interface TrendAnalysisItem {
  trendName: string;
  outlook: ForecastOutlook;
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendation: string;
  confidence: number;
}

interface ForecastAnalysisResponse {
  overview: string;
  highlights: string[];
  trends: TrendAnalysisItem[];
}

const STAGE_MAP: Record<string, TrendStage> = {
  Emerging: "Emerging",
  Growing: "Growing",
  Peak: "Peak",
  Declining: "Declining",
  新兴: "Emerging",
  增长中: "Growing",
  峰值: "Peak",
  衰退中: "Declining",
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = RequestBodySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid request body" },
        { status: 400 },
      );
    }

    const results = await Promise.all(
      parsed.data.trends.map((input) => analyzeTrendInput(input)),
    );

    const response: ForecastAnalysisResponse = {
      overview: buildOverview(results),
      highlights: buildHighlights(results),
      trends: results,
    };

    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}

async function analyzeTrendInput(
  input: TrendInput,
): Promise<TrendAnalysisItem> {
  const trend = resolveTrend(input);
  const forecast = buildForecast(input, trend.slug);
  const report = await analyzeTrend(trend, forecast);

  return {
    trendName: input.name,
    outlook: getOutlook(input.score, input.forecast90),
    summary: report.summary,
    keyPoints: [...report.opportunities, ...report.skuSuggestions],
    risks: report.risks,
    recommendation: report.recommendation,
    confidence: input.confidence,
  };
}

function resolveTrend(input: TrendInput): Trend {
  const matched = topTrends.find(
    (trend) => trend.name.toLowerCase() === input.name.toLowerCase(),
  );

  if (matched) {
    return {
      ...matched,
      score: input.score,
      stage: parseStage(input.stage),
    };
  }

  return buildStubTrend(input);
}

function buildForecast(input: TrendInput, trendId: string): TrendForecast {
  return {
    trendId,
    forecast30: input.forecast30,
    forecast60: input.forecast60,
    forecast90: input.forecast90,
    confidence: input.confidence,
    predictedPeakDay: 0,
    predictedDeclineDay: 0,
  };
}

function buildStubTrend(input: TrendInput): Trend {
  const stage = parseStage(input.stage);

  return {
    id: 0,
    slug: slugify(input.name),
    name: input.name,
    score: input.score,
    growth: 0,
    stage,
    primaryMarket: "未知",
    insight: `${input.name} 趋势待进一步分析。`,
    marketOpportunity: "基于预测数据评估市场机会。",
    aiInsight: {
      summary: `${input.name} 趋势分析`,
      spreadingCategories: [],
      forecast: `90 天预测评分 ${input.forecast90}`,
      signalNote: "数据来自 API 请求",
    },
    recommendedSkus: [],
    riskAnalysis: {
      level: "Medium",
      explanation: "输入数据有限，需结合更多市场信号判断风险。",
      strategy: "建议小批量测款并持续跟踪趋势变化。",
    },
    opportunity: {
      forecast: stage,
      estimatedLifecycle: "90 天",
      recommendedSkus: [],
      risk: "Medium",
    },
  };
}

function parseStage(stage: string): TrendStage {
  return STAGE_MAP[stage] ?? STAGE_MAP[stage.trim()] ?? "Emerging";
}

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function getOutlook(
  score: number,
  forecast90: number,
): ForecastOutlook {
  if (forecast90 > score) return "bullish";
  if (forecast90 < score) return "bearish";
  return "neutral";
}

function buildOverview(items: TrendAnalysisItem[]): string {
  const bullish = items.filter((item) => item.outlook === "bullish").length;
  const bearish = items.filter((item) => item.outlook === "bearish").length;
  const neutral = items.filter((item) => item.outlook === "neutral").length;

  if (bullish > bearish) {
    return `当前市场呈现增长信号，共 ${bullish} 条看涨、${bearish} 条看跌、${neutral} 条中性趋势。`;
  }

  if (bearish > bullish) {
    return `当前市场热度分化，共 ${bearish} 条看跌、${bullish} 条看涨、${neutral} 条中性趋势。`;
  }

  return `当前市场整体平稳，共 ${neutral} 条中性、${bullish} 条看涨、${bearish} 条看跌趋势。`;
}

function buildHighlights(items: TrendAnalysisItem[]): string[] {
  return items.slice(0, 3).map((item) => {
    const outlookLabel =
      item.outlook === "bullish"
        ? "看涨"
        : item.outlook === "bearish"
          ? "看跌"
          : "中性";
    return `${item.trendName}（${outlookLabel}）：${item.summary}`;
  });
}
