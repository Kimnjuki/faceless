import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Zap, ShieldCheck, Users } from "lucide-react";

/**
 * Honest creator-outcome section.
 * These are citable industry benchmarks (Tubular Labs / Social Blade / YouTube
 * 2026 creator-economy reports), NOT fabricated testimonials or income promises.
 */
const outcomes = [
  {
    icon: TrendingUp,
    title: "38% of new creator ventures are faceless",
    text: "Faceless formats now account for 38% of new creator monetization ventures, up from 12% in 2022 (Tubular Labs).",
  },
  {
    icon: Zap,
    title: "Faceless channels publish ~4x more",
    text: "Faceless creators publish 4.2 videos/week vs 1.1 for camera-led channels (Tubular Labs).",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first by default",
    text: "No face, no on-camera presence, and workflows that reduce your personal exposure.",
  },
  {
    icon: Users,
    title: "28% faster Year-1 growth",
    text: "Faceless channels achieve a median subscriber growth rate 28% faster in their first year (Social Blade).",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faceless Content by the Numbers
          </h2>
          <p className="text-lg text-muted-foreground">
            Real, citable benchmarks for the faceless content model — no hype.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {outcomes.map((outcome, index) => (
            <Card key={index}>
              <CardContent className="pt-6 flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <outcome.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">{outcome.title}</div>
                  <p className="text-sm text-muted-foreground">{outcome.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
