"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/dashboard/section-header";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { useForecastAnalysis } from "@/hooks/use-forecast-analysis";
import { getTrendHref, topTrends } from "@/lib/mock-data";
import {
  SENTIMENT_LABEL,
  SENTIMENT_COLOR,
} from "@/lib/sentiment-label";

const OUTLOOK_TO_SENTIMENT = {
  bullish: "Bullish",
  bearish: "Bearish",
  neutral: "Neutral",
} as const;

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

export function ForecastAiAnalysis() {
  const { data, loading, error, fetchedAt } = useForecastAnalysis();

  return (
    <section className="mb-8 rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <SectionHeader
        title="AI 预测分析"
        description="基于趋势生命周期与 90 天评分曲线自动生成的预测解读"
        badge="AI"
        meta={fetchedAt ? formatGeneratedAt(fetchedAt) : undefined}
      />

      {loading ? <ForecastAiAnalysisSkeleton /> : null}

      {!loading && error ? (
        <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-5 sm:p-6">
          <p className="text-sm font-medium text-red-800">AI 分析加载失败</p>
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
              <h3 className="text-sm font-semibold text-zinc-900">AI市场总结</h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-[15px]">
              {data.overview}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              <SentimentStat
                label="看涨趋势"
                value={countOutlook(data.trends, "bullish")}
              />
              <SentimentStat
                label="看跌趋势"
                value={countOutlook(data.trends, "bearish")}
              />
              <SentimentStat
                label="中性趋势"
                value={countOutlook(data.trends, "neutral")}
              />
            </dl>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {data.trends.map((trendReport) => {
              const sentiment = OUTLOOK_TO_SENTIMENT[trendReport.outlook];
              const slug = resolveTrendSlug(trendReport.trendName);

              return (
                <article
                  key={trendReport.trendName}
                  className="flex flex-col rounded-lg border border-zinc-200/60 p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-3">
                    <div>
                      <Link
                        href={getTrendHref(slug)}
                        className="text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600"
                      >
                        {trendReport.trendName}
                      </Link>
                      <span
                        className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${SENTIMENT_COLOR[sentiment]}`}
                      >
                        {SENTIMENT_LABEL[sentiment]}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                        可信度
                      </p>
                      <div className="mt-1 w-24">
                        <ScoreBar score={trendReport.confidence} />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                    {trendReport.summary}
                  </p>

                  <div className="mt-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {trendReport.keyPoints.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-zinc-100 px-2 py-1 text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-md bg-zinc-50/80 px-3 py-2.5 ring-1 ring-zinc-200/40 ring-inset">
                    <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                      行动建议
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">
                      {trendReport.recommendation}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ForecastAiAnalysisSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-zinc-200" />
          <div className="h-4 w-24 rounded bg-zinc-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-zinc-200" />
          <div className="h-4 w-4/5 rounded bg-zinc-200" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-zinc-200/60 bg-white px-3.5 py-3"
            >
              <div className="h-3 w-12 rounded bg-zinc-200" />
              <div className="mt-2 h-6 w-8 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200/60 p-4 sm:p-5"
          >
            <div className="border-b border-zinc-100 pb-3">
              <div className="h-4 w-20 rounded bg-zinc-200" />
              <div className="mt-2 h-5 w-12 rounded-full bg-zinc-200" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-zinc-200" />
              <div className="h-3 w-5/6 rounded bg-zinc-200" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((__, tagIndex) => (
                <div
                  key={tagIndex}
                  className="h-6 w-16 rounded-full bg-zinc-200"
                />
              ))}
            </div>
            <div className="mt-4 h-16 rounded-md bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function resolveTrendSlug(trendName: string): string {
  const matched = topTrends.find(
    (trend) => trend.name.toLowerCase() === trendName.toLowerCase(),
  );
  return matched?.slug ?? trendName.toLowerCase().replace(/\s+/g, "-");
}

function countOutlook(
  trends: Array<{ outlook: "bullish" | "bearish" | "neutral" }>,
  outlook: "bullish" | "bearish" | "neutral",
): number {
  return trends.filter((trend) => trend.outlook === outlook).length;
}

function SentimentStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200/60 bg-white px-3.5 py-3">
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">
        {value}
      </dd>
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
