import type { Metadata } from "next";
import { ForecastPageClient } from "@/components/pages/forecast-page-client";

export const metadata: Metadata = {
  title: "趋势预测中心 — TrendScout AI",
  description: "基于 Dify Workflow 的趋势生命周期与机会分析",
};

export default function ForecastPage() {
  return <ForecastPageClient />;
}
