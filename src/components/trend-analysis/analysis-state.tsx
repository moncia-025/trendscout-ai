import type { RequestStatus } from "@/types/trend";

interface AnalysisStateProps {
  status: RequestStatus;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingLabel?: string;
}

export function AnalysisState({
  status,
  error,
  emptyTitle = "输入趋势关键词开始分析",
  emptyDescription = "数据由 Dify Multi-Agent Workflow 实时生成",
  loadingLabel = "正在调用 Dify Workflow 分析趋势...",
}: AnalysisStateProps) {
  if (status === "loading") {
    return (
      <div className="rounded-xl border border-zinc-200/80 bg-white p-8">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/3 rounded bg-zinc-200" />
          <div className="h-4 w-full rounded bg-zinc-200" />
          <div className="h-4 w-5/6 rounded bg-zinc-200" />
        </div>
        <p className="mt-4 text-sm text-zinc-500">{loadingLabel}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-6">
        <p className="text-sm font-medium text-red-800">分析失败</p>
        <p className="mt-2 text-sm text-red-600">{error ?? "请稍后重试"}</p>
        {error?.includes("Dify") ? (
          <p className="mt-3 text-xs text-red-500/90">
            提示：Dify 未启动时页面仍可正常浏览，启动 Dify 并配置 .env.local 后再点击分析。
          </p>
        ) : null}
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200/80 bg-zinc-50/40 p-8 text-center">
        <p className="text-sm font-medium text-zinc-700">
          {emptyTitle}
        </p>
        <p className="mt-2 text-sm text-zinc-500">{emptyDescription}</p>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200/80 bg-zinc-50/40 p-8 text-center">
        <p className="text-sm font-medium text-zinc-700">{emptyTitle}</p>
        <p className="mt-2 text-sm text-zinc-500">{emptyDescription}</p>
      </div>
    );
  }

  return null;
}
