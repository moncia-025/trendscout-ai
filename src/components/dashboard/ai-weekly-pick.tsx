import Link from "next/link";
import { featuredWeeklyPick } from "@/data/weekly-pick";
import { getTrendHref } from "@/lib/mock-data";

export function AiWeeklyPick() {
  const pick = featuredWeeklyPick;

  return (
    <section className="border-b border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-12">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-wide text-violet-600">
                AI 本周推荐
              </p>

              <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                <span aria-hidden="true">🥇</span>
                {pick.skuName}
              </h2>

              <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <div>
                  <dt className="text-xs text-zinc-400">机会指数</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900">
                    {pick.opportunityScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-400">预计利润率</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-emerald-600">
                    {pick.estimatedProfitMargin}%
                  </dd>
                </div>
              </dl>

              <p className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15 ring-inset">
                {pick.actionLabel}
              </p>
            </div>

            <Link
              href={getTrendHref(pick.trendSlug)}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600"
            >
              查看详情
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
