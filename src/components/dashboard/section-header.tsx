interface SectionHeaderProps {
  title: string;
  description: string;
  badge?: string;
  meta?: string;
}

export function SectionHeader({
  title,
  description,
  badge,
  meta,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-zinc-200/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
            {title}
          </h2>
          {badge ? (
            <span className="inline-flex items-center rounded-md bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      {meta ? (
        <p className="text-xs tabular-nums text-zinc-400">{meta}</p>
      ) : null}
    </div>
  );
}
