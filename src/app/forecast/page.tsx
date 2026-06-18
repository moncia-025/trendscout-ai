import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ForecastAiAnalysis } from "@/components/forecast/forecast-ai-analysis";
import { ForecastGrid } from "@/components/forecast/forecast-grid";
import { ForecastHeader } from "@/components/forecast/forecast-header";

export const metadata: Metadata = {
  title: "趋势预测中心 — TrendScout AI",
  description: "基于趋势生命周期与市场热度预测未来 90 天走势",
};

export default function ForecastPage() {
  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />
      <ForecastHeader />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <ForecastAiAnalysis />
        <ForecastGrid />
      </main>
    </div>
  );
}
