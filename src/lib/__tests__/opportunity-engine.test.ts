import { describe, expect, it } from "vitest";
import {
  calculateOpportunityScore,
  getLifecycleScore,
  type OpportunityScoreInput,
} from "@/lib/opportunity-engine";
import type { TrendStage } from "@/types/trend";

function score(input: OpportunityScoreInput) {
  return calculateOpportunityScore(input);
}

describe("calculateOpportunityScore", () => {
  describe("高热度 + 低竞争 + 早期生命周期", () => {
    it("机会评分应高于 70", () => {
      const result = score({
        trendHeat: 92,
        lifecycle: "Emerging",
        competition: 15,
      });

      expect(result.score).toBeGreaterThan(70);
      expect(result.reason).toBe("趋势热度高且竞争较低，适合优先布局。");
    });

    it("Growing 阶段高热度低竞争同样应获得较高评分", () => {
      const result = score({
        trendHeat: 100,
        lifecycle: "Growing",
        competition: 15,
      });

      expect(result.score).toBeGreaterThan(70);
      expect(result.reason).toBe("趋势热度高且竞争较低，适合优先布局。");
    });
  });

  describe("高竞争", () => {
    it("在相同热度与生命周期下，竞争升高应使评分下降", () => {
      const baseInput = {
        trendHeat: 85,
        lifecycle: "Growing" as TrendStage,
      };

      const lowCompetition = score({ ...baseInput, competition: 20 });
      const highCompetition = score({ ...baseInput, competition: 80 });

      expect(highCompetition.score).toBeLessThan(lowCompetition.score);
      expect(highCompetition.reason).toBe(
        "趋势热度高但竞争加剧，建议差异化设计后快速上架。",
      );
    });

    it("非高热趋势下高竞争应命中激烈竞争分支", () => {
      const result = score({
        trendHeat: 60,
        lifecycle: "Growing",
        competition: 70,
      });

      expect(result.reason).toBe(
        "竞争较为激烈，建议聚焦细分款式或组合装切入。",
      );
    });
  });

  describe("备货/测款建议 reason 分支", () => {
    it("Declining 阶段应建议控制备货", () => {
      const result = score({
        trendHeat: 55,
        lifecycle: "Declining",
        competition: 30,
      });

      expect(result.reason).toContain("备货");
      expect(result.reason).toBe(
        "趋势进入衰退期，不建议大量备货，可做轻量验证。",
      );
    });

    it("Peak 阶段且评分 >= 50 应提示抓住窗口期", () => {
      const result = score({
        trendHeat: 85,
        lifecycle: "Peak",
        competition: 40,
      });

      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.reason).toBe("趋势处于峰值阶段，建议抓住剩余窗口期快速切入。");
    });

    it("中等评分应建议小批量测款而非大量备货", () => {
      const result = score({
        trendHeat: 70,
        lifecycle: "Growing",
        competition: 40,
      });

      expect(result.score).toBeGreaterThanOrEqual(50);
      expect(result.score).toBeLessThan(70);
      expect(result.reason).toBe("机会中等，建议小批量测试后再决定是否加码。");
    });
  });

  describe("reason 字段", () => {
    it("任意输入下 reason 均不能为空", () => {
      const cases: OpportunityScoreInput[] = [
        { trendHeat: 92, lifecycle: "Emerging", competition: 15 },
        { trendHeat: 85, lifecycle: "Peak", competition: 30 },
        { trendHeat: 85, lifecycle: "Peak", competition: 70 },
        { trendHeat: 70, lifecycle: "Emerging", competition: 25 },
        { trendHeat: 60, lifecycle: "Growing", competition: 70 },
        { trendHeat: 95, lifecycle: "Emerging", competition: 40 },
        { trendHeat: 70, lifecycle: "Growing", competition: 40 },
        { trendHeat: 30, lifecycle: "Declining", competition: 50 },
        { trendHeat: 0, lifecycle: "Declining", competition: 100 },
        { trendHeat: 100, lifecycle: "Emerging", competition: 0 },
      ];

      for (const input of cases) {
        const { reason } = score(input);
        expect(reason.trim().length, JSON.stringify(input)).toBeGreaterThan(0);
      }
    });
  });

  describe("buildReason 主要分支", () => {
    it("高热 + 低竞争 + 非早期生命周期", () => {
      const result = score({
        trendHeat: 85,
        lifecycle: "Peak",
        competition: 30,
      });

      expect(result.reason).toBe(
        "趋势热度高、竞争压力可控，建议尽快测款验证。",
      );
    });

    it("早期窗口 + 低竞争但热度未达高热阈值", () => {
      const result = score({
        trendHeat: 70,
        lifecycle: "Emerging",
        competition: 25,
      });

      expect(result.reason).toBe(
        "趋势处于早期窗口且竞争较低，具备先发优势。",
      );
    });

    it("综合评分 >= 70 应返回上架价值结论", () => {
      const result = score({
        trendHeat: 95,
        lifecycle: "Emerging",
        competition: 40,
      });

      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.reason).toBe("综合评分较高，具备较好的上架价值。");
    });

    it("低分场景应提示持续观察", () => {
      const result = score({
        trendHeat: 30,
        lifecycle: "Growing",
        competition: 50,
      });

      expect(result.score).toBeLessThan(50);
      expect(result.reason).toBe("当前机会有限，建议持续观察信号变化后再行动。");
    });
  });

  describe("评分计算与边界", () => {
    it("输入超出范围时应 clamp 到 0~100", () => {
      const high = score({
        trendHeat: 150,
        lifecycle: "Emerging",
        competition: -10,
      });
      const low = score({
        trendHeat: -20,
        lifecycle: "Declining",
        competition: 200,
      });

      expect(high.score).toBeGreaterThanOrEqual(0);
      expect(high.score).toBeLessThanOrEqual(100);
      expect(low.score).toBeGreaterThanOrEqual(0);
      expect(low.score).toBeLessThanOrEqual(100);
    });

    it("应按 trendHeat*0.5 + lifecycle*0.3 - competition*0.2 计算", () => {
      const result = score({
        trendHeat: 80,
        lifecycle: "Growing",
        competition: 20,
      });

      const expected = Math.round(
        Math.min(100, Math.max(0, 80 * 0.5 + 80 * 0.3 - 20 * 0.2)),
      );

      expect(result.score).toBe(expected);
    });
  });
});

describe("getLifecycleScore", () => {
  it("应返回各生命周期固定分值", () => {
    expect(getLifecycleScore("Emerging")).toBe(100);
    expect(getLifecycleScore("Growing")).toBe(80);
    expect(getLifecycleScore("Peak")).toBe(50);
    expect(getLifecycleScore("Declining")).toBe(20);
  });
});
