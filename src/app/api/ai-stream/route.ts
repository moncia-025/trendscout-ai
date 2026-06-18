import { z } from "zod";
import { deepseek } from "@/services/ai/deepseek";

export const runtime = "nodejs";

const DEEPSEEK_MODEL = "deepseek-chat";

const AiStreamRequestSchema = z.object({
  trendName: z.string().trim().min(1, "trendName is required"),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = AiStreamRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 },
    );
  }

  const { trendName } = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const closeStream = () => {
        try {
          controller.close();
        } catch {
          // stream already closed
        }
      };

      const onAbort = () => {
        closeStream();
      };

      request.signal.addEventListener("abort", onAbort);

      try {
        const completion = await deepseek.chat.completions.create({
          model: DEEPSEEK_MODEL,
          stream: true,
          messages: buildMessages(trendName),
        });

        for await (const chunk of completion) {
          if (request.signal.aborted) {
            break;
          }

          const token = chunk.choices[0]?.delta?.content;

          if (token) {
            controller.enqueue(encoder.encode(formatSseData(token)));
          }
        }

        if (!request.signal.aborted) {
          controller.enqueue(encoder.encode(formatSseData("[DONE]")));
        }
      } catch (error) {
        if (!request.signal.aborted) {
          const message =
            error instanceof Error ? error.message : "Stream error";
          controller.enqueue(encoder.encode(formatSseData(`ERROR: ${message}`)));
        }
      } finally {
        request.signal.removeEventListener("abort", onAbort);
        closeStream();
      }
    },
    cancel() {
      // client disconnected from ReadableStream consumer side
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function buildMessages(trendName: string): Array<{
  role: "system" | "user";
  content: string;
}> {
  return [
    {
      role: "system",
      content: [
        "你是一名跨境电商趋势分析顾问。",
        "请用自然语言输出，不要使用 JSON，不要使用 Markdown 标题。",
        "内容适合流式逐字展示，段落之间可以换行。",
        "请依次覆盖以下部分：趋势阶段分析、市场机会、风险提示、推荐 SKU、行动建议。",
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        `分析趋势：${trendName}`,
        "",
        "输出：",
        "趋势阶段分析",
        "市场机会",
        "风险提示",
        "推荐SKU",
        "行动建议",
      ].join("\n"),
    },
  ];
}

function formatSseData(value: string): string {
  return `data: ${value}\n\n`;
}
