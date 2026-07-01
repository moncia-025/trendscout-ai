import {
  normalizeRecommendation,
  type Recommendation,
} from "@/types/trend";

interface RecommendationListProps {
  title?: string;
  items: Recommendation[];
}

export function RecommendationList({
  title = "推荐 SKU / 行动建议",
  items,
}: RecommendationListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={`${normalizeRecommendation(item)}-${index}`}
            className="flex items-start gap-2.5 text-sm text-zinc-700"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
            {normalizeRecommendation(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}
