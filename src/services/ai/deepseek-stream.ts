const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

export interface StreamChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

export async function* streamChat(
  messages: StreamChatMessage[],
): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek stream failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error("DeepSeek stream response body is empty");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const token = parseStreamLine(line);
        if (token === null) continue;
        if (token === "[DONE]") return;
        yield token;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function parseStreamLine(line: string): string | null | "[DONE]" {
  const trimmed = line.trim();

  if (!trimmed.startsWith("data:")) {
    return null;
  }

  const payload = trimmed.slice(5).trim();

  if (payload === "[DONE]") {
    return "[DONE]";
  }

  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as DeepSeekStreamChunk;
    const content = parsed.choices?.[0]?.delta?.content;

    if (!content) {
      return null;
    }

    return content;
  } catch {
    return null;
  }
}
