export interface SkuSignal {
  id: string;

  name: string;

  competition: number;

  margin: number;

  logistics: number;

  productionDifficulty: number;
}

export interface SkuOpportunity {
  sku: SkuSignal;

  opportunityScore: number;

  estimatedProfitMargin: number;

  estimatedLifecycleDays: number;

  recommendedInventory: number;

  reason: string;

  reasonPoints: string[];
}
