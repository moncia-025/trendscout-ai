import { postTrendAnalysis } from "@/api/trends";
import type { TrendAnalysis } from "@/types/trend";

export async function analyzeTrendQuery(
  query: string,
): Promise<TrendAnalysis> {
  const normalized = query.trim();

  if (!normalized) {
    throw new Error("Query is required");
  }

  return postTrendAnalysis(normalized);
}

export async function analyzeTrendQueries(
  queries: string[],
): Promise<TrendAnalysis[]> {
  const unique = [...new Set(queries.map((item) => item.trim()).filter(Boolean))];
  const results: TrendAnalysis[] = [];

  // 串行调用，避免同时打满 Dify Workflow 导致单次超过客户端超时
  for (const query of unique) {
    results.push(await analyzeTrendQuery(query));
  }

  return results;
}
