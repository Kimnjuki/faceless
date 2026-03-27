import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Showcase() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const rows = useQuery(api.creatorContent.listPublishedShowcases, hasConvex ? { limit: 24 } : "skip");

  return (
    <>
      <SEO
        title="Creator Showcase | ContentAnonymity"
        description="Anonymous success stories from faceless creators — niche, platform, and lessons learned."
        canonical="https://contentanonymity.com/showcase"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Creator showcase</h1>
        <p className="text-muted-foreground mb-8">
          Real patterns from anonymous creators. Handles are pseudonyms only.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {(rows ?? []).map((s) => (
            <Card key={s._id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{s.stealthHandle ?? "Anonymous"}</CardTitle>
                  <Badge variant="outline">{s.platform}</Badge>
                </div>
                {s.monthlyRevenue && (
                  <p className="text-sm text-primary font-semibold">{s.monthlyRevenue} / mo</p>
                )}
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-muted-foreground">
                {s.story && <p className="text-foreground">{s.story}</p>}
                {s.tipForBeginners && (
                  <p>
                    <strong className="text-foreground">Tip:</strong> {s.tipForBeginners}
                  </p>
                )}
                {s.toolsUsed && s.toolsUsed.length > 0 && (
                  <p className="text-xs">Tools: {s.toolsUsed.join(", ")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {!rows?.length && hasConvex && (
          <p className="text-muted-foreground">
            No showcases yet. Seed with{" "}
            <code className="text-xs bg-muted px-1 rounded">npx convex run seedGrowth:seedAll</code>
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
