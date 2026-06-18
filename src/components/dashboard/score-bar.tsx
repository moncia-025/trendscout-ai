interface ScoreBarProps {
  score: number;
  className?: string;
}

export function ScoreBar({ score, className = "" }: ScoreBarProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-7 text-right text-sm font-semibold tabular-nums text-zinc-900">
        {score}
      </span>
    </div>
  );
}
