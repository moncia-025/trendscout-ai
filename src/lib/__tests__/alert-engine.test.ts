import { describe, expect, it } from "vitest";
import { generateTrendAlert } from "@/lib/alert-engine";
import { getTrendBySlug } from "@/lib/mock-data";
import type { TrendForecast } from "@/types/forecast";
import type { Trend } from "@/types/trend";

function createForecast(
  overrides: Pick<TrendForecast, "forecast90"> &
    Partial<Omit<TrendForecast, "forecast90">>,
): TrendForecast {
  return {
    trendId: overrides.trendId ?? "test-trend",
    forecast30: overrides.forecast30 ?? 80,
    forecast60: overrides.forecast60 ?? 85,
    forecast90: overrides.forecast90,
    confidence: overrides.confidence ?? 80,
    predictedPeakDay: overrides.predictedPeakDay ?? 45,
    predictedDeclineDay: overrides.predictedDeclineDay ?? 90,
  };
}

function createTrend(overrides: Partial<Trend> & Pick<Trend, "score">): Trend {
  const stage = overrides.stage ?? "Emerging";

  return {
    id: overrides.id ?? 1,
    slug: overrides.slug ?? "test-trend",
    name: overrides.name ?? "Test Trend",
    score: overrides.score,
    growth: overrides.growth ?? 12,
    stage,
    primaryMarket: overrides.primaryMarket ?? "美国",
    insight: overrides.insight ?? "测试趋势洞察",
    marketOpportunity: overrides.marketOpportunity ?? "测试市场机会",
    aiInsight: overrides.aiInsight ?? {
      summary: "测试摘要",
      spreadingCategories: [],
      forecast: "测试预测",
      signalNote: "测试信号",
    },
    recommendedSkus: overrides.recommendedSkus ?? [],
    riskAnalysis: overrides.riskAnalysis ?? {
      level: "Medium",
      explanation: "测试风险说明",
      strategy: "优先小批量测款并持续跟踪趋势变化。",
    },
    opportunity: overrides.opportunity ?? {
      forecast: stage,
      estimatedLifecycle: "90 天",
      recommendedSkus: ["测试 SKU A", "测试 SKU B"],
      risk: "Medium",
    },
  };
}

describe("generateTrendAlert", () => {
  describe("Old Money 高优先级预警", () => {
    it("score=79 且 forecast90=100 时 level 应为 high", () => {
      const trend = getTrendBySlug("old-money");

      expect(trend).toBeDefined();
      expect(trend?.score).toBe(79);

      const alert = generateTrendAlert(
        trend!,
        createForecast({
          trendId: "old-money",
          forecast90: 100,
          predictedPeakDay: 90,
        }),
      );

      expect(alert.level).toBe("high");
      expect(alert.trendName).toBe("Old Money");
      expect(alert.trendId).toBe("old-money");
      expect(alert.score).toBe(79);
      expect(alert.title).toBe("发现趋势爆发信号");
      expect(alert.message).toContain("100");
      expect(alert.message).toContain("提升 21 分");
    });
  });

  describe("中优先级预警", () => {
    it("forecast90 >= score + 5 且 delta < 10 时 level 应为 medium", () => {
      const trend = createTrend({ score: 79, name: "Medium Trend" });

      const alertAtFive = generateTrendAlert(
        trend,
        createForecast({ forecast90: 84 }),
      );
      const alertAtNine = generateTrendAlert(
        trend,
        createForecast({ forecast90: 88 }),
      );

      expect(alertAtFive.level).toBe("medium");
      expect(alertAtNine.level).toBe("medium");
      expect(alertAtFive.title).toBe("趋势进入增长阶段");
      expect(alertAtFive.message).toContain("提升 5 分");
      expect(alertAtNine.message).toContain("提升 9 分");
    });

    it("delta 恰好为 5 时应判定为 medium", () => {
      const alert = generateTrendAlert(
        createTrend({ score: 70 }),
        createForecast({ forecast90: 75 }),
      );

      expect(alert.level).toBe("medium");
    });
  });

  describe("低优先级预警", () => {
    it("forecast90 < score + 5 时 level 应为 low", () => {
      const trend = createTrend({ score: 79, name: "Low Trend" });

      const alertBelowThreshold = generateTrendAlert(
        trend,
        createForecast({ forecast90: 83 }),
      );
      const alertNegativeDelta = generateTrendAlert(
        trend,
        createForecast({ forecast90: 75 }),
      );

      expect(alertBelowThreshold.level).toBe("low");
      expect(alertNegativeDelta.level).toBe("low");
      expect(alertBelowThreshold.title).toBe("趋势变化有限");
      expect(alertBelowThreshold.message).toContain("变化有限");
      expect(alertNegativeDelta.message).toContain("回落 4 分");
    });

    it("delta 恰好为 4 时应判定为 low", () => {
      const alert = generateTrendAlert(
        createTrend({ score: 80 }),
        createForecast({ forecast90: 84 }),
      );

      expect(alert.level).toBe("low");
    });
  });

  describe("阈值边界", () => {
    it("delta 恰好为 10 时应判定为 high", () => {
      const alert = generateTrendAlert(
        createTrend({ score: 70 }),
        createForecast({ forecast90: 80 }),
      );

      expect(alert.level).toBe("high");
    });
  });

  describe("title 与 action", () => {
    it("high / medium / low 各级别的 title 与 action 均不为空", () => {
      const trend = createTrend({
        score: 79,
        name: "Action Trend",
        opportunity: {
          forecast: "Emerging",
          estimatedLifecycle: "90 天",
          recommendedSkus: ["SKU A", "SKU B"],
          risk: "Medium",
        },
        riskAnalysis: {
          level: "Medium",
          explanation: "测试风险说明",
          strategy: "持续观察后再加大投入。",
        },
      });

      const cases = [
        { forecast90: 100, level: "high" as const },
        { forecast90: 84, level: "medium" as const },
        { forecast90: 80, level: "low" as const },
      ];

      for (const { forecast90, level } of cases) {
        const alert = generateTrendAlert(trend, createForecast({ forecast90 }));

        expect(alert.level).toBe(level);
        expect(alert.title.trim().length).toBeGreaterThan(0);
        expect(alert.action.trim().length).toBeGreaterThan(0);
        expect(alert.message.trim().length).toBeGreaterThan(0);
      }
    });

    it("high 级别 action 应包含推荐 SKU 与市场信息", () => {
      const alert = generateTrendAlert(
        createTrend({
          score: 79,
          primaryMarket: "美国",
          opportunity: {
            forecast: "Emerging",
            estimatedLifecycle: "90 天",
            recommendedSkus: ["SKU A", "SKU B", "SKU C"],
            risk: "Medium",
          },
        }),
        createForecast({ forecast90: 100, predictedPeakDay: 60 }),
      );

      expect(alert.action).toContain("美国");
      expect(alert.action).toContain("SKU A");
      expect(alert.action).toContain("SKU B");
      expect(alert.action).toContain("60");
    });

    it("medium 级别 action 应引用首个推荐 SKU", () => {
      const alert = generateTrendAlert(
        createTrend({
          score: 79,
          opportunity: {
            forecast: "Growing",
            estimatedLifecycle: "60 天",
            recommendedSkus: ["测试 SKU"],
            risk: "Low",
          },
        }),
        createForecast({ forecast90: 84 }),
      );

      expect(alert.action).toContain("测试 SKU");
    });

    it("low 级别 action 应回退为 riskAnalysis.strategy", () => {
      const strategy = "以利润回收为主，避免重仓备货。";
      const alert = generateTrendAlert(
        createTrend({
          score: 79,
          riskAnalysis: {
            level: "High",
            explanation: "测试",
            strategy,
          },
        }),
        createForecast({ forecast90: 80 }),
      );

      expect(alert.action).toBe(strategy);
    });

    it("high 级别在无推荐 SKU 时 action 应使用默认文案", () => {
      const alert = generateTrendAlert(
        createTrend({
          score: 79,
          opportunity: {
            forecast: "Emerging",
            estimatedLifecycle: "90 天",
            recommendedSkus: [],
            risk: "Medium",
          },
        }),
        createForecast({ forecast90: 100, predictedPeakDay: 0 }),
      );

      expect(alert.action).toContain("核心 SKU");
      expect(alert.action).toContain("45");
    });

    it("medium 级别在无推荐 SKU 时 action 应使用关联 SKU 占位", () => {
      const alert = generateTrendAlert(
        createTrend({
          score: 79,
          opportunity: {
            forecast: "Growing",
            estimatedLifecycle: "60 天",
            recommendedSkus: [],
            risk: "Low",
          },
        }),
        createForecast({ forecast90: 84 }),
      );

      expect(alert.action).toContain("关联 SKU");
    });
  });
});
