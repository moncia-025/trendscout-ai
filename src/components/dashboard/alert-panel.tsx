import Link from "next/link";
import { alerts } from "@/data/alerts";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getTrendHref } from "@/lib/mock-data";
import type { TrendAlert } from "@/lib/alert-engine";

const LEVEL_STYLES: Record<
  TrendAlert["level"],
  { badge: string; card: string; label: string }
> = {
  high: {
    label: "高优先级",
    badge: "bg-red-100 text-red-700 ring-red-600/15",
    card: "border-red-200/80 bg-red-50/40",
  },
  medium: {
    label: "中优先级",
    badge: "bg-amber-100 text-amber-800 ring-amber-600/15",
    card: "border-amber-200/80 bg-amber-50/40",
  },
  low: {
    label: "低优先级",
    badge: "bg-zinc-100 text-zinc-600 ring-zinc-500/15",
    card: "border-zinc-200/80 bg-zinc-50/40",
  },
};

export function AlertPanel() {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
      <SectionHeader
        title="AI 趋势预警"
        description="基于 90 天预测与当前热度的智能预警中心"
        badge="Alert"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {alerts.map((alert) => {
          const style = LEVEL_STYLES[alert.level];

          return (
            <article
              key={alert.trendId}
              className={`flex flex-col rounded-lg border p-4 sm:p-5 ${style.card}`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-zinc-200/40 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {alert.trendName}
                  </h3>
                  <span
                    className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.badge}`}
                  >
                    {style.label}
                  </span>
                </div>
                <span className="text-lg font-semibold tabular-nums text-zinc-900">
                  {alert.score}
                </span>
              </div>

              <div className="mt-4 flex-1 space-y-3">
                <p className="text-sm font-medium text-zinc-900">
                  {alert.title}
                </p>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {alert.message}
                </p>
                <div className="rounded-md bg-white/60 px-3 py-2.5 ring-1 ring-zinc-200/40 ring-inset">
                  <p className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
                    建议行动
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-700">
                    {alert.action}
                  </p>
                </div>
              </div>

              <Link
                href={getTrendHref(alert.trendId)}
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                查看趋势
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
