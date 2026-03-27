import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Leaderboard() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const trends = useQuery(api.creatorContent.listTrendingNiches, hasConvex ? { limit: 15 } : "skip");

  return (
    <>
      <SEO
        title="Niche Leaderboard | ContentAnonymity"
        description="Top niches by momentum score — anonymized community activity."
        canonical="https://contentanonymity.com/leaderboard"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Niche leaderboard</h1>
        <ol className="space-y-3">
          {(trends ?? []).map((t, i) => (
            <li key={t._id}>
              <Card>
                <CardHeader className="py-3 flex flex-row items-center gap-4">
                  <span className="text-2xl font-bold text-muted-foreground w-8">{i + 1}</span>
                  <div>
                    <CardTitle className="text-base">{t.nicheName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{t.platform}</p>
                  </div>
                  <div className="ml-auto text-sm font-semibold tabular-nums">
                    {Math.round(t.trendScore)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  {t.trendDirection}
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
