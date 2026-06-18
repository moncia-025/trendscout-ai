"use client";

import { useCallback, useRef, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { topTrends } from "@/lib/mock-data";

const DEFAULT_TREND = topTrends[0]?.name ?? "Coquette";

export default function StreamAnalysisPage() {
  const [trendName, setTrendName] = useState(DEFAULT_TREND);
  const [content, setContent] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setContent("");
    setError(null);
    setDone(false);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/ai-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trendName }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const result: unknown = await response.json();
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "流式分析请求失败";
        throw new Error(message);
      }

      if (!response.body) {
        throw new Error("响应体为空");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .find((line) => line.startsWith("data: "));

          if (!dataLine) continue;

          const data = dataLine.slice(6);

          if (data === "[DONE]") {
            setDone(true);
            return;
          }

          if (data.startsWith("ERROR")) {
            throw new Error(data);
          }

          setContent((previous) => previous + data);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "连接中断，请重试");
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [stopStream, trendName]);

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · 流式分析
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            AI 流式趋势分析
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            通过 SSE 实时接收 DeepSeek 输出的趋势分析与选品建议
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
          <SectionHeader
            title="实时分析"
            description="点击开始后，AI 将逐字输出分析内容"
            badge="SSE"
          />

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-xs text-zinc-400">趋势名称</label>
              <input
                value={trendName}
                onChange={(event) => setTrendName(event.target.value)}
                disabled={streaming}
                className="mt-1 w-full rounded-lg border border-zinc-200/80 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5 disabled:opacity-60"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void startStream()}
                disabled={streaming || !trendName.trim()}
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
              >
                {streaming ? "分析中..." : "开始分析"}
              </button>
              {streaming ? (
                <button
                  type="button"
                  onClick={stopStream}
                  className="rounded-lg border border-zinc-200/80 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  停止
                </button>
              ) : null}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {topTrends.map((trend) => (
              <button
                key={trend.slug}
                type="button"
                disabled={streaming}
                onClick={() => setTrendName(trend.name)}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-200 disabled:opacity-60"
              >
                {trend.name}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200/80 bg-red-50/40 p-5">
              <p className="text-sm font-medium text-red-800">分析失败</p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          ) : null}

          {streaming && !content ? (
            <div className="animate-pulse rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-6">
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-zinc-200" />
                <div className="h-4 w-5/6 rounded bg-zinc-200" />
                <div className="h-4 w-4/6 rounded bg-zinc-200" />
              </div>
              <p className="mt-4 text-sm text-zinc-500">正在连接 DeepSeek...</p>
            </div>
          ) : null}

          {content ? (
            <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 sm:text-[15px]">
                {content}
              </p>
              {done ? (
                <p className="mt-4 text-xs text-emerald-600">分析完成</p>
              ) : null}
              {streaming ? (
                <span className="mt-4 inline-block h-4 w-0.5 animate-pulse bg-zinc-900" />
              ) : null}
            </div>
          ) : null}

          {!streaming && !content && !error ? (
            <div className="rounded-xl border border-dashed border-zinc-200/80 bg-zinc-50/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                点击「开始分析」启动 DeepSeek 流式输出
              </p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
