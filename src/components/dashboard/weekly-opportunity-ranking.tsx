import Link from "next/link";
import type { ProductOpportunity } from "@/lib/mock-data";
import { getTrendHref } from "@/lib/mock-data";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { ScoreBar } from "@/components/dashboard/score-bar";

interface WeeklyOpportunityRankingProps {
  opportunities: ProductOpportunity[];
}

export function WeeklyOpportunityRanking({
  opportunities,
}: WeeklyOpportunityRankingProps) {
  return (
    <section className="border-b border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 选品决策
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            本周选品机会榜
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            别问「什么趋势火」——直接告诉你
            <span className="font-medium text-zinc-800">「我应该卖什么」</span>
            。以下 SKU 由 AI 根据趋势信号、竞争强度与生命周期综合筛选。
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {opportunities.map((item, index) => (
            <OpportunityCard key={item.id} item={item} rank={index + 1} />
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          数据更新于本周一 · 基于美国、韩国等主要市场的社交与搜索信号
        </p>
      </div>
    </section>
  );
}

function OpportunityCard({
  item,
  rank,
}: {
  item: ProductOpportunity;
  rank: number;
}) {
  const isTop = rank === 1;

  return (
    <Link
      href={getTrendHref(item.trendSlug)}
      className={`block rounded-xl border p-5 transition-colors sm:p-6 ${
        isTop
          ? "border-zinc-900/15 bg-zinc-50/50 ring-1 ring-zinc-900/5 hover:border-zinc-900/25"
          : "border-zinc-200/80 bg-white hover:border-zinc-300/80 hover:bg-zinc-50/30"
      }`}
    >
      <article>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 gap-4">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold tabular-nums ${
                isTop
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {rank}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">
                  {item.productName}
                </h2>
                {isTop ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-600/15 ring-inset">
                    本周首推
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                所属趋势 ·{" "}
                <span className="font-medium text-zinc-700">{item.trendName}</span>
              </p>
            </div>
          </div>

          <RiskBadge level={item.risk} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="机会指数">
            <ScoreBar score={item.opportunityScore} className="max-w-[200px]" />
          </Metric>
          <Metric label="生命周期预测">
            <span className="text-sm font-semibold tabular-nums text-zinc-900">
              预计 {item.lifecycle}
            </span>
          </Metric>
          <Metric label="风险等级">
            <RiskBadge level={item.risk} />
          </Metric>
        </dl>

        <div className="mt-4 rounded-lg border border-zinc-200/60 bg-white px-4 py-3">
          <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
            推荐原因
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
            {item.reason}
          </p>
        </div>
      </article>
    </Link>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-zinc-50/80 px-3.5 py-3 ring-1 ring-zinc-200/40 ring-inset">
      <dt className="text-[10px] font-medium tracking-wide text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}
