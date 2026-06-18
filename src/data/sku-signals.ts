import type { SkuSignal } from "@/types/sku";

export const skuSignals: SkuSignal[] = [
  {
    id: "coquette-hair-clips",
    name: "发夹",
    competition: 15,
    margin: 97,
    logistics: 96,
    productionDifficulty: 22,
  },
  {
    id: "coquette-nail-stickers",
    name: "美甲贴纸",
    competition: 32,
    margin: 76,
    logistics: 96,
    productionDifficulty: 15,
  },
  {
    id: "coquette-earrings",
    name: "耳环",
    competition: 42,
    margin: 80,
    logistics: 86,
    productionDifficulty: 38,
  },
  {
    id: "coquette-phone-cases",
    name: "手机壳",
    competition: 78,
    margin: 58,
    logistics: 72,
    productionDifficulty: 48,
  },
];

const skuSignalsByTrend: Record<string, SkuSignal[]> = {
  coquette: skuSignals,
};

export function getSkuSignalsForTrend(
  trendSlug: string,
  fallbackSkus: { name: string; competition: number }[],
): SkuSignal[] {
  const signals = skuSignalsByTrend[trendSlug];
  if (signals) return signals;

  return fallbackSkus.map((sku, index) => ({
    id: `${trendSlug}-${index}`,
    name: sku.name,
    competition: sku.competition,
    margin: Math.round(72 - sku.competition * 0.15),
    logistics: Math.round(88 - index * 4),
    productionDifficulty: Math.round(28 + index * 8),
  }));
}
