import { TrendDetailPageClient } from "@/components/pages/trend-detail-page-client";

interface TrendPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TrendPage({ params }: TrendPageProps) {
  const { slug } = await params;
  const keyword = decodeURIComponent(slug).replace(/-/g, " ");

  return <TrendDetailPageClient keyword={keyword} />;
}
