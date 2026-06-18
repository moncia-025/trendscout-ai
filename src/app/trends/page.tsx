"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { topTrends } from "@/lib/mock-data";
import type { GoogleTrendsResult } from "@/services/trends/google-trends";

const DEFAULT_KEYWORD = "Coquette";

export default function TrendsPage() {
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORD);
  const [data, setData] = useState<GoogleTrendsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchTrends = useCallback(async (searchKeyword: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/trends?keyword=${encodeURIComponent(searchKeyword)}`,
      );
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
            : "获取 Google Trends 数据失败";
        throw new Error(message);
      }

      setData(result as GoogleTrendsResult);
      setFetchedAt(new Date().toISOString());
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Unknown Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTrends(DEFAULT_KEYWORD);
  }, [fetchTrends]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void fetchTrends(keyword.trim() || DEFAULT_KEYWORD);
  }

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 趋势发现
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Google Trends 数据源
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            查询关键词最近 30 天搜索热度，Google 不可用时自动回退本地 mock 数据
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
          <SectionHeader
            title="热度查询"
            description="输入趋势关键词，获取 30 天热度曲线与增长率"
            badge="Trends"
            meta={fetchedAt ? formatGeneratedAt(fetchedAt) : undefined}
          />

          <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="输入关键词，如 Coquette"
              className="flex-1 rounded-lg border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900/5 focus:border-zinc-300 focus:ring-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
            >
              查询
            </button>
          </form>

          <div className="mb-6 flex flex-wrap gap-2">
            {topTrends.map((trend) => (
              <button
                key={trend.slug}
                type="button"
                onClick={() => {
                  setKeyword(trend.name);
                  void fetchTrends(trend.name);
                }}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-200"
              >
                {trend.name}
              </button>
            ))}
          </div>

          {loading ? <TrendsSkeleton /> : null}

          {!loading && error ? (
            <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-5">
              <p className="text-sm font-medium text-red-800">数据加载失败</p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          ) : null}

          {!loading && !error && data ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard label="关键词" value={data.keyword} />
                <MetricCard label="当前热度" value={String(data.currentScore)} />
                <MetricCard
                  label="30 天增长率"
                  value={`${data.growthRate > 0 ? "+" : ""}${data.growthRate}%`}
                />
              </div>

              <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5">
                <p className="mb-4 text-sm font-medium text-zinc-900">
                  最近 30 天热度
                </p>
                <div className="mb-4">
                  <ScoreBar score={data.currentScore} />
                </div>
                <div className="max-h-72 space-y-1.5 overflow-y-auto">
                  {data.trendData.map((point) => (
                    <div key={point.date} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-xs tabular-nums text-zinc-400">
                        {point.date.slice(5)}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200/80">
                        <div
                          className="h-full rounded-full bg-zinc-900"
                          style={{ width: `${point.value}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-zinc-600">
                        {point.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200/60 bg-zinc-50/40 px-4 py-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 rounded-lg bg-zinc-100" />
        ))}
      </div>
      <div className="h-72 rounded-xl bg-zinc-100" />
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
