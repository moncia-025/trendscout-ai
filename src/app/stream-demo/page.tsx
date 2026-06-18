"use client";

import { useCallback, useRef, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { topTrends } from "@/lib/mock-data";

type AnalysisStatus = "idle" | "analyzing" | "completed" | "failed";

const DEFAULT_TREND = "Coquette";

export default function StreamDemoPage() {
  const [trendName, setTrendName] = useState(DEFAULT_TREND);
  const [sentences, setSentences] = useState<string[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pendingRef = useRef("");

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const flushPendingSentence = useCallback(() => {
    const remaining = pendingRef.current.trim();
    pendingRef.current = "";

    if (remaining) {
      setSentences((previous) => [...previous, remaining]);
    }
  }, []);

  const appendToken = useCallback((token: string) => {
    pendingRef.current += token;

    const parts = pendingRef.current.split(/(?<=[。！？\n])/);

    if (parts.length <= 1) {
      return;
    }

    const completed = parts.slice(0, -1).map((part) => part.trim()).filter(Boolean);
    pendingRef.current = parts[parts.length - 1] ?? "";

    if (completed.length > 0) {
      setSentences((previous) => [...previous, ...completed]);
    }
  }, []);

  const startAnalysis = useCallback(async () => {
    stopStream();
    pendingRef.current = "";
    setSentences([]);
    setError(null);
    setStatus("analyzing");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/ai-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trendName: trendName.trim() || DEFAULT_TREND }),
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
            flushPendingSentence();
            setStatus("completed");
            return;
          }

          if (data.startsWith("ERROR")) {
            throw new Error(data);
          }

          appendToken(data);
        }
      }

      flushPendingSentence();
      setStatus("completed");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
        return;
      }

      setError(err instanceof Error ? err.message : "分析失败，请重试");
      setStatus("failed");
    } finally {
      abortRef.current = null;
    }
  }, [appendToken, flushPendingSentence, stopStream, trendName]);

  const isAnalyzing = status === "analyzing";

  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />

      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-medium tracking-wide text-zinc-400">
            TrendScout AI · SSE 演示
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            AI 流式分析演示
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            通过 POST /api/ai-stream 实时接收 DeepSeek 流式分析，逐句展示结果
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
        <section className="rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8">
          <SectionHeader
            title="流式分析"
            description="输入趋势名称，连接 DeepSeek SSE 流式输出"
            badge="Demo"
          />

          <div className="mb-4">
            <label className="text-xs text-zinc-400">趋势名称</label>
            <input
              value={trendName}
              onChange={(event) => setTrendName(event.target.value)}
              disabled={isAnalyzing}
              placeholder="Coquette"
              className="mt-1 w-full rounded-lg border border-zinc-200/80 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/5 disabled:opacity-60 sm:max-w-md"
            />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {topTrends.map((trend) => (
              <button
                key={trend.slug}
                type="button"
                disabled={isAnalyzing}
                onClick={() => setTrendName(trend.name)}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-200 disabled:opacity-60"
              >
                {trend.name}
              </button>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void startAnalysis()}
              disabled={isAnalyzing || !trendName.trim()}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
            >
              {isAnalyzing ? "分析中..." : "开始分析"}
            </button>
            {isAnalyzing ? (
              <button
                type="button"
                onClick={stopStream}
                className="rounded-lg border border-zinc-200/80 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                停止
              </button>
            ) : null}
            <StatusBadge status={status} />
          </div>

          {status === "failed" && error ? (
            <div className="mb-4 rounded-xl border border-red-200/80 bg-red-50/40 p-5">
              <p className="text-sm font-medium text-red-800">分析失败</p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          ) : null}

          {isAnalyzing && sentences.length === 0 ? (
            <div className="animate-pulse rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-6">
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-zinc-200" />
                <div className="h-4 w-5/6 rounded bg-zinc-200" />
                <div className="h-4 w-4/6 rounded bg-zinc-200" />
              </div>
              <p className="mt-4 text-sm text-zinc-500">正在连接 DeepSeek...</p>
            </div>
          ) : null}

          {sentences.length > 0 ? (
            <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/40 p-5 sm:p-6">
              <div className="space-y-4">
                {sentences.map((sentence, index) => (
                  <div key={`${index}-${sentence.slice(0, 12)}`}>
                    {index > 0 ? (
                      <div className="mb-4 border-t border-zinc-200/80" />
                    ) : null}
                    <p className="text-sm leading-relaxed text-zinc-700 sm:text-[15px]">
                      {sentence}
                    </p>
                  </div>
                ))}
              </div>
              {isAnalyzing ? (
                <span className="mt-4 inline-block h-4 w-0.5 animate-pulse bg-zinc-900" />
              ) : null}
            </div>
          ) : null}

          {status === "idle" && sentences.length === 0 && !error ? (
            <div className="rounded-xl border border-dashed border-zinc-200/80 bg-zinc-50/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                输入趋势名称并点击「开始分析」
              </p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: AnalysisStatus }) {
  if (status === "analyzing") {
    return (
      <span className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-900" />
        分析中
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="text-sm font-medium text-emerald-600">分析完成</span>
    );
  }

  if (status === "failed") {
    return <span className="text-sm font-medium text-red-600">分析失败</span>;
  }

  return null;
}
