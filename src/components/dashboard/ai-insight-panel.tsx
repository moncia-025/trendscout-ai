import Link from "next/link";
import type { Trend } from "@/lib/mock-data";
import { getTrendHref } from "@/lib/mock-data";
import { ScoreBar } from "@/components/dashboard/score-bar";
import { SectionHeader } from "@/components/dashboard/section-header";
import { TrendStageBadge } from "@/components/dashboard/trend-stage-badge";

interface AiInsightPanelProps {
  trends: Trend[];
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    </svg>
  );
}

export function AiInsightPanel({ trends }: AiInsightPanelProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
      <SectionHeader
        title="AI Insight Panel"
        description="Automated analysis of trend score, stage, market, and lifecycle"
        badge="AI"
      />

      <div className="space-y-3">
        {trends.map((trend) => (
          <Link
            key={trend.id}
            href={getTrendHref(trend.slug)}
            className="block rounded-lg border border-zinc-200/60 p-4 transition-colors hover:border-zinc-300/80 hover:bg-zinc-50/30"
          >
            <article>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50">
                    <SparkleIcon className="h-4 w-4 text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {trend.name}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                      {trend.insight}
                    </p>
                  </div>
                </div>
                <TrendStageBadge stage={trend.stage} />
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Trend Score">
                  <ScoreBar score={trend.score} />
                </Metric>
                <Metric label="Trend Stage">
                  <TrendStageBadge stage={trend.stage} />
                </Metric>
                <Metric label="Primary Market">
                  <span className="text-sm font-medium text-zinc-900">
                    {trend.primaryMarket}
                  </span>
                </Metric>
                <Metric label="Lifecycle Forecast">
                  <span className="text-sm font-medium tabular-nums text-zinc-900">
                    {trend.opportunity.estimatedLifecycle}
                  </span>
                </Metric>
              </dl>
            </article>
          </Link>
        ))}
      </div>
    </section>
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
    <div className="rounded-md bg-zinc-50/80 px-3 py-2.5 ring-1 ring-zinc-200/40 ring-inset">
      <dt className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}
