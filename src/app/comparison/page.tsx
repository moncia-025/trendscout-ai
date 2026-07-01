import type { Metadata } from "next";
import { ComparisonPageClient } from "@/components/pages/comparison-page-client";

export const metadata: Metadata = {
  title: "趋势对比 — TrendScout AI",
  description: "多关键词 Dify Workflow 对比排名",
};

export default function ComparisonPage() {
  return <ComparisonPageClient />;
}
