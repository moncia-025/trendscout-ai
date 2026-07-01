import type { TrendAnalysis } from "@/types/trend";
import { InsightCard } from "@/components/trend-analysis/insight-card";
import { RecommendationList } from "@/components/trend-analysis/recommendation-list";
import { ScoreCard } from "@/components/trend-analysis/score-card";
import { SectionHeader } from "@/components/dashboard/section-header";

interface TrendAnalysisViewProps {
  analysis: TrendAnalysis;
}

export function TrendAnalysisView({ analysis }: TrendAnalysisViewProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
        <SectionHeader
          title={analysis.keyword}
          description={`趋势阶段：${analysis.trend_stage} · 意图：${analysis.intent}`}
          badge="Dify"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Trend Score" value={analysis.trend_score} />
          <ScoreCard
            label="Opportunity Score"
            value={analysis.opportunity_score}
            accent="success"
          />
          <ScoreCard label="Product Score" value={analysis.product_score} />
          <ScoreCard
            label="Risk Level"
            value={analysis.risk_level}
            accent="warning"
          />
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-200/40 ring-inset">
            <dt className="text-xs text-zinc-400">Market Size</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {analysis.market_size}
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50/80 px-4 py-3 ring-1 ring-zinc-200/40 ring-inset">
            <dt className="text-xs text-zinc-400">Competition</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {analysis.competition}
            </dd>
          </div>
        </dl>
      </section>

      <InsightCard insight={analysis.insight} intent={analysis.intent} />
      <RecommendationList items={analysis.recommendation} />
    </div>
  );
}
