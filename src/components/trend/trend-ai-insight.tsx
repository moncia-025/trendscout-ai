import type { AiTrendInsight } from "@/lib/mock-data";

interface TrendAiInsightProps {
  aiInsight: AiTrendInsight;
}

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

export function TrendAiInsight({ aiInsight }: TrendAiInsightProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
          <SparkleIcon />
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-900">AI 趋势洞察</h2>
          <p className="text-xs text-zinc-500">基于多平台趋势信号自动生成</p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-zinc-700 sm:text-[15px]">
          {aiInsight.summary}
        </p>

        <ul className="space-y-2 pl-1">
          {aiInsight.spreadingCategories.map((category) => (
            <li
              key={category}
              className="flex items-center gap-2.5 text-sm text-zinc-800"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
              {category}
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-zinc-200/60 pt-4">
          <p className="text-sm font-medium text-zinc-800">
            {aiInsight.forecast}
          </p>
          <p className="text-sm text-zinc-600">{aiInsight.signalNote}</p>
        </div>
      </div>
    </section>
  );
}
