"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { AnalysisState } from "@/components/trend-analysis/analysis-state";
import { TrendAnalysisView } from "@/components/trend-analysis/trend-analysis-view";
import { TrendCard } from "@/components/trend-analysis/trend-card";
import { TrendSearchForm } from "@/components/trend-analysis/trend-search-form";
import { useMultiTrendAnalysis } from "@/hooks/use-multi-trend-analysis";
import { useTrendAnalysis } from "@/hooks/use-trend-analysis";
import { parseDefaultQueries } from "@/types/trend";

const DEFAULT_QUERIES = parseDefaultQueries();

export function TrendAnalysisDashboard() {
  const { status, data, error, analyze } = useTrendAnalysis();
  const multi = useMultiTrendAnalysis(DEFAULT_QUERIES);

  const defaultAnalysis = multi.items.find(
    (item) =>
      item.keyword.toLowerCase() === (DEFAULT_QUERIES[0]?.toLowerCase() ?? ""),
  );
  const mainData = data ?? defaultAnalysis ?? null;
  const mainStatus = data
    ? status
    : defaultAnalysis
      ? "success"
      : multi.status;
  const mainError = data ? error : multi.error;

  const topPick = [...multi.items].sort(
    (a, b) => b.opportunity_score - a.opportunity_score,
  )[0];

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · Dify Workflow
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            趋势分析与选品决策
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            所有分析数据由 Dify Multi-Agent Workflow 实时返回，不再使用本地 Mock。
          </p>
          <div className="mt-6">
            <TrendSearchForm
              defaultQuery={DEFAULT_QUERIES[0] ?? ""}
              loading={mainStatus === "loading"}
              onSearch={(query) => void analyze(query)}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8 sm:px-8 lg:px-12">
        {mainStatus === "success" && mainData ? (
          <TrendAnalysisView analysis={mainData} />
        ) : (
          <AnalysisState status={mainStatus} error={mainError} />
        )}

        <section className="space-y-4">
          <SectionHeader
            title="趋势排行"
            description="默认关键词批量调用 Dify Workflow 对比"
            badge="Ranking"
          />

          {multi.status === "idle" ? (
            <div className="flex flex-col items-start gap-3">
              <AnalysisState
                status="idle"
                emptyTitle="点击加载默认关键词排行"
                emptyDescription={`将依次分析：${DEFAULT_QUERIES.join("、") || "未配置"}`}
              />
              <button
                type="button"
                onClick={() => void multi.refresh()}
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                加载默认排行
              </button>
            </div>
          ) : null}

          {multi.status === "loading" && multi.items.length === 0 ? (
            <AnalysisState status="loading" />
          ) : null}

          {multi.status === "error" ? (
            <AnalysisState status="error" error={multi.error} />
          ) : null}

          {multi.status === "empty" ? (
            <AnalysisState
              status="empty"
              emptyTitle="未配置默认关键词"
              emptyDescription="请在环境变量 NEXT_PUBLIC_DEFAULT_QUERIES 中配置，例如 Coquette,Clean Girl"
            />
          ) : null}

          {multi.items.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {multi.items.map((item) => (
                <TrendCard key={item.keyword} analysis={item} />
              ))}
            </div>
          ) : null}

          {multi.status === "loading" && multi.items.length > 0 ? (
            <p className="text-sm text-zinc-500">
              正在分析其余关键词…
            </p>
          ) : null}
        </section>

        {topPick ? (
          <section className="rounded-xl border border-violet-200/80 bg-violet-50/30 p-6">
            <p className="text-xs font-medium text-violet-600">本周机会最高</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-900">
              {topPick.keyword}
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Opportunity Score {topPick.opportunity_score} · Risk{" "}
              {topPick.risk_level}
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
