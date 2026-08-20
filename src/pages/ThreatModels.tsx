import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, ListChecks, AlertTriangle } from "lucide-react";

const PROFILE_LABELS: Record<string, string> = {
  faceless_youtuber: "Faceless YouTuber",
  anonymous_blogger: "Anonymous Blogger",
  tiktok_creator: "TikTok Creator",
  newsletter_operator: "Newsletter Operator",
  ai_persona_creator: "AI Persona Creator",
};

export default function ThreatModels() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const models = useQuery(api.threatModels.list, hasConvex ? {} : "skip");

  return (
    <>
      <SEO
        title="Privacy Threat Models for Anonymous Creators"
        description="Practical threat models per creator profile — main risks, recommended controls, and an explicit note that anonymity is not absolute. Build a faceless content business without leaking your identity."
        url="https://contentanonymity.com/privacy/threat-models"
        canonical="https://contentanonymity.com/privacy/threat-models"
        type="website"
        breadcrumbItems={[
          { name: "Privacy", url: "https://contentanonymity.com/privacy/threat-models" },
        ]}
      />
      <Header />
      <main className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <ShieldAlert className="h-4 w-4" /> Privacy & Security
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Threat Models for Anonymous Creators
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A threat model is a structured look at what could link your faceless
              presence back to you, and the controls that reduce that risk. Pick the
              profile closest to yours.
            </p>
          </div>

          {models === undefined && (
            <div className="text-center text-muted-foreground py-12">Loading threat models…</div>
          )}
          {models === null && (
            <div className="text-center text-muted-foreground py-12">
              Threat models are unavailable. Convex backend may not be configured.
            </div>
          )}
          {models && models.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No threat models yet. Run the seed (convex/seedThreatModels.ts → seed).
            </div>
          )}

          <div className="space-y-6">
            {models?.map((m) => (
              <Card key={m._id} className="border-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                      {PROFILE_LABELS[m.creatorProfile] ?? m.creatorProfile}
                    </CardTitle>
                    <Badge variant="outline">privacy-first</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <h3 className="flex items-center gap-2 font-semibold mb-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" /> Main risks
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {m.mainRisks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="flex items-center gap-2 font-semibold mb-2 text-primary">
                      <ListChecks className="h-4 w-4" /> Recommended controls
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {m.recommendedControls.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </section>
                  <section className="rounded-lg bg-muted/50 p-4 border border-border">
                    <h3 className="font-semibold mb-1 text-sm">Important limitation</h3>
                    <p className="text-sm text-muted-foreground">{m.legalCaveat}</p>
                  </section>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
