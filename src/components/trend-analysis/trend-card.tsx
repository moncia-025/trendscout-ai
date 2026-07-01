import Link from "next/link";
import type { TrendAnalysis } from "@/types/trend";
import { getTrendHref } from "@/types/trend";
import { ScoreCard } from "@/components/trend-analysis/score-card";

interface TrendCardProps {
  analysis: TrendAnalysis;
  showLink?: boolean;
}

export function TrendCard({ analysis, showLink = true }: TrendCardProps) {
  const content = (
    <article className="rounded-xl border border-zinc-200/80 bg-white p-5 transition-colors hover:border-zinc-300/80">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            {analysis.keyword}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">{analysis.trend_stage}</p>
        </div>
        <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white uppercase">
          {analysis.risk_level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ScoreCard label="Trend Score" value={analysis.trend_score} />
        <ScoreCard
          label="Opportunity"
          value={analysis.opportunity_score}
          accent="success"
        />
        <ScoreCard label="Product Score" value={analysis.product_score} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-zinc-600">
        {analysis.insight}
      </p>
    </article>
  );

  if (!showLink) {
    return content;
  }

  return (
    <Link href={getTrendHref(analysis.keyword)} className="block">
      {content}
    </Link>
  );
}
