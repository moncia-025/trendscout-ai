import { AiInsightPanel } from "@/components/dashboard/ai-insight-panel";
import { AiOpportunityReport } from "@/components/dashboard/ai-opportunity-report";
import { AiWeeklyPick } from "@/components/dashboard/ai-weekly-pick";
import { AlertPanel } from "@/components/dashboard/alert-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TrendRankingTable } from "@/components/dashboard/trend-ranking-table";
import { WeeklyOpportunityRanking } from "@/components/dashboard/weekly-opportunity-ranking";
import { trends, weeklyOpportunities } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />
      <AiWeeklyPick />
      <WeeklyOpportunityRanking opportunities={weeklyOpportunities} />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8 sm:px-8 lg:px-12">
        <div className="border-b border-zinc-200/60 pb-2">
          <p className="text-xs font-medium text-zinc-400">深度分析</p>
          <h2 className="mt-1 text-sm font-semibold text-zinc-700">
            趋势背景参考
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            选品机会背后的趋势信号与 AI 分析，供进一步决策参考。
          </p>
        </div>

        <TrendRankingTable trends={trends} />
        <AiInsightPanel trends={trends} />
        <AlertPanel />
        <AiOpportunityReport trends={trends} />
      </main>
    </div>
  );
}
