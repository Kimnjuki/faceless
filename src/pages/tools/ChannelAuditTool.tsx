import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChannelAuditTool() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const run = useMutation(api.creatorContent.runChannelAudit);
  const [url, setUrl] = useState("https://www.youtube.com/@example");
  const [platform, setPlatform] = useState("youtube");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Awaited<ReturnType<typeof run>> | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConvex) return;
    setLoading(true);
    try {
      const out = await run({ channelUrl: url, platform });
      setRes(out);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Faceless Channel Audit | ContentAnonymity"
        description="Heuristic channel health scores and action items for faceless creators."
        canonical="https://contentanonymity.com/tools/channel-audit"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Channel audit</h1>
        <p className="text-muted-foreground mb-6">
          Quick heuristic audit (demo). For deep analytics, connect official APIs in a future release.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 mb-8">
          <div>
            <Label htmlFor="url">Channel URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading || !hasConvex}>
            {loading ? "Auditing…" : "Run audit"}
          </Button>
        </form>
        {res && (
          <Card>
            <CardHeader>
              <CardTitle>Overall {Math.round(res.overallScore ?? 0)}/100</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Niche fit: {Math.round(res.nicheScore ?? 0)}</p>
              <p>Monetization readiness: {Math.round(res.monetizationReadiness ?? 0)}</p>
              <p>Content gap: {Math.round(res.contentGapScore ?? 0)}</p>
              <p>SEO score: {Math.round(res.seoScore ?? 0)}</p>
              <ul className="list-disc pl-5 mt-4">
                {res.recommendations?.map((r: string) => (
                  <li key={r}>{r}</li>
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
