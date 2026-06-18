import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TrendAiInsight } from "@/components/trend/trend-ai-insight";
import { TrendBreadcrumb } from "@/components/trend/trend-breadcrumb";
import { TrendOverview } from "@/components/trend/trend-overview";
import { TrendRecommendedSkus } from "@/components/trend/trend-recommended-skus";
import { TrendRiskAnalysis } from "@/components/trend/trend-risk-analysis";
import { getTrendBySlug, trends } from "@/lib/mock-data";

interface TrendPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return trends.map((trend) => ({
    slug: trend.slug,
  }));
}

export async function generateMetadata({
  params,
}: TrendPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trend = getTrendBySlug(slug);

  if (!trend) {
    return { title: "未找到趋势 — TrendScout AI" };
  }

  return {
    title: `${trend.name} 趋势分析 — TrendScout AI`,
    description: trend.insight,
  };
}

export default async function TrendPage({ params }: TrendPageProps) {
  const { slug } = await params;
  const trend = getTrendBySlug(slug);

  if (!trend) {
    notFound();
  }

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <TrendBreadcrumb trendName={trend.name} />

        <div className="space-y-6">
          <TrendOverview trend={trend} />
          <TrendAiInsight aiInsight={trend.aiInsight} />
          <TrendRecommendedSkus trend={trend} />
          <TrendRiskAnalysis riskAnalysis={trend.riskAnalysis} />
        </div>

        <div className="mt-8 border-t border-zinc-200/80 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.22 3.22a.75.75 0 0 1 0 1.06L7.06 7.5l3.16 3.22a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}
