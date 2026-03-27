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
import { toast } from "sonner";

export default function NicheSaturationTool() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const compute = useMutation(api.creatorContent.getOrComputeSaturation);
  const [nicheName, setNicheName] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<Awaited<ReturnType<typeof compute>> | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicheName.trim() || !hasConvex) return;
    setLoading(true);
    try {
      const r = await compute({ nicheName: nicheName.trim(), platform });
      setRow(r);
    } catch {
      toast.error("Could not compute saturation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Niche Saturation Scorer | ContentAnonymity"
        description="Instant saturation and opportunity scores for faceless niches."
        canonical="https://contentanonymity.com/tools/niche-saturation"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Niche saturation scorer</h1>
        <form onSubmit={onSubmit} className="space-y-4 mb-8">
          <div>
            <Label htmlFor="niche">Niche name</Label>
            <Input
              id="niche"
              value={nicheName}
              onChange={(e) => setNicheName(e.target.value)}
              placeholder="e.g. AI news recap"
              required
            />
          </div>
          <div>
            <Label>Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading || !hasConvex}>
            {loading ? "Scoring…" : "Get score"}
          </Button>
        </form>
        {row && (
          <Card>
            <CardHeader>
              <CardTitle>Results for {row.nicheName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Saturation</strong> {Math.round(row.saturationScore)}/100
              </p>
              <p>
                <strong>Opportunity</strong> {Math.round(row.opportunityScore ?? 0)}/100
              </p>
              <p>
                <strong>Break-in strategy</strong> {row.breakInStrategy}
              </p>
              <ul className="list-disc pl-5">
                {row.underservedSubNiches?.map((s: string) => (
                  <li key={s}>{s}</li>
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
