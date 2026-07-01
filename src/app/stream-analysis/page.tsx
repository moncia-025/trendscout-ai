"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnalysisState } from "@/components/trend-analysis/analysis-state";
import { TrendAnalysisView } from "@/components/trend-analysis/trend-analysis-view";
import { TrendSearchForm } from "@/components/trend-analysis/trend-search-form";
import { useTrendAnalysis } from "@/hooks/use-trend-analysis";
import { parseDefaultQueries } from "@/types/trend";

export default function StreamAnalysisPage() {
  const { status, data, error, analyze } = useTrendAnalysis();
  const defaultQuery = parseDefaultQueries()[0] ?? "";

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · Dify Workflow
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            Workflow 趋势分析
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            提交关键词后由 Dify Multi-Agent Workflow 返回完整 JSON 分析结果
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
          <AnalysisState
            status={status}
            error={error}
            loadingLabel="Dify Workflow 分析中，请稍候..."
          />
        )}
      </main>
    </div>
  );
}
