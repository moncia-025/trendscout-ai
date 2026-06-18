"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { topTrends } from "@/lib/mock-data";
import type { TrendComparisonResult } from "@/types/comparison";

const COMPARISON_TRENDS = topTrends.map((trend) => trend.name);

export default function ComparisonPage() {
  const [data, setData] = useState<TrendComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchComparison() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/trend-comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trends: COMPARISON_TRENDS }),
        });

        const result: unknown = await response.json();

        if (
          !response.ok ||
          (typeof result === "object" &&
            result !== null &&
            "success" in result &&
            result.success === false)
        ) {
          const message =
            typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
              ? result.error
              : "获取趋势对比数据失败";
          throw new Error(message);
        }

        if (!cancelled) {
          setData(result as TrendComparisonResult);
          setFetchedAt(new Date().toISOString());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown Error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchComparison();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 趋势对比
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            趋势对比引擎
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            综合热度、90 天预测、增速与可信度，对多条趋势进行加权排名
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
          <SectionHeader
            title="对比排名"
            description={`参与对比：${COMPARISON_TRENDS.join("、")}`}
            badge="Compare"
            meta={fetchedAt ? formatGeneratedAt(fetchedAt) : undefined}
          />

          {loading ? <ComparisonSkeleton /> : null}

          {!loading && error ? (
            <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-5">
              <p className="text-sm font-medium text-red-800">对比分析失败</p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          ) : null}

          {!loading && !error && data ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
                <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                  综合推荐
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 sm:text-[15px]">
                  {data.overallRecommendation}
                </p>
              </div>

              <div className="space-y-4">
                {data.ranking.map((item, index) => (
                  <article
                    key={item.trendName}
                    className="rounded-lg border border-zinc-200/60 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900">
                            {item.trendName}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            {item.reason}
                          </p>
                        </div>
                      </div>
                      <div className="w-full sm:w-40">
                        <p className="mb-1.5 text-xs text-zinc-400">
                          对比评分 {item.comparisonScore}
                        </p>
                        <ScoreBar score={item.comparisonScore} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function ComparisonSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-24 rounded-xl bg-zinc-100" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-28 rounded-lg bg-zinc-100" />
      ))}
    </div>
  );
}

function formatGeneratedAt(iso: string): string {
  const date = new Date(iso);
  return `更新于 ${date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
