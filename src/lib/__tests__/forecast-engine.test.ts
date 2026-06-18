import { describe, expect, it } from "vitest";
import { forecastTrend } from "@/lib/forecast-engine";
import type { Trend, TrendStage } from "@/types/trend";

function createTrend(
  overrides: Pick<Trend, "stage" | "score" | "growth"> &
    Partial<Pick<Trend, "slug">>,
): Trend {
  return {
    id: 1,
    slug: overrides.slug ?? "test-trend",
    name: "Test Trend",
    score: overrides.score,
    growth: overrides.growth,
    stage: overrides.stage,
    primaryMarket: "美国",
    insight: "测试趋势洞察",
    marketOpportunity: "测试市场机会",
    aiInsight: {
      summary: "测试摘要",
      spreadingCategories: [],
      forecast: "测试预测",
      signalNote: "测试信号",
    },
    recommendedSkus: [],
    riskAnalysis: {
      level: "Medium",
      explanation: "测试风险说明",
      strategy: "测试策略",
    },
    opportunity: {
      forecast: overrides.stage,
      estimatedLifecycle: "90 天",
      recommendedSkus: [],
      risk: "Medium",
    },
  };
}

describe("forecastTrend", () => {
  describe("Emerging 阶段", () => {
    it("score=79 时 forecast90 应大于当前 score", () => {
      const trend = createTrend({
        stage: "Emerging",
        score: 79,
        growth: 12,
      });

      const forecast = forecastTrend(trend);

      expect(forecast.forecast90).toBeGreaterThan(trend.score);
      expect(forecast.forecast30).toBeLessThanOrEqual(forecast.forecast60);
      expect(forecast.forecast60).toBeLessThanOrEqual(forecast.forecast90);
    });
  });

  describe("Growing 阶段", () => {
    it("forecast30 >= forecast60 >= forecast90，趋势逐步降温", () => {
      const trend = createTrend({
        stage: "Growing",
        score: 70,
        growth: 20,
      });

      const forecast = forecastTrend(trend);

      expect(forecast.forecast30).toBeGreaterThanOrEqual(forecast.forecast60);
      expect(forecast.forecast60).toBeGreaterThanOrEqual(forecast.forecast90);
    });

    it("高分趋势在 clamp 后仍保持非递增预测曲线", () => {
      const trend = createTrend({
        stage: "Growing",
        score: 92,
        growth: 34,
      });

      const forecast = forecastTrend(trend);

      expect(forecast.forecast30).toBeGreaterThanOrEqual(forecast.forecast60);
      expect(forecast.forecast60).toBeGreaterThanOrEqual(forecast.forecast90);
    });
  });

  describe("Peak 阶段", () => {
    it("forecast90 应低于当前 score", () => {
      const trend = createTrend({
        stage: "Peak",
        score: 87,
        growth: 18,
      });

      const forecast = forecastTrend(trend);

      expect(forecast.forecast90).toBeLessThan(trend.score);
      expect(forecast.forecast30).toBeGreaterThanOrEqual(forecast.forecast60);
      expect(forecast.forecast60).toBeGreaterThanOrEqual(forecast.forecast90);
    });
  });

  describe("confidence", () => {
    it("必须在 50~95 范围内", () => {
      const cases: Array<{ score: number; growth: number }> = [
        { score: 79, growth: 12 },
        { score: 92, growth: 34 },
        { score: 87, growth: 18 },
        { score: 10, growth: 0 },
        { score: 100, growth: 100 },
      ];

      for (const { score, growth } of cases) {
        const forecast = forecastTrend(
          createTrend({ stage: "Emerging", score, growth }),
        );

        expect(forecast.confidence).toBeGreaterThanOrEqual(50);
        expect(forecast.confidence).toBeLessThanOrEqual(95);
      }
    });

    it("低输入会被 clamp 到下限 50", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Declining", score: 20, growth: 5 }),
      );

      expect(forecast.confidence).toBe(50);
    });

    it("高输入会被 clamp 到上限 95", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Growing", score: 100, growth: 100 }),
      );

      expect(forecast.confidence).toBe(95);
    });

    it("按 score*0.7 + growth*0.3 四舍五入计算", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Emerging", score: 80, growth: 10 }),
      );

      expect(forecast.confidence).toBe(Math.round(80 * 0.7 + 10 * 0.3));
    });
  });

  describe("Declining 阶段", () => {
    it("forecast90 应低于 score，且预测曲线非递增", () => {
      const trend = createTrend({
        stage: "Declining",
        score: 60,
        growth: 5,
      });

      const forecast = forecastTrend(trend);

      expect(forecast.forecast90).toBeLessThan(trend.score);
      expect(forecast.forecast30).toBeGreaterThanOrEqual(forecast.forecast60);
      expect(forecast.forecast60).toBeGreaterThanOrEqual(forecast.forecast90);
      expect(forecast.predictedPeakDay).toBe(0);
      expect(forecast.predictedDeclineDay).toBe(0);
    });
  });

  describe("输出结构", () => {
    it("应写入 trendId 与各阶段生命周期字段", () => {
      const stages: TrendStage[] = [
        "Emerging",
        "Growing",
        "Peak",
        "Declining",
      ];

      for (const stage of stages) {
        const trend = createTrend({
          slug: `${stage.toLowerCase()}-slug`,
          stage,
          score: 75,
          growth: 15,
        });

        const forecast = forecastTrend(trend);

        expect(forecast.trendId).toBe(trend.slug);
        expect(forecast.forecast30).toBeGreaterThanOrEqual(0);
        expect(forecast.forecast30).toBeLessThanOrEqual(100);
        expect(forecast.forecast60).toBeGreaterThanOrEqual(0);
        expect(forecast.forecast60).toBeLessThanOrEqual(100);
        expect(forecast.forecast90).toBeGreaterThanOrEqual(0);
        expect(forecast.forecast90).toBeLessThanOrEqual(100);
        expect(forecast.predictedPeakDay).toBeGreaterThanOrEqual(0);
        expect(forecast.predictedDeclineDay).toBeGreaterThanOrEqual(0);
      }
    });

    it("Emerging 阶段应返回正向峰值与衰退天数", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Emerging", score: 79, growth: 12 }),
      );

      expect(forecast.predictedPeakDay).toBe(90);
      expect(forecast.predictedDeclineDay).toBe(180);
    });

    it("Peak 阶段 predictedPeakDay 应为 0", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Peak", score: 87, growth: 18 }),
      );

      expect(forecast.predictedPeakDay).toBe(0);
      expect(forecast.predictedDeclineDay).toBe(30);
    });
  });

  describe("边界 clamp", () => {
    it("极低 score 时 forecast 分值不低于 0", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Declining", score: 30, growth: 0 }),
      );

      expect(forecast.forecast30).toBe(10);
      expect(forecast.forecast60).toBe(0);
      expect(forecast.forecast90).toBe(0);
    });

    it("极高 score 时 Emerging forecast 分值不超过 100", () => {
      const forecast = forecastTrend(
        createTrend({ stage: "Emerging", score: 95, growth: 10 }),
      );

      expect(forecast.forecast30).toBe(100);
      expect(forecast.forecast60).toBe(100);
      expect(forecast.forecast90).toBe(100);
    });
  });
});
