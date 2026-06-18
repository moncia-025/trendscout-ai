"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import type { ProductConsultantReport } from "@/types/consultant";

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    </svg>
  );
}

export default function ConsultantPage() {
  const [data, setData] = useState<ProductConsultantReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchConsultation() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/product-consultant");
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
              : "获取 AI 选品咨询失败";
          throw new Error(message);
        }

        if (
          typeof result === "object" &&
          result !== null &&
          "data" in result &&
          result.data
        ) {
          if (!cancelled) {
            setData(result.data as ProductConsultantReport);
            setFetchedAt(new Date().toISOString());
          }
        } else {
          throw new Error("返回数据格式无效");
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

    void fetchConsultation();

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
            TrendScout AI · 选品咨询
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            AI 产品顾问
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            基于趋势热度、生命周期与 90 天预测，为你推荐最优趋势与 SKU 组合
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
          <SectionHeader
            title="AI 选品建议"
            description="综合 topTrends 与 forecastData 生成的跨境电商选品方案"
            badge="AI"
            meta={fetchedAt ? formatGeneratedAt(fetchedAt) : undefined}
          />

          {loading ? <ConsultantSkeleton /> : null}

          {!loading && error ? (
            <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
              <p className="text-sm font-medium text-red-800">
                AI 选品咨询加载失败
              </p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          ) : null}

          {!loading && !error && data ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
                    <SparkleIcon />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">推荐趋势</p>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {data.recommendedTrend}
                    </h3>
                  </div>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                  <MetricCard label="机会评分">
                    <ScoreBar score={data.opportunityScore} />
                  </MetricCard>
                  <MetricCard label="预估毛利率">
                    <span className="text-sm font-semibold text-zinc-900">
                      {data.profitEstimate}
                    </span>
                  </MetricCard>
                </dl>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <ReportBlock title="推荐 SKU">
                  <ul className="space-y-2">
                    {data.recommendedSkus.map((sku) => (
                      <li
                        key={sku}
                        className="flex items-center gap-2.5 text-sm text-zinc-700"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                        {sku}
                      </li>
                    ))}
                  </ul>
                </ReportBlock>

                <ReportBlock title="风险提示">
                  <ul className="space-y-2">
                    {data.risks.map((risk) => (
                      <li
                        key={risk}
                        className="flex items-start gap-2.5 text-sm text-zinc-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-300" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </ReportBlock>
              </div>

              <div className="rounded-md bg-zinc-50/80 px-4 py-3.5 ring-1 ring-zinc-200/40 ring-inset">
                <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                  综合建议
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">
                  {data.recommendation}
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function ConsultantSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-zinc-200" />
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-zinc-200" />
            <div className="h-5 w-32 rounded bg-zinc-200" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-16 rounded-lg bg-zinc-200" />
          <div className="h-16 rounded-lg bg-zinc-200" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-40 rounded-lg border border-zinc-200/60 bg-zinc-100" />
        <div className="h-40 rounded-lg border border-zinc-200/60 bg-zinc-100" />
      </div>
      <div className="h-20 rounded-md bg-zinc-100" />
    </div>
  );
}

function MetricCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200/60 bg-white px-3.5 py-3">
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

function ReportBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200/60 p-4 sm:p-5">
      <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
        {title}
      </p>
      <div className="mt-3">{children}</div>
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
