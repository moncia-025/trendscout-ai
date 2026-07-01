"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnalysisState } from "@/components/trend-analysis/analysis-state";
import { InsightCard } from "@/components/trend-analysis/insight-card";
import { RecommendationList } from "@/components/trend-analysis/recommendation-list";
import { ScoreCard } from "@/components/trend-analysis/score-card";
import { TrendSearchForm } from "@/components/trend-analysis/trend-search-form";
import { SectionHeader } from "@/components/dashboard/section-header";
import { useTrendAnalysis } from "@/hooks/use-trend-analysis";
import { parseDefaultQueries } from "@/types/trend";

export function ConsultantPageClient() {
  const { status, data, error, analyze } = useTrendAnalysis();
  const defaultQuery = parseDefaultQueries()[0] ?? "";

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 选品咨询
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            AI 产品顾问
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Dify Workflow 输出选品机会、风险与推荐 SKU
          </p>
          <div className="mt-6">
            <TrendSearchForm
              defaultQuery={defaultQuery}
              loading={status === "loading"}
              onSearch={(query) => void analyze(query)}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        {status === "success" && data ? (
          <div className="space-y-6">
            <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
              <SectionHeader
                title="AI 选品建议"
                description={`推荐趋势：${data.keyword}`}
                badge="Consultant"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <ScoreCard
                  label="机会评分"
                  value={data.opportunity_score}
                  accent="success"
                />
                <ScoreCard label="产品评分" value={data.product_score} />
                <ScoreCard
                  label="风险等级"
                  value={data.risk_level}
                  accent="warning"
                />
              </div>
            </section>
            <InsightCard title="综合洞察" insight={data.insight} />
            <RecommendationList items={data.recommendation} />
          </div>
        ) : (
          <AnalysisState status={status} error={error} />
        )}
      </main>
    </div>
  );
}
