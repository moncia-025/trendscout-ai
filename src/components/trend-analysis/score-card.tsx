interface ScoreCardProps {
  label: string;
  value: number | string;
  accent?: "default" | "success" | "warning";
}

const ACCENT_STYLES = {
  default: "text-zinc-900",
  success: "text-emerald-600",
  warning: "text-amber-600",
} as const;

export function ScoreCard({ label, value, accent = "default" }: ScoreCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200/60 bg-white px-4 py-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${ACCENT_STYLES[accent]}`}
      >
        {value}
      </p>
    </div>
  );
}
