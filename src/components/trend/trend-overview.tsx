import type { Trend } from "@/lib/mock-data";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { TrendStageBadge } from "@/components/dashboard/trend-stage-badge";

interface TrendOverviewProps {
  trend: Trend;
}

export function TrendOverview({ trend }: TrendOverviewProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 border-b border-zinc-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-400">趋势概览</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {trend.name}
          </h1>
        </div>
        <TrendStageBadge stage={trend.stage} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard label="趋势评分">
          <ScoreBar score={trend.score} />
        </OverviewCard>
        <OverviewCard label="增长率">
          <span className="inline-flex items-center gap-1 text-lg font-semibold tabular-nums text-emerald-600">
            <GrowthIcon />
            +{trend.growth}%
          </span>
        </OverviewCard>
        <OverviewCard label="趋势阶段">
          <TrendStageBadge stage={trend.stage} />
        </OverviewCard>
        <OverviewCard label="主要市场">
          <span className="text-sm font-semibold text-zinc-900">
            {trend.primaryMarket}
          </span>
        </OverviewCard>
      </div>
    </section>
  );
}

function OverviewCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-4">
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function GrowthIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.28 7.53a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
