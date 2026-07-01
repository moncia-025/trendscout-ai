interface InsightCardProps {
  title?: string;
  insight: string;
  intent?: string;
}

export function InsightCard({
  title = "AI 洞察",
  insight,
  intent,
}: InsightCardProps) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        {intent ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
            {intent}
          </span>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed text-zinc-700">{insight}</p>
    </section>
  );
}
