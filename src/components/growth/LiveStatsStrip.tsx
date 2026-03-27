import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TrendingUp, Users, Layers, DollarSign } from "lucide-react";

export default function LiveStatsStrip() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const stats = useQuery(api.creatorContent.getPublicGrowthStats, hasConvex ? {} : "skip");

  if (!hasConvex || !stats) {
    return (
      <section className="border-y bg-muted/40 py-6">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          Loading community stats…
        </div>
      </section>
    );
  }

  const items = [
    { icon: Users, label: "Creators joined (7d)", value: String(stats.creatorsJoinedThisWeek) },
    { icon: Layers, label: "Niches tracked", value: String(stats.nichesTracked) },
    { icon: DollarSign, label: "Avg. reported monthly income", value: stats.avgMonthlyIncomeDisplay },
    { icon: TrendingUp, label: "Published showcases", value: String(stats.showcaseCount) },
  ];

  return (
    <section className="border-y bg-gradient-to-r from-primary/5 via-background to-primary/5 py-6" aria-label="Platform activity">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <Icon className="h-5 w-5 mx-auto mb-2 text-primary" aria-hidden />
              <div className="text-2xl font-bold tabular-nums">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
