import type { Trend } from "@/lib/mock-data";
import { getSkuSignalsForTrend } from "@/data/sku-signals";
import { calculateSkuOpportunity } from "@/lib/sku-engine";
import { ScoreBar } from "@/components/dashboard/score-bar";

interface TrendRecommendedSkusProps {
  trend: Trend;
}

export function TrendRecommendedSkus({ trend }: TrendRecommendedSkusProps) {
  const skuSignals = getSkuSignalsForTrend(trend.slug, trend.recommendedSkus);

  const opportunities = skuSignals
    .map((sku) => calculateSkuOpportunity(trend, sku))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);

  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <div className="mb-5 border-b border-zinc-100 pb-4">
        <h2 className="text-base font-semibold text-zinc-900">推荐 SKU</h2>
        <p className="mt-1 text-xs text-zinc-500">
          由 SKU 机会引擎综合趋势热度、利润、物流与竞争度自动计算
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {opportunities.map((item, index) => (
          <article
            key={item.sku.id}
            className="rounded-xl border border-zinc-200/60 p-4 transition-colors hover:border-zinc-300/80"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-xs font-medium tabular-nums text-zinc-500">
                {index + 1}
              </span>
              <h3 className="text-sm font-semibold text-zinc-900">
                {item.sku.name}
              </h3>
            </div>

            <dl className="mt-4 space-y-3">
              <MetricRow label="机会指数">
                <div className="flex items-center gap-3">
                  <ScoreBar
                    score={item.opportunityScore}
                    className="min-w-0 flex-1"
                  />
                </div>
              </MetricRow>
              <MetricRow label="预计利润率">
                <span className="text-sm font-semibold tabular-nums text-zinc-900">
                  {Math.round(item.estimatedProfitMargin)}%
                </span>
              </MetricRow>
              <MetricRow label="预计生命周期">
                <span className="text-sm font-semibold tabular-nums text-zinc-900">
                  {item.estimatedLifecycleDays}天
                </span>
              </MetricRow>
              <MetricRow label="建议首批备货">
                <span className="text-sm font-semibold tabular-nums text-zinc-900">
                  {item.recommendedInventory}件
                </span>
              </MetricRow>
            </dl>

            <div className="mt-4 rounded-lg bg-zinc-50/80 px-3 py-2.5 ring-1 ring-zinc-200/40 ring-inset">
              <p className="text-xs text-zinc-400">推荐理由</p>
              <ul className="mt-2 space-y-1.5">
                {item.reasonPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm text-zinc-600"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MetricRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
      <dt className="shrink-0 text-xs text-zinc-400">{label}</dt>
      <dd className="min-w-0 flex-1 text-right">{children}</dd>
    </div>
  );
}
