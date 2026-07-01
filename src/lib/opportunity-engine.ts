import type { TrendStage } from "@/types/trend";

export interface OpportunityScoreInput {
  /** 趋势热度，0–100 */
  trendHeat: number;
  /** 趋势生命周期阶段 */
  lifecycle: TrendStage;
  /** 竞争度，0–100，数值越高表示竞争越激烈 */
  competition: number;
}

export interface OpportunityScoreResult {
  score: number;
  reason: string;
}

const TREND_WEIGHT = 0.5;
const LIFECYCLE_WEIGHT = 0.3;
const COMPETITION_WEIGHT = -0.2;

const LIFECYCLE_SCORES: Record<TrendStage, number> = {
  Emerging: 100,
  Growing: 80,
  Peak: 50,
  Declining: 20,
};

export function getLifecycleScore(stage: TrendStage): number {
  return LIFECYCLE_SCORES[stage];
}

export function calculateOpportunityScore(
  input: OpportunityScoreInput,
): OpportunityScoreResult {
  const trendHeat = clamp(input.trendHeat, 0, 100);
  const competition = clamp(input.competition, 0, 100);
  const lifecycleScore = getLifecycleScore(input.lifecycle);

  const rawScore =
    trendHeat * TREND_WEIGHT +
    lifecycleScore * LIFECYCLE_WEIGHT +
    competition * COMPETITION_WEIGHT;

  const score = Math.round(clamp(rawScore, 0, 100));
  const reason = buildReason({
    trendHeat,
    lifecycle: input.lifecycle,
    lifecycleScore,
    competition,
    score,
  });

  return { score, reason };
}

function buildReason({
  trendHeat,
  lifecycle,
  lifecycleScore,
  competition,
  score,
}: {
  trendHeat: number;
  lifecycle: TrendStage;
  lifecycleScore: number;
  competition: number;
  score: number;
}): string {
  const isHotTrend = trendHeat >= 80;
  const isLowCompetition = competition <= 35;
  const isHighCompetition = competition >= 65;
  const isEarlyLifecycle = lifecycleScore >= 80;
  const isLateLifecycle = lifecycle === "Peak" || lifecycle === "Declining";

  if (isHotTrend && isLowCompetition && isEarlyLifecycle) {
    return "趋势热度高且竞争较低，适合优先布局。";
  }

  if (isHotTrend && isLowCompetition) {
    return "趋势热度高、竞争压力可控，建议尽快测款验证。";
  }

  if (isHotTrend && isHighCompetition) {
    return "趋势热度高但竞争加剧，建议差异化设计后快速上架。";
  }

  if (isEarlyLifecycle && isLowCompetition) {
    return "趋势处于早期窗口且竞争较低，具备先发优势。";
  }

  if (lifecycle === "Peak" && score >= 50) {
    return "趋势处于峰值阶段，建议抓住剩余窗口期快速切入。";
  }

  if (lifecycle === "Declining") {
    return "趋势进入衰退期，不建议大量备货，可做轻量验证。";
  }

  if (isHighCompetition) {
    return "竞争较为激烈，建议聚焦细分款式或组合装切入。";
  }

  if (score >= 70) {
    return "综合评分较高，具备较好的上架价值。";
  }

  if (score >= 50) {
    return "机会中等，建议小批量测试后再决定是否加码。";
  }

  return "当前机会有限，建议持续观察信号变化后再行动。";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
