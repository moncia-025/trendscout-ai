export type TrendStage = "Emerging" | "Growing" | "Peak" | "Declining";
export type RiskLevel = "Low" | "Medium" | "High";

export interface ProductOpportunity {
  id: number;
  productName: string;
  trendName: string;
  trendId: number;
  trendSlug: string;
  opportunityScore: number;
  lifecycle: string;
  risk: RiskLevel;
  reason: string;
}

export interface RecommendedSku {
  name: string;
  /** 竞争度 0–100，越高表示竞争越激烈 */
  competition: number;
}

export interface AiTrendInsight {
  summary: string;
  spreadingCategories: string[];
  forecast: string;
  signalNote: string;
}

export interface RiskAnalysis {
  level: RiskLevel;
  explanation: string;
  strategy: string;
}

export interface OpportunityReport {
  forecast: TrendStage;
  estimatedLifecycle: string;
  recommendedSkus: string[];
  risk: RiskLevel;
}

export interface Trend {
  id: number;
  slug: string;
  name: string;
  score: number;
  growth: number;
  stage: TrendStage;
  primaryMarket: string;
  insight: string;
  marketOpportunity: string;
  aiInsight: AiTrendInsight;
  recommendedSkus: RecommendedSku[];
  riskAnalysis: RiskAnalysis;
  opportunity: OpportunityReport;
}

export const trends: Trend[] = [
  {
    id: 1,
    slug: "coquette",
    name: "Coquette",
    score: 92,
    growth: 34,
    stage: "Growing",
    primaryMarket: "美国",
    insight:
      "Coquette 正在从时尚领域向发饰、美甲、手机壳等品类扩散，预计未来 60–90 天持续增长，Pinterest 与 TikTok 均出现强劲信号。",
    marketOpportunity:
      "配饰与美妆品类需求旺盛，美国市场仍处竞争窗口期，适合低 MOQ 快速测款。",
    aiInsight: {
      summary: "Coquette 正在从时尚领域扩散到：",
      spreadingCategories: ["发饰", "美甲", "手机壳"],
      forecast: "预计未来 60–90 天持续增长。",
      signalNote: "Pinterest 与 TikTok 均出现持续增长信号。",
    },
    recommendedSkus: [
      { name: "发夹", competition: 15 },
      { name: "美甲贴纸", competition: 20 },
      { name: "手机壳", competition: 45 },
      { name: "耳环", competition: 25 },
    ],
    riskAnalysis: {
      level: "Medium",
      explanation: "竞争卖家数量正在增长，部分爆款类目已出现同质化上架。",
      strategy: "优先布局细分类目，避免与大卖正面竞争主流款式。",
    },
    opportunity: {
      forecast: "Growing",
      estimatedLifecycle: "60–90 天",
      recommendedSkus: ["发夹", "手机壳", "美甲贴纸", "耳环"],
      risk: "Medium",
    },
  },
  {
    id: 2,
    slug: "clean-girl",
    name: "Clean Girl",
    score: 87,
    growth: 18,
    stage: "Peak",
    primaryMarket: "韩国",
    insight:
      "Clean Girl 在韩系美妆渠道仍占主导，但增速放缓，建议通过差异化套装与细分场景产品维持利润。",
    marketOpportunity:
      "美妆品类需求稳定，跨境复购率高，适合搭配组合装提升客单价。",
    aiInsight: {
      summary: "Clean Girl 正在从美妆核心品类向周边场景扩散：",
      spreadingCategories: ["唇妆", "收纳配件", "护肤小工具"],
      forecast: "预计未来 30–60 天维持高位，增速逐步放缓。",
      signalNote: "韩国本土社交内容与跨境平台搜索量均保持活跃。",
    },
    recommendedSkus: [
      { name: "唇釉", competition: 30 },
      { name: "化妆包", competition: 35 },
      { name: "随身镜", competition: 40 },
      { name: "面部滚轮", competition: 45 },
    ],
    riskAnalysis: {
      level: "Low",
      explanation: "主流品类竞争充分，但细分场景与套装形态仍有差异化空间。",
      strategy: "聚焦套装组合与场景化卖点，避免单品价格战。",
    },
    opportunity: {
      forecast: "Peak",
      estimatedLifecycle: "30–60 天",
      recommendedSkus: ["唇釉", "化妆包", "随身镜", "面部滚轮"],
      risk: "Low",
    },
  },
  {
    id: 3,
    slug: "old-money",
    name: "Old Money",
    score: 79,
    growth: 12,
    stage: "Emerging",
    primaryMarket: "美国",
    insight:
      "Old Money 在北美处于早期信号阶段，静奢风带动基础款与皮质配饰需求，客单价高但决策周期较长。",
    marketOpportunity:
      "高端时尚细分赛道搜索量上升，先发者可在安静奢华基础款上建立认知。",
    aiInsight: {
      summary: "Old Money 正在从服饰审美向生活方式品类延伸：",
      spreadingCategories: ["皮具", "基础款服饰", "经典配饰"],
      forecast: "预计未来 90–120 天稳步上升，尚处早期布局窗口。",
      signalNote: "北美 Pinterest 与 Instagram 高端生活方式内容互动率持续走高。",
    },
    recommendedSkus: [
      { name: "腕表", competition: 50 },
      { name: "皮质钱包", competition: 40 },
      { name: "polo 衫", competition: 55 },
      { name: "乐福鞋", competition: 48 },
    ],
    riskAnalysis: {
      level: "Medium",
      explanation: "客单价较高导致转化周期更长，供应链与品质要求高于快消品类。",
      strategy: "优先选择皮具与小配饰测款，验证受众后再扩展服饰类目。",
    },
    opportunity: {
      forecast: "Emerging",
      estimatedLifecycle: "90–120 天",
      recommendedSkus: ["腕表", "皮质钱包", "polo 衫", "乐福鞋"],
      risk: "Medium",
    },
  },
];

export const topTrends = trends;

export const weeklyOpportunities: ProductOpportunity[] = [
  {
    id: 1,
    productName: "Coquette Hair Clips",
    trendName: "Coquette",
    trendId: 1,
    trendSlug: "coquette",
    opportunityScore: 95,
    lifecycle: "90天",
    risk: "Low",
    reason: "Coquette 趋势在美国市场快速增长，配饰类商品竞争仍较低。",
  },
  {
    id: 2,
    productName: "Coquette Nail Stickers",
    trendName: "Coquette",
    trendId: 1,
    trendSlug: "coquette",
    opportunityScore: 91,
    lifecycle: "85天",
    risk: "Low",
    reason: "美甲贴纸与 Coquette 美学高度契合，TikTok 互动率持续上升，适合低门槛测款。",
  },
  {
    id: 3,
    productName: "Clean Girl Lip Gloss",
    trendName: "Clean Girl",
    trendId: 2,
    trendSlug: "clean-girl",
    opportunityScore: 88,
    lifecycle: "45天",
    risk: "Low",
    reason: "韩系清透唇妆需求稳定，复购率高，适合作为引流 SKU 搭配套装销售。",
  },
  {
    id: 4,
    productName: "Coquette Phone Cases",
    trendName: "Coquette",
    trendId: 1,
    trendSlug: "coquette",
    opportunityScore: 86,
    lifecycle: "75天",
    risk: "Medium",
    reason: "手机壳品类搜索量上涨明显，但同款增多，建议差异化设计后尽快上架。",
  },
  {
    id: 5,
    productName: "Old Money Leather Wallet",
    trendName: "Old Money",
    trendId: 3,
    trendSlug: "old-money",
    opportunityScore: 82,
    lifecycle: "100天",
    risk: "Medium",
    reason: "静奢风带动皮质小物需求，客单价较高，适合有供应链优势的卖家提前布局。",
  },
  {
    id: 6,
    productName: "Clean Girl Makeup Bag",
    trendName: "Clean Girl",
    trendId: 2,
    trendSlug: "clean-girl",
    opportunityScore: 79,
    lifecycle: "40天",
    risk: "Low",
    reason: "极简化妆包与 Clean Girl 场景强绑定，适合作为组合装配件提升客单价。",
  },
];

export function getTrendById(id: number): Trend | undefined {
  return trends.find((trend) => trend.id === id);
}

export function getTrendBySlug(slug: string): Trend | undefined {
  return trends.find((trend) => trend.slug === slug);
}

export function getTrendHref(slug: string): string {
  return `/trend/${slug}`;
}

export function getAvgGrowth(trendList: Trend[]): number {
  if (trendList.length === 0) return 0;
  return Math.round(
    trendList.reduce((sum, trend) => sum + trend.growth, 0) / trendList.length,
  );
}
