import { z } from "zod";
import { analyzeAlert } from "@/services/ai/alert-analyst";

const AlertAnalysisRequestSchema = z.object({
  trendName: z.string().trim().min(1),
  score: z.number(),
  forecast90: z.number(),
  stage: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = AlertAnalysisRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid request body",
        },
        { status: 400 },
      );
    }

    const result = await analyzeAlert(parsed.data);

    return Response.json(result);
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
