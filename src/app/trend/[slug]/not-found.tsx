import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function TrendNotFound() {
  return (
    <div className="min-h-full bg-[#fafafa]">
      <DashboardHeader />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:px-8">
        <p className="text-xs font-medium text-zinc-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
          未找到该趋势
        </h1>
        <p className="mt-2 max-w-md text-sm text-zinc-500">
          您访问的趋势不存在，或已被移除。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          返回首页
        </Link>
      </main>
    </div>
  );
}
