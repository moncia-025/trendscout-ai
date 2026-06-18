import Link from "next/link";
import type { Trend } from "@/lib/mock-data";
import { getTrendHref } from "@/lib/mock-data";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { TrendStageBadge } from "@/components/dashboard/trend-stage-badge";

interface TrendRankingTableProps {
  trends: Trend[];
}

export function TrendRankingTable({ trends }: TrendRankingTableProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
      <SectionHeader
        title="Trend Ranking"
        description="Composite ranking by score, momentum, and market signal strength"
        meta="Updated just now"
      />

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-200/80">
              <th
                scope="col"
                className="pb-3 pr-4 text-left text-[11px] font-medium tracking-wide text-zinc-400 uppercase"
              >
                Trend
              </th>
              <th
                scope="col"
                className="pb-3 pr-4 text-left text-[11px] font-medium tracking-wide text-zinc-400 uppercase"
              >
                Trend Score
              </th>
              <th
                scope="col"
                className="pb-3 pr-4 text-left text-[11px] font-medium tracking-wide text-zinc-400 uppercase"
              >
                Growth Rate
              </th>
              <th
                scope="col"
                className="pb-3 pr-4 text-left text-[11px] font-medium tracking-wide text-zinc-400 uppercase"
              >
                Stage
              </th>
              <th
                scope="col"
                className="pb-3 text-left text-[11px] font-medium tracking-wide text-zinc-400 uppercase"
              >
                Market
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {trends.map((trend, index) => (
              <tr
                key={trend.id}
                className="group transition-colors hover:bg-zinc-50/80"
              >
                <td className="py-4 pr-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded text-[11px] font-medium tabular-nums text-zinc-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={getTrendHref(trend.slug)}
                      className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600"
                    >
                      {trend.name}
                    </Link>
                  </div>
                </td>
                <td className="py-4 pr-4 whitespace-nowrap">
                  <ScoreBar score={trend.score} className="min-w-[140px]" />
                </td>
                <td className="py-4 pr-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-sm font-medium tabular-nums text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.28 7.53a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {trend.growth}%
                  </span>
                </td>
                <td className="py-4 pr-4 whitespace-nowrap">
                  <TrendStageBadge stage={trend.stage} />
                </td>
                <td className="py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    {trend.primaryMarket}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
