import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Sparkles, Clock, DollarSign, Youtube, TrendingUp, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CalendarItem {
  date: string;
  platform: string;
  title: string;
  hook: string;
  contentType: "short" | "long" | "reel" | "post" | "newsletter";
  monetizationPath: string;
  estimatedViews: number;
  estimatedRevenue: number;
  status: "planned" | "scripted" | "produced" | "published" | "skipped";
}

const PLATFORM_ICONS: Record<string, string> = {
  YouTube: "📺",
  TikTok: "🎵",
  Instagram: "📸",
  Pinterest: "📌",
  Newsletter: "📧",
};

const MONETIZATION_LABELS: Record<string, string> = {
  affiliate: "Affiliate",
  adsense: "AdSense",
  digital_product: "Product",
  ugc_brand_deal: "Brand Deal",
  course: "Course",
};

const STATUS_CONFIG = {
  planned: { label: "Planned", color: "bg-gray-100 text-gray-700" },
  scripted: { label: "Scripted", color: "bg-blue-100 text-blue-700" },
  produced: { label: "Produced", color: "bg-purple-100 text-purple-700" },
  published: { label: "Published", color: "bg-green-100 text-green-700" },
  skipped: { label: "Skipped", color: "bg-red-100 text-red-700" },
};

// Calendar generation logic
const generateCalendarItems = (
  niche: string,
  platforms: string[],
  duration: number,
  monetizationMix: string[]
): CalendarItem[] => {
  const hooks = [
    "I tried [X] for 30 days — here's the brutal truth",
    "Nobody talks about this [NICHE] secret",
    "From $0 to $[X]/month in [NICHE] — step by step",
    "The [NICHE] mistake that's costing you money",
    "Why most [NICHE] creators fail (and how to avoid it)",
    "I analyzed [X] top [NICHE] channels — here's what works",
    "Stop doing [WRONG WAY]. Do this instead",
    "The [TIMEFRAME] [NICHE] challenge — week by week results",
  ];

  const titles = [
    `How to Start a Faceless ${niche} Channel in 2026`,
    `The Best ${niche} Content Ideas for Faceless Creators`,
    `${niche} Niches That Pay the Most (RPM Breakdown)`,
    `${niche} AI Tools Every Faceless Creator Needs`,
    `How I Made Money with Faceless ${niche} Content`,
    `${niche} Script Template (Free Download)`,
    `${niche} vs [Competing Niche]: Which Pays More?`,
    `Growing a Faceless ${niche} Channel from Zero`,
  ];

  const items: CalendarItem[] = [];
  const now = new Date();

  for (let day = 0; day < duration; day += 2 + Math.floor(Math.random() * 2)) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);

    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const monetization = monetizationMix[Math.floor(Math.random() * monetizationMix.length)] || "adsense";
    const contentType: CalendarItem["contentType"] = platform === "TikTok" || platform === "Instagram" ? "reel" : platform === "Newsletter" ? "newsletter" : day % 6 === 0 ? "long" : "short";

    items.push({
      date: date.toISOString().split("T")[0],
      platform,
      title: titles[items.length % titles.length].replace("[NICHE]", niche),
      hook: hooks[items.length % hooks.length].replace("[NICHE]", niche.toLowerCase()),
      contentType,
      monetizationPath: monetization,
      estimatedViews: Math.floor(500 + Math.random() * 15000),
      estimatedRevenue: parseFloat((2 + Math.random() * 80).toFixed(2)),
      status: "planned",
    });
  }

  return items;
};

export default function ContentCalendarAI() {
  const [niche, setNiche] = useState("");
  const [duration, setDuration] = useState("30");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["YouTube"]);
  const [monetizationMix, setMonetizationMix] = useState<string[]>(["affiliate", "adsense"]);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const togglePlatform = (p: string) =>
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const toggleMonetization = (m: string) =>
    setMonetizationMix((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const handleGenerate = async () => {
    if (!niche) { toast.error("Enter your niche"); return; }
    if (selectedPlatforms.length === 0) { toast.error("Select at least one platform"); return; }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    const items = generateCalendarItems(niche, selectedPlatforms, parseInt(duration), monetizationMix);
    setCalendarItems(items);
    setIsGenerating(false);
    toast.success(`${items.length}-post calendar generated!`);
  };

  const handleStatusChange = (index: number, status: CalendarItem["status"]) => {
    setCalendarItems((prev) => prev.map((item, i) => (i === index ? { ...item, status } : item)));
  };

  const totalRevenue = calendarItems.reduce((sum, i) => sum + i.estimatedRevenue, 0);
  const totalViews = calendarItems.reduce((sum, i) => sum + i.estimatedViews, 0);
  const filtered = filter === "all" ? calendarItems : calendarItems.filter((i) => i.platform === filter);

  return (
    <div className="space-y-6">
      {/* Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>AI Content Calendar Generator</CardTitle>
            <Badge variant="secondary">30/60/90 Day Planning</Badge>
          </div>
          <CardDescription>
            Generate a full content calendar with titles, hooks, platform scheduling, and revenue estimates — tailored to your niche and monetization strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Niche *</Label>
              <Input placeholder="e.g., Personal Finance, Tech & AI, Health" value={niche} onChange={(e) => setNiche(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {["YouTube", "TikTok", "Instagram", "Pinterest", "Newsletter"].map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedPlatforms.includes(p) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                >
                  {PLATFORM_ICONS[p]} {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Monetization Mix</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(MONETIZATION_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleMonetization(key)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${monetizationMix.includes(key) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !niche}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Calendar
          </Button>
        </CardContent>
      </Card>

      {/* Stats Row */}
      {calendarItems.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{calendarItems.length}</div>
              <div className="text-xs text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">{(totalViews / 1000).toFixed(1)}K</div>
              <div className="text-xs text-muted-foreground">Est. Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Est. Revenue</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar Items */}
      {calendarItems.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Content Schedule</CardTitle>
              <div className="flex gap-2">
                {["all", ...new Set(calendarItems.map((i) => i.platform))].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter(p)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${filter === p ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                  >
                    {p === "all" ? "All" : p}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="text-center flex-shrink-0 w-12">
                    <div className="text-xs font-bold text-primary">{item.date.slice(5)}</div>
                    <div className="text-lg">{PLATFORM_ICONS[item.platform] ?? "📄"}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      <Badge variant="outline" className="text-xs flex-shrink-0">{item.contentType}</Badge>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {MONETIZATION_LABELS[item.monetizationPath]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground italic truncate">&ldquo;{item.hook}&rdquo;</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>~{(item.estimatedViews / 1000).toFixed(1)}K views</span>
                      <span className="text-green-600">${item.estimatedRevenue}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Select
                      value={item.status}
                      onValueChange={(v) => handleStatusChange(calendarItems.indexOf(item), v as CalendarItem["status"])}
                    >
                      <SelectTrigger className="h-7 text-xs w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
