import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Zap, TrendingUp, Trophy, Plus, BarChart3, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Variant {
  id: string;
  label: string;
  content: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  isWinner?: boolean;
}

interface Experiment {
  id: string;
  name: string;
  contentType: string;
  platform: string;
  status: "running" | "completed" | "paused";
  variants: Variant[];
  confidence: number;
  createdAt: number;
}

const generateHookVariants = (topic: string): string[] => [
  `Have you ever wondered why ${topic || "this"} is so misunderstood?`,
  `90% of people get ${topic || "this"} completely wrong — here's the truth.`,
  `I spent 30 days testing ${topic || "this"} — the results shocked me.`,
  `Everyone says [X] about ${topic || "this"}. They're all wrong.`,
  `The ${topic || "topic"} secret nobody talks about...`,
];

const DEMO_EXPERIMENTS: Experiment[] = [
  {
    id: "1",
    name: "Finance Hook A/B Test",
    contentType: "hook",
    platform: "YouTube",
    status: "running",
    variants: [
      { id: "a", label: "A", content: "I went from $0 to $5K/month in 90 days — here's the system.", impressions: 4200, clicks: 378, conversions: 42, ctr: 9.0 },
      { id: "b", label: "B", content: "90% of finance creators fail. Here's what the top 10% do differently.", impressions: 4180, clicks: 460, conversions: 58, ctr: 11.0, isWinner: true },
      { id: "c", label: "C", content: "The faceless finance method that's printing $3K/mo while you sleep.", impressions: 4150, clicks: 291, conversions: 28, ctr: 7.0 },
    ],
    confidence: 87,
    createdAt: Date.now() - 5 * 86400000,
  },
];

export default function ABTestManager() {
  const [experiments, setExperiments] = useState<Experiment[]>(DEMO_EXPERIMENTS);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [contentType, setContentType] = useState("hook");
  const [platform, setPlatform] = useState("YouTube");
  const [topic, setTopic] = useState("");
  const [variants, setVariants] = useState(["", "", ""]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVariants = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const generated = generateHookVariants(topic).slice(0, 3);
    setVariants(generated);
    setIsGenerating(false);
    toast.success("3 variants generated!");
  };

  const handleCreate = () => {
    if (!newName) { toast.error("Enter experiment name"); return; }
    const filled = variants.filter(Boolean);
    if (filled.length < 2) { toast.error("Add at least 2 variants"); return; }

    const newExp: Experiment = {
      id: Date.now().toString(),
      name: newName,
      contentType,
      platform,
      status: "running",
      variants: filled.map((content, i) => ({
        id: String.fromCharCode(97 + i),
        label: String.fromCharCode(65 + i),
        content,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
      })),
      confidence: 0,
      createdAt: Date.now(),
    };
    setExperiments((prev) => [newExp, ...prev]);
    setIsCreating(false);
    setNewName("");
    setVariants(["", "", ""]);
    toast.success("A/B test started!");
  };

  const getWinner = (exp: Experiment) => exp.variants.find((v) => v.isWinner) ?? exp.variants.sort((a, b) => b.ctr - a.ctr)[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>A/B Test Manager</CardTitle>
                <CardDescription className="mt-1">
                  Test hooks, titles, thumbnails, and CTAs. Track which variants statistically outperform on CTR and conversions.
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsCreating(!isCreating)}>
              <Plus className="h-4 w-4 mr-2" />
              New Test
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create Experiment Form */}
      {isCreating && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">New A/B Experiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Experiment Name</Label>
                <Input placeholder="e.g., Finance Hook Test" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hook">Hook</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="thumbnail">Thumbnail Concept</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
                    <SelectItem value="description">Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["YouTube", "TikTok", "Instagram", "Pinterest"].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label>Topic (for AI generation)</Label>
                <Input placeholder="e.g., passive income for beginners" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <Button variant="outline" onClick={handleGenerateVariants} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Generate Variants
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Variants (A/B/C)</Label>
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Textarea
                    value={v}
                    onChange={(e) => setVariants((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder={`Variant ${String.fromCharCode(65 + i)} content...`}
                    className="min-h-0 h-16 resize-none text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Zap className="h-4 w-4 mr-2" />
                Start A/B Test
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiment Cards */}
      {experiments.map((exp) => {
        const winner = getWinner(exp);
        const maxCtr = Math.max(...exp.variants.map((v) => v.ctr));
        return (
          <Card key={exp.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base">{exp.name}</CardTitle>
                    <Badge
                      className={
                        exp.status === "running"
                          ? "bg-green-100 text-green-800"
                          : exp.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {exp.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{exp.contentType}</Badge>
                    <Badge variant="outline">{exp.platform}</Badge>
                    {exp.confidence > 0 && (
                      <span className="text-green-600 font-medium">{exp.confidence}% confidence</span>
                    )}
                  </div>
                </div>
                {exp.status === "running" && exp.confidence >= 95 && (
                  <Button size="sm" variant="outline">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                    Declare Winner
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {exp.variants.map((variant) => (
                <div key={variant.id} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {variant.label}
                      </span>
                      {variant.isWinner && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Winner
                        </Badge>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${variant.ctr >= maxCtr ? "text-green-600" : "text-muted-foreground"}`}>
                      {variant.ctr.toFixed(1)}% CTR
                    </span>
                  </div>
                  <p className="text-sm mb-2 italic text-muted-foreground line-clamp-2">&ldquo;{variant.content}&rdquo;</p>
                  <Progress value={(variant.ctr / Math.max(maxCtr, 1)) * 100} className="h-1.5 mb-1" />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{variant.impressions.toLocaleString()} views</span>
                    <span>{variant.clicks.toLocaleString()} clicks</span>
                    <span>{variant.conversions} conv.</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {experiments.length === 0 && !isCreating && (
        <div className="text-center py-12 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No experiments yet. Create your first A/B test above.</p>
        </div>
      )}
    </div>
  );
}
