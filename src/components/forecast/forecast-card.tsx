import Link from "next/link";
import type { TrendForecast } from "@/types/forecast";
import type { Trend } from "@/types/trend";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { TrendStageBadge } from "@/components/dashboard/trend-stage-badge";
import { getTrendHref } from "@/lib/mock-data";

interface ForecastCardProps {
  trend: Trend;
  forecast: TrendForecast;
}

type ForecastDirection = "bullish" | "bearish" | "neutral";

function getForecastDirection(
  forecast90: number,
  currentScore: number,
): ForecastDirection {
  if (forecast90 > currentScore) return "bullish";
  if (forecast90 < currentScore) return "bearish";
  return "neutral";
}

const directionStyles: Record<
  ForecastDirection,
  { label: string; className: string }
> = {
  bullish: {
    label: "看涨",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  },
  bearish: {
    label: "看跌",
    className: "bg-red-50 text-red-700 ring-red-600/15",
  },
  neutral: {
    label: "持平",
    className: "bg-zinc-100 text-zinc-600 ring-zinc-500/15",
  },
};

export function ForecastCard({ trend, forecast }: ForecastCardProps) {
  const direction = getForecastDirection(forecast.forecast90, trend.score);
  const directionStyle = directionStyles[direction];

  return (
    <article className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300/80 sm:p-6">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="min-w-0">
          <Link
            href={getTrendHref(trend.slug)}
            className="text-base font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-600"
          >
            {trend.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TrendStageBadge stage={trend.stage} />
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${directionStyle.className}`}
            >
              {directionStyle.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400">当前评分</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums text-zinc-900">
            {trend.score}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <ForecastMetric label="30 天预测" value={forecast.forecast30} />
        <ForecastMetric label="60 天预测" value={forecast.forecast60} />
        <ForecastMetric label="90 天预测" value={forecast.forecast90} highlight />
      </dl>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-zinc-50/80 px-3.5 py-3 ring-1 ring-zinc-200/40 ring-inset">
          <p className="text-xs text-zinc-400">可信度</p>
          <div className="mt-1.5">
            <ScoreBar score={forecast.confidence} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TimelineMetric
            label="预计峰值时间"
            value={formatDays(forecast.predictedPeakDay)}
          />
          <TimelineMetric
            label="预计衰退时间"
            value={formatDays(forecast.predictedDeclineDay)}
          />
        </div>
      </div>
    </article>
  );
}

function ForecastMetric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-50/80 px-3.5 py-3 ring-1 ring-zinc-200/40 ring-inset">
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd
        className={`mt-1 text-lg font-semibold tabular-nums ${
          highlight ? "text-zinc-900" : "text-zinc-700"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200/60 px-3.5 py-3">
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-zinc-800">{value}</dd>
    </div>
  );
}

function formatDays(days: number): string {
  if (days === 0) return "已处于当前阶段";
  return `${days} 天`;
}
