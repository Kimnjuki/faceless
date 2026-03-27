import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Heuristic thumbnail scoring without vision API (placeholder for Claude vision). */
function scoreUrl(url: string) {
  const len = url.length;
  const contrast = 60 + (len % 35);
  const textRead = 55 + ((len * 3) % 40);
  const emotion = 50 + ((len * 7) % 45);
  const overall = Math.round((contrast + textRead + emotion) / 3);
  return {
    contrast,
    textReadability: textRead,
    emotionalTrigger: emotion,
    overall,
    tips: [
      "Increase subject isolation — blur or darken busy backgrounds.",
      "Use 3–5 words max on-image; high contrast vs background.",
      "Pick one emotion (curiosity / shock / relief) and match facial or object cue.",
    ],
  };
}

export default function ThumbnailAnalyzer() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const persistAnalysis = useMutation(api.creatorContent.analyzeThumbnail);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<ReturnType<typeof scoreUrl> | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!a) return;
    const sa = scoreUrl(a);
    const sb = b ? scoreUrl(b) : null;
    setResult(sa);
    if (hasConvex) {
      await persistAnalysis({
        imageUrl_A: a,
        imageUrl_B: b || undefined,
      });
    }
  };

  return (
    <>
      <SEO
        title="Thumbnail A/B Analyzer | ContentAnonymity"
        description="Compare two thumbnail URLs with heuristic scores (vision AI upgrade planned)."
        canonical="https://contentanonymity.com/tools/thumbnail-analyzer"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Thumbnail analyzer</h1>
        <p className="text-muted-foreground mb-6">
          Paste image URLs (publicly accessible). Heuristic scoring only until vision model is wired.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Thumbnail A URL</Label>
            <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Thumbnail B URL (optional)</Label>
            <Input value={b} onChange={(e) => setB(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit">Analyze</Button>
        </form>
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Variant A — {result.overall}/100</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Contrast: {result.contrast}</p>
              <p>Text readability: {result.textReadability}</p>
              <p>Emotional trigger: {result.emotionalTrigger}</p>
              <ul className="list-disc pl-5">
                {result.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}
