import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function NicheRadar() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const trends = useQuery(
    api.creatorContent.listTrendingNiches,
    hasConvex ? { limit: 40, platform } : "skip"
  );

  const color = (d: string) =>
    d === "rising"
      ? "border-emerald-500/50 bg-emerald-500/10"
      : d === "falling"
        ? "border-rose-500/50 bg-rose-500/10"
        : "border-amber-500/50 bg-amber-500/10";

  return (
    <>
      <SEO
        title="Niche Trend Radar | ContentAnonymity"
        description="Live-style niche momentum scores by platform — validate before you invest months of production."
        canonical="https://contentanonymity.com/niche-radar"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Niche trend radar</h1>
        <p className="text-muted-foreground mb-6">
          Green = rising, yellow = stable, red = falling. Data blends seeded snapshots with platform
          activity (refresh weekly in production).
        </p>
        <div className="mb-6 max-w-xs">
          <Select
            value={platform ?? "all"}
            onValueChange={(v) => setPlatform(v === "all" ? undefined : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {(trends ?? []).map((t) => (
            <Card key={`${t._id}`} className={color(t.trendDirection)}>
              <CardHeader>
                <CardTitle className="text-lg">{t.nicheName}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.platform}</p>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>
                  <strong>Score</strong> {Math.round(t.trendScore)}
                </p>
                <p>
                  <strong>Direction</strong> {t.trendDirection}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {!trends?.length && hasConvex && (
          <p className="text-muted-foreground mt-8">
            No trend rows yet. Run{" "}
            <code className="text-xs bg-muted px-1 rounded">npx convex run seedGrowth:seedAll</code> once.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
