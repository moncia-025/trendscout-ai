import { z } from "zod";
import {
  getGoogleTrends,
  GoogleTrendsResultSchema,
} from "@/services/trends/google-trends";

export const runtime = "nodejs";

const KeywordQuerySchema = z.object({
  keyword: z.string().trim().min(1, "keyword is required"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = KeywordQuerySchema.safeParse({
      keyword: searchParams.get("keyword") ?? "",
    });

    if (!parsedQuery.success) {
      return Response.json(
        {
          success: false,
          error: parsedQuery.error.issues[0]?.message ?? "Invalid query",
        },
        { status: 400 },
      );
    }

    const result = await getGoogleTrends(parsedQuery.data.keyword);
    const validated = GoogleTrendsResultSchema.parse(result);

    return Response.json(validated);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}
