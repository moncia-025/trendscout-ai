import Link from "next/link";
import type { Trend } from "@/lib/mock-data";
import { getTrendHref } from "@/lib/mock-data";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { SectionHeader } from "@/components/dashboard/section-header";

interface AiOpportunityReportProps {
  trends: Trend[];
}

export function AiOpportunityReport({ trends }: AiOpportunityReportProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
      <SectionHeader
        title="AI Opportunity Report"
        description="SKU recommendations, market opportunities, and risk assessment"
        badge="Report"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {trends.map((trend) => (
          <Link
            key={trend.id}
            href={getTrendHref(trend.slug)}
            className="flex flex-col rounded-lg border border-zinc-200/60 p-4 transition-colors hover:border-zinc-300/80 hover:bg-zinc-50/30"
          >
            <article className="flex flex-1 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {trend.name}
                </h3>
                <RiskBadge level={trend.opportunity.risk} />
              </div>

              <div className="mt-4 flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                    Recommended SKUs
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {trend.opportunity.recommendedSkus.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-zinc-700"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-zinc-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                    Market Opportunity
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {trend.marketOpportunity}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-md bg-zinc-50/80 px-3 py-2.5 ring-1 ring-zinc-200/40 ring-inset">
                  <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                    Risk Level
                  </p>
                  <RiskBadge level={trend.opportunity.risk} />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
