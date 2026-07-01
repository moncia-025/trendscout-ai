"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnalysisState } from "@/components/trend-analysis/analysis-state";
import { TrendAnalysisView } from "@/components/trend-analysis/trend-analysis-view";
import { TrendSearchForm } from "@/components/trend-analysis/trend-search-form";
import { useTrendAnalysis } from "@/hooks/use-trend-analysis";
import { parseDefaultQueries } from "@/types/trend";

export function ForecastPageClient() {
  const { status, data, error, analyze } = useTrendAnalysis();
  const defaultQuery = parseDefaultQueries()[0] ?? "";

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 趋势预测
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            趋势分析中心
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            由 Dify Workflow 返回趋势阶段、评分与机会分析（需本地 Dify 服务可用）
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
          <TrendAnalysisView analysis={data} />
        ) : (
          <AnalysisState status={status} error={error} />
        )}
      </main>
    </div>
  );
}
