import type { Metadata } from "next";
import { ConsultantPageClient } from "@/components/pages/consultant-page-client";

export const metadata: Metadata = {
  title: "AI 产品顾问 — TrendScout AI",
  description: "Dify Workflow 驱动的跨境电商选品咨询",
};

export default function ConsultantPage() {
  return <ConsultantPageClient />;
}
