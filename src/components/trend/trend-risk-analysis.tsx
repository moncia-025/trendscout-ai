import type { RiskAnalysis } from "@/lib/mock-data";
import { RiskBadge } from "@/components/dashboard/risk-badge";

interface TrendRiskAnalysisProps {
  riskAnalysis: RiskAnalysis;
}

export function TrendRiskAnalysis({ riskAnalysis }: TrendRiskAnalysisProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
      <div className="mb-5 border-b border-zinc-100 pb-4">
        <h2 className="text-base font-semibold text-zinc-900">风险分析</h2>
        <p className="mt-1 text-xs text-zinc-500">
          进入该趋势前需要关注的风险因素与应对策略
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <RiskField label="风险等级">
          <RiskBadge level={riskAnalysis.level} />
        </RiskField>
        <RiskField label="风险说明" className="sm:col-span-2">
          <p className="text-sm leading-relaxed text-zinc-700">
            {riskAnalysis.explanation}
          </p>
        </RiskField>
        <RiskField label="建议策略" className="sm:col-span-3">
          <div className="flex gap-3 rounded-lg border border-amber-200/60 bg-amber-50/50 px-4 py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm leading-relaxed text-amber-900">
              {riskAnalysis.strategy}
            </p>
          </div>
        </RiskField>
      </dl>
    </section>
  );
}

function RiskField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-4 ${className}`}
    >
      <dt className="text-xs font-medium text-zinc-400">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}
