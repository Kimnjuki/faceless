import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film, Loader2, Download, Sparkles, ChevronRight, Image, Mic } from "lucide-react";
import { toast } from "sonner";

interface Scene {
  order: number;
  timeStart: number;
  timeEnd: number;
  type: "hook" | "problem" | "solution" | "cta" | "broll" | "outro";
  narration: string;
  visual: string;
  broll: string[];
  stockQuery: string;
  textOverlay?: string;
}

const SCENE_TYPE_CONFIG = {
  hook: { emoji: "🪝", label: "Hook", color: "bg-yellow-100 text-yellow-800" },
  problem: { emoji: "❗", label: "Problem", color: "bg-red-100 text-red-800" },
  solution: { emoji: "✅", label: "Solution", color: "bg-green-100 text-green-800" },
  broll: { emoji: "🎥", label: "B-Roll", color: "bg-blue-100 text-blue-800" },
  cta: { emoji: "📣", label: "CTA", color: "bg-purple-100 text-purple-800" },
  outro: { emoji: "👋", label: "Outro", color: "bg-gray-100 text-gray-800" },
};

const generateStoryboard = (scriptTitle: string, platform: string, niche: string): Scene[] => {
  const durations =
    platform === "YouTube"
      ? [15, 30, 90, 60, 30, 15]
      : [5, 10, 20, 10, 5, 5];
  const types: Scene["type"][] = ["hook", "problem", "solution", "broll", "cta", "outro"];
  let currentTime = 0;

  return types.map((type, i) => {
    const duration = durations[i];
    const scene: Scene = {
      order: i + 1,
      timeStart: currentTime,
      timeEnd: currentTime + duration,
      type,
      narration: getNarration(type, scriptTitle, niche),
      visual: getVisualDesc(type, niche),
      broll: getBroll(type, niche),
      stockQuery: getStockQuery(type, niche),
      textOverlay: getOverlay(type, scriptTitle),
    };
    currentTime += duration;
    return scene;
  });
};

const getNarration = (type: Scene["type"], title: string, niche: string): string => ({
  hook: `"Have you ever wondered how ${niche} creators make money without showing their face? In the next few minutes, I'll show you exactly how."`,
  problem: `"Most ${niche} beginners make the same mistakes — they overthink the setup, spend weeks on branding, and never publish a single video."`,
  solution: `"Here's the system that actually works. You need three things: the right niche, a simple workflow, and consistency. Let me break each one down."`,
  broll: `"[Transition B-roll — show relevant ${niche} visuals, software demos, or aesthetic footage]"`,
  cta: `"If this helped, drop a comment below — tell me your biggest ${niche} question. And grab the free template I mentioned — link in the description."`,
  outro: `"Thanks for watching. See you in the next one — subscribe so you don't miss it."`,
}[type] ?? "");

const getVisualDesc = (type: Scene["type"], niche: string): string => ({
  hook: `Split screen: anonymous silhouette on left, revenue dashboard on right. Fade in title card: "${niche} Income — No Face Required"`,
  problem: `Screen recording of a failed channel dashboard with 0 views. Cut to person staring at blank document. Frustrated montage.`,
  solution: `Step-by-step screen recording with cursor. Annotated checklist appearing on screen. Clean whiteboard-style animation.`,
  broll: `Cinematic shots: laptop in coffee shop, smartphone with analytics, abstract neon visuals. Upbeat background music.`,
  cta: `Text overlay with link. Creator avatar (avatar/logo only — no face). Subscription animation graphic.`,
  outro: `Fade to brand logo. End screen with next video recommendation. Outro music fade.`,
}[type] ?? "");

const getBroll = (type: Scene["type"], niche: string): string[] => ({
  hook: [`${niche} dashboard screenshot`, "Anonymous creator working", "Money transfer animation"],
  problem: ["Empty analytics graph", "Person confused at desk", "Time-lapse of waiting"],
  solution: ["Screen recording of workflow", "Step-by-step checklist", "Software tutorial footage"],
  broll: [`${niche} lifestyle footage`, "Abstract technology background", "Trending content examples"],
  cta: ["Subscribe button animation", "Comment section highlight", "Link highlight with arrow"],
  outro: ["Brand logo animation", "End screen template", "Subscribe end card"],
}[type] ?? []);

const getStockQuery = (type: Scene["type"], niche: string): string => ({
  hook: `faceless creator ${niche} anonymous income`,
  problem: `frustrated person computer fail no views`,
  solution: `productivity workflow success step by step`,
  broll: `${niche} lifestyle aesthetic minimal`,
  cta: `subscribe notification bell social media`,
  outro: `fade out logo end screen minimal`,
}[type] ?? niche);

const getOverlay = (type: Scene["type"], title: string): string | undefined => ({
  hook: title,
  problem: "Sound familiar?",
  solution: "The 3-Step System",
  cta: "Link in Description ↓",
  outro: undefined,
  broll: undefined,
}[type]);

export default function StoryboardGenerator() {
  const [scriptTitle, setScriptTitle] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!scriptTitle) { toast.error("Enter a script title"); return; }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));
    const generated = generateStoryboard(scriptTitle, platform, niche || "faceless content");
    setScenes(generated);
    setSelectedScene(0);
    setIsGenerating(false);
    toast.success("Storyboard generated!");
  };

  const totalDuration = scenes.reduce((sum, s) => sum + (s.timeEnd - s.timeStart), 0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleExport = () => {
    const content = scenes
      .map(
        (s) => `SCENE ${s.order} — ${SCENE_TYPE_CONFIG[s.type].label} [${formatTime(s.timeStart)} - ${formatTime(s.timeEnd)}]
NARRATION: ${s.narration}
VISUAL: ${s.visual}
B-ROLL: ${s.broll.join(" | ")}
STOCK SEARCH: ${s.stockQuery}
${s.textOverlay ? `TEXT OVERLAY: ${s.textOverlay}` : ""}
${"─".repeat(60)}`
      )
      .join("\n\n");

    const blob = new Blob([`STORYBOARD: ${scriptTitle}\nPlatform: ${platform}\nDuration: ${formatTime(totalDuration)}\n${"═".repeat(60)}\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storyboard-${scriptTitle.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Storyboard exported!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <CardTitle>AI Storyboard Generator</CardTitle>
            <Badge variant="secondary">Script-to-Visual</Badge>
          </div>
          <CardDescription>
            Convert your script into a timestamped visual storyboard with B-roll suggestions, stock footage queries, and text overlay guides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Script / Video Title *</Label>
              <Input
                placeholder="e.g., How to Make $3K/Month with Faceless Finance Videos"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["YouTube", "TikTok", "Instagram", "Podcast"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Niche (for relevant B-roll)</Label>
            <Input placeholder="e.g., Personal Finance, Tech & AI" value={niche} onChange={(e) => setNiche(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={isGenerating || !scriptTitle}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Storyboard
            </Button>
            {scenes.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export TXT
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {scenes.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Scene List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scenes ({scenes.length}) — {formatTime(totalDuration)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2">
              {scenes.map((scene, i) => {
                const cfg = SCENE_TYPE_CONFIG[scene.type];
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedScene(i)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${selectedScene === i ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50"}`}
                  >
                    <span className="text-base">{cfg.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{cfg.label}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(scene.timeStart)} – {formatTime(scene.timeEnd)}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Scene Detail */}
          {selectedScene !== null && scenes[selectedScene] && (
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{SCENE_TYPE_CONFIG[scenes[selectedScene].type].emoji}</span>
                  <CardTitle className="text-base">
                    Scene {scenes[selectedScene].order} — {SCENE_TYPE_CONFIG[scenes[selectedScene].type].label}
                  </CardTitle>
                  <Badge className={SCENE_TYPE_CONFIG[scenes[selectedScene].type].color}>
                    {formatTime(scenes[selectedScene].timeStart)} – {formatTime(scenes[selectedScene].timeEnd)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase">
                    <Mic className="h-3 w-3" /> Narration
                  </div>
                  <p className="text-sm italic bg-muted/40 p-3 rounded-lg">{scenes[selectedScene].narration}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase">
                    <Image className="h-3 w-3" /> Visual Direction
                  </div>
                  <p className="text-sm bg-muted/40 p-3 rounded-lg">{scenes[selectedScene].visual}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase">B-Roll Suggestions</div>
                  <div className="flex flex-wrap gap-2">
                    {scenes[selectedScene].broll.map((b, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{b}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Stock Search</div>
                    <p className="text-sm bg-muted/40 p-2 rounded font-mono text-xs">{scenes[selectedScene].stockQuery}</p>
                  </div>
                  {scenes[selectedScene].textOverlay && (
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Text Overlay</div>
                      <p className="text-sm bg-primary/10 p-2 rounded text-primary font-medium">{scenes[selectedScene].textOverlay}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
