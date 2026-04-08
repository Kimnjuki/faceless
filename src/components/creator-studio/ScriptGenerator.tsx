import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Copy, Sparkles, PenTool, FileText, TrendingUp, DollarSign, Target, Zap } from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelTemplate {
  id: string;
  name: string;
  monetizationPath: string;
  platform: string;
  structure: {
    hook: string;
    problem: string;
    solution: string;
    cta: string;
    upsell: string;
  };
  ctaFormats: string[];
  performanceScore: number;
}

interface HookVariant {
  type: string;
  text: string;
  engagementScore: number;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const MONETIZATION_PATHS = [
  { value: "affiliate", label: "Affiliate Marketing", icon: "🔗", avgRpm: "$4-12" },
  { value: "digital_product", label: "Digital Product", icon: "📦", avgRpm: "$15-40" },
  { value: "adsense", label: "AdSense / CPM", icon: "📢", avgRpm: "$2-8" },
  { value: "ugc_brand_deal", label: "UGC Brand Deal", icon: "🤝", avgRpm: "$20-80" },
  { value: "saas", label: "SaaS / Software", icon: "💻", avgRpm: "$10-30" },
  { value: "course", label: "Course / Info Product", icon: "🎓", avgRpm: "$25-100" },
];

const PLATFORMS = [
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram Reels" },
  { value: "podcast", label: "Podcast" },
  { value: "newsletter", label: "Newsletter" },
  { value: "pinterest", label: "Pinterest" },
];

const FUNNEL_TEMPLATES: FunnelTemplate[] = [
  {
    id: "aff-review",
    name: "Affiliate Product Review",
    monetizationPath: "affiliate",
    platform: "youtube",
    structure: {
      hook: "I tried [PRODUCT] for 30 days — here's my honest take.",
      problem: "Most [AUDIENCE] struggle with [PROBLEM]. I know because I did too.",
      solution: "[PRODUCT] solved this by [MECHANISM]. Here's exactly how:",
      cta: "Link in description / bio — [DISCOUNT CODE] saves you [%] today only.",
      upsell: "If you want the full system, check out [RELATED PRODUCT] — same link.",
    },
    ctaFormats: ["link in description", "grab [discount] with code [CODE]", "limited-time offer below"],
    performanceScore: 87,
  },
  {
    id: "dp-launch",
    name: "Digital Product Launch",
    monetizationPath: "digital_product",
    platform: "youtube",
    structure: {
      hook: "I made $[AMOUNT] selling [PRODUCT TYPE] with zero followers. Here's the system.",
      problem: "Everyone says you need a big audience. That's a lie.",
      solution: "I built a [PRODUCT] that solves [SPECIFIC PAIN POINT] — and sold it before I even finished it.",
      cta: "DM me the word '[KEYWORD]' or grab it at [URL] before the price goes up.",
      upsell: "Want me to walk you through the exact process? I created a step-by-step guide — same link.",
    },
    ctaFormats: ["DM [keyword] for access", "grab it at [URL]", "price increases [date]"],
    performanceScore: 92,
  },
  {
    id: "adsense-edu",
    name: "Educational AdSense",
    monetizationPath: "adsense",
    platform: "youtube",
    structure: {
      hook: "Nobody teaches [TOPIC] this way. After this video, you'll understand it completely.",
      problem: "Most [TOPIC] explanations assume too much. They leave beginners lost.",
      solution: "Here's the simple framework I use: [FRAMEWORK]. Let me break it down step by step.",
      cta: "If this helped, subscribe — I post this kind of breakdown every [FREQUENCY].",
      upsell: "I made a complete guide on [RELATED TOPIC] — pinned comment.",
    },
    ctaFormats: ["subscribe for weekly breakdowns", "pinned comment has the full guide", "turn on notifications"],
    performanceScore: 78,
  },
  {
    id: "ugc-deal",
    name: "UGC Brand Deal Script",
    monetizationPath: "ugc_brand_deal",
    platform: "tiktok",
    structure: {
      hook: "POV: You discovered the [PRODUCT CATEGORY] that actually works.",
      problem: "I've tried [NUMBER] [PRODUCT CATEGORY] and most were a waste of money.",
      solution: "[BRAND] is different. [SPECIFIC FEATURE] means [SPECIFIC BENEFIT] — and I've been using it for [TIME].",
      cta: "Link in bio, [DISCOUNT]% off with my code [CODE].",
      upsell: "Follow for more honest reviews — I test so you don't have to.",
    },
    ctaFormats: ["link in bio", "code [CODE] at checkout", "follow for more reviews"],
    performanceScore: 83,
  },
  {
    id: "course-teaser",
    name: "Course Teaser / Soft Launch",
    monetizationPath: "course",
    platform: "youtube",
    structure: {
      hook: "I spent [TIME] learning [SKILL]. Here's what I wish I knew at the start.",
      problem: "Most resources on [SKILL] are outdated, overcomplicated, or just wrong.",
      solution: "These [NUMBER] principles changed everything for me: [PRINCIPLE 1], [PRINCIPLE 2], [PRINCIPLE 3].",
      cta: "I just opened enrollment for [COURSE NAME] — [NUMBER] spots left. Link below.",
      upsell: "Early bird pricing ends [DATE]. After that, price doubles.",
    },
    ctaFormats: ["enrollment open at [URL]", "[N] spots remaining", "early bird ends [date]"],
    performanceScore: 89,
  },
];

const HOOK_TYPES = [
  { type: "Question Hook", template: "Have you ever wondered [TOPIC] in a way nobody talks about?" },
  { type: "Shocking Stat", template: "[X]% of [AUDIENCE] never [ACTION] — here's what happens when you do." },
  { type: "Story Hook", template: "I was [SITUATION] when I discovered [INSIGHT] — it changed everything." },
  { type: "Contrarian Take", template: "Everyone says [COMMON BELIEF]. They're completely wrong. Here's why." },
  { type: "Dollar Hook", template: "I made [$AMOUNT] from [STRATEGY] in [TIMEFRAME] — with no experience." },
  { type: "Mystery Hook", template: "There's a [SECRET/METHOD] about [TOPIC] that [AUTHORITY] doesn't want you to know." },
  { type: "Pattern Interrupt", template: "Stop. Before you [COMMON ACTION], you need to see this." },
  { type: "Future Pacing", template: "What if you could [DESIRED OUTCOME] without [BIGGEST OBSTACLE]?" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScriptGenerator() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [monetizationPath, setMonetizationPath] = useState("affiliate");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null);
  const [hookVariants, setHookVariants] = useState<HookVariant[]>([]);
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");

  const selectedMonetization = MONETIZATION_PATHS.find((m) => m.value === monetizationPath);
  const relevantTemplates = FUNNEL_TEMPLATES.filter(
    (t) => t.monetizationPath === monetizationPath || t.platform === platform
  );

  const generateHookVariants = (): HookVariant[] => {
    return HOOK_TYPES.slice(0, 5).map((h) => ({
      type: h.type,
      text: h.template
        .replace("[TOPIC]", topic || "this")
        .replace("[AUDIENCE]", niche || "creators")
        .replace("[ACTION]", "optimize their content")
        .replace("[SITUATION]", `stuck with ${topic || "this topic"}`)
        .replace("[INSIGHT]", "a completely different approach")
        .replace("[COMMON BELIEF]", `you need experience with ${topic || "this"}`)
        .replace("[SECRET/METHOD]", "simple system")
        .replace("[AUTHORITY]", "the gurus")
        .replace("[$AMOUNT]", "$3,200")
        .replace("[STRATEGY]", topic || "this strategy")
        .replace("[TIMEFRAME]", "90 days")
        .replace("[DESIRED OUTCOME]", `master ${topic || "this"}`)
        .replace("[BIGGEST OBSTACLE]", "years of experience")
        .replace("[COMMON ACTION]", "give up"),
      engagementScore: Math.floor(70 + Math.random() * 25),
    }));
  };

  const buildScript = (template: FunnelTemplate | null): string => {
    const t = topic || "[TOPIC]";
    const n = niche || "[NICHE]";
    const monetLabel = selectedMonetization?.label ?? monetizationPath;

    if (template) {
      const { structure } = template;
      return `# ${t}
Platform: ${platform.toUpperCase()} | Monetization: ${monetLabel} | Tone: ${tone}

---

## 🪝 HOOK
${structure.hook.replace(/\[.*?\]/g, (m) => {
  const key = m.slice(1, -1).toLowerCase();
  if (key === "product" || key === "topic") return t;
  if (key === "audience") return n;
  return m;
})}

---

## ❗ PROBLEM / PAIN
${structure.problem.replace(/\[AUDIENCE\]/g, n).replace(/\[PROBLEM\]/g, `struggling with ${t}`)}

This is the part where you hold up the mirror. Make the viewer feel SEEN.
Speak to the exact moment they recognized they had this problem.

---

## ✅ SOLUTION / VALUE
${structure.solution.replace(/\[PRODUCT\]/g, t).replace(/\[MECHANISM\]/g, "a counterintuitive method")}

**Key teaching points:**
1. [Point 1 — explain the core insight]
2. [Point 2 — the method or framework]
3. [Point 3 — the proof or result]

---

## 📣 CALL TO ACTION
${structure.cta}

**CTA Format Options:**
${template.ctaFormats.map((f, i) => `${i + 1}. ${f}`).join("\n")}

---

## ⬆️ UPSELL / SOFT PITCH
${structure.upsell}

---

*Script generated for ${monetLabel} monetization path.*
*Performance benchmark: ${template.performanceScore}/100*`;
    }

    return `# ${t}
Platform: ${platform.toUpperCase()} | Monetization: ${monetLabel}

---

## 🪝 HOOK
${generateHookVariants()[0]?.text ?? `Have you ever wondered about ${t}?`}

---

## ❗ PROBLEM
Most ${n || "people"} struggle with ${t} because they're missing one key piece.
Here's what nobody talks about...

---

## ✅ SOLUTION
Here's the framework I use: [YOUR FRAMEWORK]

1. Step one — [Explain first action]
2. Step two — [Build on first]
3. Step three — [The breakthrough]

---

## 📣 CALL TO ACTION
If this gave you value, [subscribe / follow / comment below] — I post this every week.
${monetLabel === "Affiliate Marketing" ? "\nThe tool I use for this is linked below — it saves me [TIME/MONEY]." : ""}
${monetLabel === "Digital Product" ? "\nI have a full system for this — grab it at [URL]." : ""}
${monetLabel === "Course / Info Product" ? "\nI cover this in-depth in my course — enrollment link below." : ""}

---

*Estimated duration: ${length === "short" ? "60s" : length === "medium" ? "3-5 min" : "8-12 min"}*`;
  };

  const handleGenerateHooks = () => {
    if (!topic) { toast.error("Enter a topic first"); return; }
    setIsGenerating(true);
    setTimeout(() => {
      setHookVariants(generateHookVariants());
      setIsGenerating(false);
      setActiveTab("hooks");
      toast.success("5 hook variants generated!");
    }, 900);
  };

  const handleGenerateScript = async () => {
    if (!topic) { toast.error("Enter a topic first"); return; }
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      const script = buildScript(selectedTemplate);
      setGeneratedScript(script);
      setHookVariants(generateHookVariants());
      setActiveTab("output");
      toast.success("Funnel-mapped script generated!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedScript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `script-${topic.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Script Generator</CardTitle>
            <Badge variant="secondary">Funnel-Mapped</Badge>
          </div>
          <CardDescription>
            Generate scripts engineered around your monetization path — not just content, but conversion-optimized copy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="hooks">Hook Variants {hookVariants.length > 0 && `(${hookVariants.length})`}</TabsTrigger>
              <TabsTrigger value="templates">Funnel Templates</TabsTrigger>
              <TabsTrigger value="output" disabled={!generatedScript}>Output</TabsTrigger>
            </TabsList>

            {/* ── Compose ── */}
            <TabsContent value="compose" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Title *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., How to start a faceless YouTube channel"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niche">Target Niche</Label>
                  <Input
                    id="niche"
                    placeholder="e.g., Personal Finance, Tech, Health"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Script Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (30-90 sec)</SelectItem>
                      <SelectItem value="medium">Medium (3-6 min)</SelectItem>
                      <SelectItem value="long">Long (8-15 min)</SelectItem>
                      <SelectItem value="very-long">Deep Dive (20+ min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Monetization path selector */}
              <div className="space-y-2">
                <Label>Monetization Path *</Label>
                <p className="text-xs text-muted-foreground">
                  Each path generates a different CTA, upsell structure, and conversion copy.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {MONETIZATION_PATHS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMonetizationPath(m.value)}
                      className={`flex items-start gap-2 p-3 rounded-lg border text-left transition-colors ${
                        monetizationPath === m.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">RPM {m.avgRpm}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="energetic">Energetic</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleGenerateHooks} disabled={isGenerating || !topic} variant="outline">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenTool className="mr-2 h-4 w-4" />}
                  Generate 5 Hooks
                </Button>
                <Button onClick={handleGenerateScript} disabled={isGenerating || !topic}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Full Script
                </Button>
              </div>
            </TabsContent>

            {/* ── Hook Variants ── */}
            <TabsContent value="hooks" className="space-y-4">
              {hookVariants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <PenTool className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Enter a topic and click "Generate 5 Hooks" to see variants</p>
                </div>
              ) : (
                hookVariants.map((h, i) => (
                  <Card key={i} className="cursor-pointer hover:border-primary/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{h.type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Engagement score: {h.engagementScore}/100
                            </span>
                          </div>
                          <p className="text-sm">{h.text}</p>
                          <Progress value={h.engagementScore} className="mt-2 h-1" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(h.text);
                            toast.success("Hook copied!");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              {hookVariants.length > 0 && (
                <Button variant="outline" onClick={handleGenerateHooks} disabled={isGenerating}>
                  <Zap className="h-4 w-4 mr-2" />
                  Regenerate Hooks
                </Button>
              )}
            </TabsContent>

            {/* ── Funnel Templates ── */}
            <TabsContent value="templates" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a funnel template to pre-fill your script with conversion-optimized sections.
                {monetizationPath && ` Showing templates for: ${selectedMonetization?.label}`}
              </p>
              {relevantTemplates.map((t) => (
                <Card
                  key={t.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTemplate?.id === t.id ? "border-primary bg-primary/5" : "hover:border-primary/40"
                  }`}
                  onClick={() => {
                    setSelectedTemplate(t);
                    toast.success(`Template selected: ${t.name}`);
                  }}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{t.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">{t.monetizationPath.replace("_", " ")}</Badge>
                          <Badge variant="secondary" className="text-xs">{t.platform}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 italic">
                          Hook: "{t.structure.hook}"
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{t.performanceScore}/100</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {selectedTemplate && (
                <Button onClick={handleGenerateScript} disabled={isGenerating || !topic}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate with "{selectedTemplate.name}"
                </Button>
              )}
            </TabsContent>

            {/* ── Output ── */}
            <TabsContent value="output" className="space-y-4">
              {generatedScript ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {selectedMonetization?.label}
                      </Badge>
                      <Badge variant="outline">
                        <Target className="h-3 w-3 mr-1" />
                        {platform}
                      </Badge>
                      {selectedTemplate && (
                        <Badge variant="outline">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Score: {selectedTemplate.performanceScore}/100
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-2" />Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={generatedScript}
                    onChange={(e) => setGeneratedScript(e.target.value)}
                    className="min-h-[500px] font-mono text-sm"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">~{generatedScript.split(" ").length} words</Badge>
                    <Badge variant="secondary">
                      ~{Math.round(generatedScript.split(" ").length / 130)} min read
                    </Badge>
                    <Badge variant="secondary">Export: MD / TXT / PDF</Badge>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Generate a script first</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
