import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TrendingNichesStrip() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const trends = useQuery(api.creatorContent.listTrendingNiches, hasConvex ? { limit: 6 } : "skip");

  if (!hasConvex || !trends?.length) return null;

  const color = (d: string) =>
    d === "rising" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" :
    d === "falling" ? "bg-rose-500/15 text-rose-700 dark:text-rose-400" :
    "bg-amber-500/15 text-amber-800 dark:text-amber-300";

  return (
    <section className="py-4 border-b bg-muted/30" aria-label="Trending niches">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0 text-sm font-semibold">
          <Flame className="h-4 w-4 text-orange-500" />
          Trending now
        </div>
        <div className="flex flex-wrap gap-2">
          {trends.map((t: Doc<"niche_trends">) => (
            <Link key={`${t.platform}-${t.nicheName}`} to="/niche-radar">
              <Badge variant="secondary" className={`gap-1.5 ${color(t.trendDirection)}`}>
                <span className="font-medium">{t.nicheName}</span>
                <span className="opacity-70">· {t.platform}</span>
                <span className="tabular-nums">{Math.round(t.trendScore)}</span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
