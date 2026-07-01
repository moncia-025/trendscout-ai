import type { TrendStage } from "@/types/trend";

const stageStyles: Record<TrendStage, string> = {
  Emerging: "bg-sky-50 text-sky-700 ring-sky-600/12",
  Growing: "bg-emerald-50 text-emerald-700 ring-emerald-600/12",
  Peak: "bg-amber-50 text-amber-700 ring-amber-600/12",
  Declining: "bg-zinc-100 text-zinc-600 ring-zinc-500/12",
};

const stageLabels: Record<TrendStage, string> = {
  Emerging: "新兴",
  Growing: "增长中",
  Peak: "峰值",
  Declining: "衰退中",
};

interface TrendStageBadgeProps {
  stage: TrendStage;
  className?: string;
}

export function TrendStageBadge({ stage, className = "" }: TrendStageBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${stageStyles[stage]} ${className}`}
    >
      {stageLabels[stage]}
    </span>
  );
}
