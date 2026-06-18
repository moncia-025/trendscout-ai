const ANALYSIS_STEPS = [
  "正在分析趋势...",
  "正在计算增长率...",
  "正在预测生命周期...",
  "正在评估竞争度...",
  "正在生成 SKU 建议...",
  "分析完成",
] as const;

const STEP_INTERVAL_MS = 1000;

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (const step of ANALYSIS_STEPS) {
          controller.enqueue(encoder.encode(formatSseData(step)));
          await sleep(STEP_INTERVAL_MS);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream error";
        controller.enqueue(encoder.encode(formatSseData(message)));
      } finally {
        controller.close();
      }
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

function formatSseData(value: string): string {
  return `data: ${value}\n\n`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
