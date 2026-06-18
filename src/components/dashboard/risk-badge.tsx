import type { RiskLevel } from "@/lib/mock-data";

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/12",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/12",
  High: "bg-red-50 text-red-700 ring-red-600/12",
};

const riskLabels: Record<RiskLevel, string> = {
  Low: "低",
  Medium: "中",
  High: "高",
};

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${riskStyles[level]} ${className}`}
    >
      {riskLabels[level]}
    </span>
  );
}
