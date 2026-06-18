import { forecastData } from "@/data/forecast-data";
import { topTrends } from "@/lib/mock-data";
import { ForecastCard } from "@/components/forecast/forecast-card";

export function ForecastGrid() {
  const items = forecastData
    .map((forecast) => {
      const trend = topTrends.find((item) => item.slug === forecast.trendId);
      if (!trend) return null;
      return { forecast, trend };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {items.map(({ trend, forecast }) => (
        <ForecastCard key={forecast.trendId} trend={trend} forecast={forecast} />
      ))}
    </div>
  );
}
