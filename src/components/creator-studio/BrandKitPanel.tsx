import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function BrandKitPanel() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const generate = useAction(api.brandKitGenerate.generateBrandKit);
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    channelNames: string[];
    taglines: string[];
    colorPalette: Record<string, string>;
    toneDescriptor: string;
    logoDescription: string;
    styleGuide?: Record<string, unknown>;
    demoMode?: boolean;
  } | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConvex || !niche.trim()) {
      toast.error("Enter a niche and connect Convex (VITE_CONVEX_URL).");
      return;
    }
    setLoading(true);
    try {
      const out = await generate({
        niche: niche.trim(),
        platform,
        tone,
      });
      setResult(out);
      toast.success(out.demoMode ? "Demo brand kit (add ANTHROPIC_API_KEY for live AI)" : "Brand kit generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Faceless brand kit
        </CardTitle>
        <CardDescription>
          Channel names, taglines, palette, and style notes — optimized for anonymous creators.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={run} className="space-y-4">
          <div>
            <Label htmlFor="bk-niche">Niche</Label>
            <Input
              id="bk-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. personal finance explainers"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
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
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={loading || !hasConvex}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              "Generate brand kit"
            )}
          </Button>
        </form>

        {result && (
          <div className="space-y-4 rounded-lg border border-border p-4 bg-muted/30">
            <div>
              <h4 className="font-semibold text-sm mb-2">Channel names</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {result.channelNames.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Taglines</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {result.taglines.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.colorPalette).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-2 text-xs rounded-md border px-2 py-1"
                  >
                    <span
                      className="inline-block h-4 w-4 rounded border"
                      style={{ backgroundColor: v }}
                    />
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm">
              <span className="font-medium">Tone:</span> {result.toneDescriptor}
            </p>
            <p className="text-sm text-muted-foreground">{result.logoDescription}</p>
            {result.styleGuide && typeof result.styleGuide === "object" && (
              <pre className="text-xs overflow-x-auto bg-background p-3 rounded-md border">
                {JSON.stringify(result.styleGuide, null, 2)}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
