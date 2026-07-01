import { z } from "zod";
import { runDifyTrendWorkflow } from "@/services/dify/workflow";

export const maxDuration = 300;

const RequestBodySchema = z.object({
  query: z.string().trim().min(1, "query is required"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = RequestBodySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid request body",
        },
        { status: 400 },
      );
    }

    const data = await runDifyTrendWorkflow(parsed.data.query);

    return Response.json({ success: true, data });
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
