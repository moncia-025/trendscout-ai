"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { AnalysisState } from "@/components/trend-analysis/analysis-state";
import { TrendCard } from "@/components/trend-analysis/trend-card";
import { useMultiTrendAnalysis } from "@/hooks/use-multi-trend-analysis";
import { parseDefaultQueries } from "@/types/trend";

export function ComparisonPageClient() {
  const [queries, setQueries] = useState(parseDefaultQueries());
  const [input, setInput] = useState("");
  const { status, items, error, refresh } = useMultiTrendAnalysis(queries);

  const ranked = [...items].sort(
    (a, b) => b.opportunity_score - a.opportunity_score,
  );

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 趋势对比
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            趋势对比排名
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            多个关键词分别调用 Dify Workflow，按 Opportunity Score 排序
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="添加对比关键词"
              className="flex-1 rounded-lg border border-zinc-200/80 px-4 py-2.5 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const value = input.trim();
                if (!value || queries.includes(value)) return;
                setQueries((prev) => [...prev, value]);
                setInput("");
              }}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              添加对比
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <SectionHeader
          title="对比结果"
          description="全部数据来自 Dify Workflow API"
          badge="Compare"
        />

        {status === "idle" ? (
          <div className="flex flex-col items-start gap-3">
            <AnalysisState
              status="idle"
              emptyTitle="添加关键词后，点击开始对比"
              emptyDescription={
                queries.length > 0
                  ? `当前对比：${queries.join("、")}`
                  : "请先添加至少一个关键词"
              }
            />
            <button
              type="button"
              disabled={queries.length === 0}
              onClick={() => void refresh()}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              开始对比分析
            </button>
          </div>
        ) : null}
        {status === "loading" ? <AnalysisState status="loading" /> : null}
        {status === "error" ? (
          <AnalysisState status="error" error={error} />
        ) : null}
        {status === "empty" ? <AnalysisState status="empty" /> : null}

        {status === "success" && ranked.length > 0 ? (
          <div className="space-y-4">
            {ranked.map((item, index) => (
              <div key={item.keyword} className="space-y-2">
                <p className="text-xs font-medium text-zinc-400">
                  #{index + 1} · Opportunity {item.opportunity_score}
                </p>
                <TrendCard analysis={item} />
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}
