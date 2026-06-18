export function ForecastHeader() {
  return (
    <div className="border-b border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
        <p className="text-xs font-medium tracking-wide text-zinc-400">
          TrendScout AI · 趋势预测
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          趋势预测中心
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
          基于趋势生命周期与市场热度预测未来 90 天走势
        </p>
      </div>
    </div>
  );
}
