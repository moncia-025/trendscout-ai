import { compareTrends } from "@/lib/comparison-engine";
import { TrendComparisonRequestSchema } from "@/types/comparison";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = TrendComparisonRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid request body",
        },
        { status: 400 },
      );
    }

    const result = compareTrends(parsed.data.trends);

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    const status = message.startsWith("Trend not found") ? 404 : 500;

    return Response.json(
      {
        success: false,
        error: message,
      },
      { status },
    );
  }
}
