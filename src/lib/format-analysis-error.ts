const DEFAULT_DIFY_BASE = "http://localhost/v1";

export function formatAnalysisError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown Error");

  if (message.includes("DIFY_API_KEY is not configured")) {
    return "未配置 DIFY_API_KEY。请在 .env.local 填入 Dify「后端服务 API → API 密钥」，保存后重启 npm run dev。";
  }

  if (
    message === "fetch failed" ||
    message.includes("ECONNREFUSED") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNRESET")
  ) {
    const base =
      typeof process !== "undefined"
        ? (process.env.DIFY_API_BASE_URL ?? DEFAULT_DIFY_BASE)
        : DEFAULT_DIFY_BASE;

    return `无法连接 Dify 服务（${base}）。请确认 Dify 已完整启动后再点击分析。`;
  }

  if (/502|503|504/.test(message) || message.includes("Bad Gateway")) {
    return "Dify 服务暂不可用（502/503）。请检查 Docker 容器是否全部正常运行。";
  }

  if (
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("AbortError")
  ) {
    return "Dify Workflow 响应超时。Workflow 可能仍在运行，请稍后重试或在 Dify 控制台查看执行日志。";
  }

  if (message.includes("Unable to parse Dify workflow output")) {
    return "Dify 已返回数据，但字段格式与前端不一致。请检查 Workflow 结束节点输出是否包含 keyword、trend_score、recommendation 等字段。";
  }

  return message;
}
