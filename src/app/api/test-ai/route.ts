import { deepseek } from "@/services/ai/deepseek";

export async function GET() {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: "请分析 Coquette 风格未来90天的跨境电商选品机会。",
        },
      ],
    });

    return Response.json({
      success: true,
      result: response.choices[0].message.content,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      {
        status: 500,
      },
    );
  }
}
