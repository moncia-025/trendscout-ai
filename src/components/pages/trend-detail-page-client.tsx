"use client";

import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AnalysisState } from "@/components/trend-analysis/analysis-state";
import { TrendAnalysisView } from "@/components/trend-analysis/trend-analysis-view";
import { useTrendAnalysis } from "@/hooks/use-trend-analysis";

interface TrendDetailPageClientProps {
  keyword: string;
}

export function TrendDetailPageClient({ keyword }: TrendDetailPageClientProps) {
  const { status, data, error, analyze } = useTrendAnalysis();

  useEffect(() => {
    if (keyword) {
      void analyze(keyword);
    }
  }, [analyze, keyword]);

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 趋势详情
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            {keyword}
          </h1>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        {status === "success" && data ? (
          <TrendAnalysisView analysis={data} />
        ) : (
          <AnalysisState status={status} error={error} />
        )}
      </main>
    </div>
  );
}
