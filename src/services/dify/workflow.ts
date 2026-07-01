import { z } from "zod";
import { formatAnalysisError } from "@/lib/format-analysis-error";
import {
  TrendAnalysisSchema,
  type TrendAnalysis,
} from "@/types/trend";

interface DifyWorkflowRunResponse {
  data?: {
    status?: string;
    outputs?: Record<string, unknown>;
    error?: string | null;
  };
  message?: string;
}

const DIFY_API_BASE =
  process.env.DIFY_API_BASE_URL ?? "http://localhost/v1";

/** V2 Workflow — 控制台: http://localhost/workflow/DYN8K1XKKPRPB8qO */
const DEFAULT_WORKFLOW_ID = "DYN8K1XKKPRPB8qO";

export async function runDifyTrendWorkflow(
  query: string,
): Promise<TrendAnalysis> {
  const apiKey = process.env.DIFY_API_KEY;
  const workflowId = process.env.DIFY_WORKFLOW_ID ?? DEFAULT_WORKFLOW_ID;

  if (!apiKey) {
    throw new Error("DIFY_API_KEY is not configured");
  }

  // 工作流 App 的 API Key 通常绑定到 /workflows/run，无需 URL 中的 workflowId
  const useWorkflowIdInPath = process.env.DIFY_USE_WORKFLOW_ID_PATH === "true";
  const endpoint = useWorkflowIdInPath
    ? `${DIFY_API_BASE}/workflows/${workflowId}/run`
    : `${DIFY_API_BASE}/workflows/run`;

  const timeoutMs = Number(process.env.DIFY_WORKFLOW_TIMEOUT_MS ?? 240_000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: { query },
        response_mode: "blocking",
        user: "trendscout-web",
      }),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error(formatAnalysisError(err));
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const text = await response.text();
    let message = text || response.statusText;

    try {
      const parsed: unknown = JSON.parse(text);
      if (
        parsed &&
        typeof parsed === "object" &&
        "message" in parsed &&
        typeof parsed.message === "string"
      ) {
        message = parsed.message;
      }
    } catch {
      // keep raw text
    }

    if (response.status === 401) {
      throw new Error(
        `Dify 密钥无效或未授权（401）。请在 Dify「后端服务 API → API 密钥」重新复制完整 Key 到 .env.local 的 DIFY_API_KEY，并重启 npm run dev。详情：${message}`,
      );
    }

    throw new Error(
      formatAnalysisError(
        new Error(`Dify workflow failed (${response.status}): ${message}`),
      ),
    );
  }

  const payload = (await response.json()) as DifyWorkflowRunResponse;

  if (payload.data?.status === "failed") {
    throw new Error(payload.data.error ?? "Dify workflow execution failed");
  }

  const outputs = payload.data?.outputs;

  if (!outputs) {
    throw new Error("Dify workflow returned empty outputs");
  }

  return parseDifyOutputs(outputs, query);
}

function parseDifyOutputs(
  outputs: Record<string, unknown>,
  query: string,
): TrendAnalysis {
  const direct = TrendAnalysisSchema.safeParse(outputs);

  if (direct.success) {
    return direct.data;
  }

  const jsonCandidate = findJsonCandidate(outputs);

  if (jsonCandidate) {
    const parsed = TrendAnalysisSchema.safeParse(jsonCandidate);

    if (parsed.success) {
      return parsed.data;
    }
  }

  const normalized = normalizeLegacyOutputs(outputs, query);
  const fallback = TrendAnalysisSchema.safeParse(normalized);

  if (fallback.success) {
    return fallback.data;
  }

  throw new Error("Unable to parse Dify workflow output into TrendAnalysis");
}

function findJsonCandidate(
  outputs: Record<string, unknown>,
): Record<string, unknown> | null {
  const keys = [
    "result",
    "output",
    "text",
    "answer",
    "json",
    "data",
    "trend_analysis",
  ];

  for (const key of keys) {
    const value = outputs[key];

    if (!value) {
      continue;
    }

    if (typeof value === "string") {
      try {
        const parsed: unknown = JSON.parse(value);

        if (parsed && typeof parsed === "object") {
          return parsed as Record<string, unknown>;
        }
      } catch {
        continue;
      }
    }

    if (typeof value === "object") {
      return value as Record<string, unknown>;
    }
  }

  return null;
}

function normalizeLegacyOutputs(
  outputs: Record<string, unknown>,
  query: string,
): Record<string, unknown> {
  const recommendation = outputs.recommendation;

  return {
    keyword: String(outputs.keyword ?? query),
    intent: String(outputs.intent ?? ""),
    trend_stage: String(outputs.trend_stage ?? outputs.trendStage ?? ""),
    trend_score: toNumber(outputs.trend_score ?? outputs.trendScore, 0),
    product_score: toNumber(outputs.product_score ?? outputs.productScore, 0),
    market_size: String(outputs.market_size ?? outputs.marketSize ?? ""),
    competition: String(outputs.competition ?? ""),
    opportunity_score: toNumber(
      outputs.opportunity_score ?? outputs.opportunityScore,
      0,
    ),
    risk_level: String(outputs.risk_level ?? outputs.riskLevel ?? ""),
    recommendation: Array.isArray(recommendation)
      ? recommendation
      : typeof recommendation === "string"
        ? recommendation.split(/[,，;；\n]/).map((item) => item.trim())
        : [],
    insight: String(outputs.insight ?? outputs.summary ?? ""),
  };
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}
