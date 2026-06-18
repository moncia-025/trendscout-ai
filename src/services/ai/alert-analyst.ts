import { z } from "zod";
import { deepseek } from "@/services/ai/deepseek";

export const AlertAnalysisSchema = z.object({
  risk: z.array(z.string().min(1)).min(1),
  opportunities: z.array(z.string().min(1)).min(1),
  recommendation: z.string().min(1),
});

export type AlertAnalysisInput = {
  trendName: string;
  score: number;
  forecast90: number;
  stage: string;
};

export type AlertAnalysisResult = z.infer<typeof AlertAnalysisSchema>;

const DEEPSEEK_MODEL = "deepseek-chat";

const STAGE_LABELS: Record<string, string> = {
  Emerging: "新兴",
  Growing: "增长中",
  Peak: "峰值",
  Declining: "衰退中",
  新兴: "新兴",
  增长中: "增长中",
  峰值: "峰值",
  衰退中: "衰退中",
};

export async function analyzeAlert(
  input: AlertAnalysisInput,
): Promise<AlertAnalysisResult> {
  try {
    const response = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: buildAlertAnalystMessages(input),
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek returned empty content");
    }

    const parsed: unknown = JSON.parse(content);
    return AlertAnalysisSchema.parse(parsed);
  } catch {
    return buildFallbackAlertAnalysis(input);
  }
}

function buildAlertAnalystMessages(
  input: AlertAnalysisInput,
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: buildUserPrompt(input) },
  ];
}

function buildSystemPrompt(): string {
  return [
    "你是一名跨境电商趋势分析师。",
    "",
    "要求：",
    "1. 仅输出 JSON，禁止 Markdown，禁止解释",
    "2. 所有字段内容使用中文",
    "",
    "JSON 结构：",
    "{",
    '  "risk": ["风险1", "风险2"],',
    '  "opportunities": ["机会1", "机会2"],',
    '  "recommendation": "具体行动建议（1-2句）"',
    "}",
  ].join("\n");
}

function buildUserPrompt(input: AlertAnalysisInput): string {
  const stageLabel = STAGE_LABELS[input.stage] ?? input.stage;
  const delta = input.forecast90 - input.score;

  return [
    "请分析以下趋势预警信息并返回 JSON：",
    "",
    `- 趋势名称：${input.trendName}`,
    `- 当前评分：${input.score}`,
    `- 未来 90 天预测：${input.forecast90}`,
    `- 趋势阶段：${stageLabel}`,
    `- 预测变化：${delta >= 0 ? `+${delta}` : delta} 分`,
  ].join("\n");
}

export function buildFallbackAlertAnalysis(
  input: AlertAnalysisInput,
): AlertAnalysisResult {
  const delta = input.forecast90 - input.score;

  if (delta >= 10) {
    return {
      risk: [
        "趋势快速升温可能吸引大量卖家涌入，竞争加剧",
        "备货节奏过快可能导致峰值后库存积压",
      ],
      opportunities: [
        `${input.trendName} 90 天预测显著提升，适合提前布局`,
        "当前阶段仍处窗口期，可优先测试低竞争 SKU",
      ],
      recommendation: `建议优先在 ${input.trendName} 关联品类小批量测款，并在 30–45 天内完成放量决策。`,
    };
  }

  if (delta >= 5) {
    return {
      risk: ["趋势增速有限，过度投入可能回报不足", "需关注同类趋势分流用户注意力"],
      opportunities: [
        `${input.trendName} 预测评分稳步上升，具备中期布局价值`,
        "适合以组合装或差异化 SKU 切入市场",
      ],
      recommendation: `建议以低 MOQ 验证 ${input.trendName} 核心 SKU，持续跟踪 90 天预测变化。`,
    };
  }

  if (delta < 0) {
    return {
      risk: [
        "90 天预测评分低于当前热度，趋势可能进入退潮",
        "此时追加备货存在滞销风险",
      ],
      opportunities: ["可聚焦利润回收与现有 SKU 优化", "关注细分场景仍具需求的长尾品类"],
      recommendation: `建议以利润回收为主，避免对 ${input.trendName} 重仓备货。`,
    };
  }

  return {
    risk: ["趋势变化有限，盲目扩品可能浪费测款成本"],
    opportunities: ["可维持现有 SKU 运营", "等待更明确的爆发信号后再加大投入"],
    recommendation: `建议持续观察 ${input.trendName} 的市场信号，暂不建议大规模投入。`,
  };
}
