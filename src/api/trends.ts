import { request } from "@/api/request";
import type { TrendAnalysis, TrendResponse } from "@/types/trend";

export async function postTrendAnalysis(query: string): Promise<TrendAnalysis> {
  const { data } = await request.post<TrendResponse>("/api/trend-analysis", {
    query,
  });

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "Trend analysis failed");
  }

  return data.data;
}
