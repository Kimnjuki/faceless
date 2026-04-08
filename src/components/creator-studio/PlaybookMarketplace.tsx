import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Star, Download, Lock, Search, Filter, TrendingUp, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";

interface Playbook {
  id: string;
  title: string;
  description: string;
  niche: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  targetPlatforms: string[];
  monetizationPaths: string[];
  expectedIncomeRange: string;
  timeToResults: string;
  price: number;
  isFree: boolean;
  aiQualityScore: number;
  downloadCount: number;
  toolStack: string[];
  steps: string[];
  author: string;
}

const DEMO_PLAYBOOKS: Playbook[] = [
  {
    id: "1",
    title: "The Finance Faceless Playbook",
    description: "Full A-Z system for building a $5K/month personal finance channel without showing your face. Includes niche selection, script templates, posting schedule, and affiliate stack.",
    niche: "Personal Finance",
    difficulty: "beginner",
    targetPlatforms: ["YouTube", "Newsletter"],
    monetizationPaths: ["affiliate", "digital_product"],
    expectedIncomeRange: "$2K–$8K/month",
    timeToResults: "90 days",
    price: 0,
    isFree: true,
    aiQualityScore: 94,
    downloadCount: 1842,
    toolStack: ["TubeBuddy", "Jasper.ai", "Canva", "ConvertKit"],
    steps: [
      "Choose a sub-niche within personal finance (credit, investing, budgeting)",
      "Set up anonymous channel with AI voice persona",
      "Create 10 evergreen scripts using the provided templates",
      "Publish 3x/week for 60 days using the content calendar",
      "Apply to top 5 affiliate programs from the curated list",
      "Scale with a digital product (guide or template pack)",
    ],
    author: "AnonymousCreator_A7",
  },
  {
    id: "2",
    title: "Tech & AI Niche Domination",
    description: "Battle-tested system for the AI tools niche — the fastest-growing faceless content category in 2025. Includes 30 script outlines, affiliate recommendations, and a SEO content cluster.",
    niche: "Tech & AI",
    difficulty: "intermediate",
    targetPlatforms: ["YouTube", "TikTok"],
    monetizationPaths: ["affiliate", "adsense", "ugc_brand_deal"],
    expectedIncomeRange: "$3K–$12K/month",
    timeToResults: "60 days",
    price: 47,
    isFree: false,
    aiQualityScore: 91,
    downloadCount: 634,
    toolStack: ["Invideo AI", "Epidemic Sound", "TubeBuddy", "Pictory"],
    steps: [
      "Select 3 AI tool categories to focus on (image gen, writing, video)",
      "Create comparison-style scripts (Tool A vs Tool B format)",
      "Set up affiliate accounts with 5 AI software companies",
      "Post 5x/week on TikTok shorts + weekly YouTube long-form",
      "Target CPM keywords in the $8–15 RPM range",
      "Land first UGC brand deal at 10K subscribers",
    ],
    author: "SilentTechCreator",
  },
  {
    id: "3",
    title: "Agency White-Label Starter Pack",
    description: "For ghost content agencies managing 5–20 client channels. Includes onboarding templates, content approval workflows, pricing guides, and client communication scripts.",
    niche: "Business",
    difficulty: "advanced",
    targetPlatforms: ["YouTube", "TikTok", "Instagram"],
    monetizationPaths: ["ugc_brand_deal", "digital_product"],
    expectedIncomeRange: "$15K–$50K/month",
    timeToResults: "30 days",
    price: 197,
    isFree: false,
    aiQualityScore: 96,
    downloadCount: 287,
    toolStack: ["ContentAnonymity Agency Mode", "Notion", "Stripe", "Loom"],
    steps: [
      "Set up agency account with white-label dashboard",
      "Onboard first 3 clients using the included template",
      "Create separate persona channels for each client",
      "Run content approval workflow before publishing",
      "Bill $3K–$10K/month per client retainer",
      "Scale to 10 clients with assistant creator workflow",
    ],
    author: "GhostAgencyPro",
  },
];

const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "bg-green-100 text-green-800" },
  intermediate: { label: "Intermediate", color: "bg-blue-100 text-blue-800" },
  advanced: { label: "Advanced", color: "bg-purple-100 text-purple-800" },
};

export default function PlaybookMarketplace() {
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [purchased, setPurchased] = useState<Set<string>>(new Set(["1"])); // "1" is free
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = DEMO_PLAYBOOKS.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchNiche = nicheFilter === "all" || p.niche === nicheFilter;
    const matchDiff = difficultyFilter === "all" || p.difficulty === difficultyFilter;
    const matchPrice = priceFilter === "all" || (priceFilter === "free" && p.isFree) || (priceFilter === "paid" && !p.isFree);
    return matchSearch && matchNiche && matchDiff && matchPrice;
  });

  const handleAccess = (playbook: Playbook) => {
    if (playbook.isFree || purchased.has(playbook.id)) {
      toast.success(`Opening "${playbook.title}"`);
    } else {
      // Mock purchase
      setPurchased((prev) => new Set([...prev, playbook.id]));
      toast.success(`Purchased "${playbook.title}" — access granted!`);
    }
  };

  const niches = [...new Set(DEMO_PLAYBOOKS.map((p) => p.niche))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Playbook Marketplace</CardTitle>
            <Badge variant="secondary">AI Quality-Scored</Badge>
          </div>
          <CardDescription>
            Community creators sell their exact content strategies, prompt libraries, and monetization stacks.
            AI rates each playbook on quality and proven results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-48">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search playbooks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={nicheFilter} onValueChange={setNicheFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Niche" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                {niches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Price" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-muted-foreground">{filtered.length} playbooks found</div>
        </CardContent>
      </Card>

      {/* Playbook Cards */}
      <div className="space-y-4">
        {filtered.map((playbook) => {
          const isOwned = purchased.has(playbook.id) || playbook.isFree;
          const isExpanded = expanded === playbook.id;
          const diffCfg = DIFFICULTY_CONFIG[playbook.difficulty];

          return (
            <Card key={playbook.id} className={isExpanded ? "border-primary/30" : ""}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-base mb-1">{playbook.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={diffCfg.color}>{diffCfg.label}</Badge>
                          <Badge variant="outline">{playbook.niche}</Badge>
                          {playbook.isFree ? (
                            <Badge className="bg-green-100 text-green-800">Free</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800">${playbook.price}</Badge>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {playbook.aiQualityScore}/100 AI Score
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{playbook.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {playbook.expectedIncomeRange}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {playbook.timeToResults}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        {playbook.downloadCount.toLocaleString()} downloads
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4 mt-4 border-t pt-4">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">System Steps</div>
                          <ol className="space-y-1.5">
                            {playbook.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tool Stack</div>
                          <div className="flex flex-wrap gap-2">
                            {playbook.toolStack.map((t) => (
                              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          By <span className="font-medium">{playbook.author}</span> · Platforms: {playbook.targetPlatforms.join(", ")}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAccess(playbook)}
                        className={isOwned ? "" : ""}
                      >
                        {isOwned ? (
                          <><BookOpen className="h-3 w-3 mr-1" />Open Playbook</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" />Get for ${playbook.price}</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpanded(isExpanded ? null : playbook.id)}
                      >
                        {isExpanded ? "Show Less" : "Preview Steps"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No playbooks match your filters.</p>
          </div>
        )}
      </div>

      {/* Create Playbook CTA */}
      <Card className="border-dashed border-primary/30">
        <CardContent className="pt-4 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary opacity-60" />
          <h3 className="font-semibold mb-1">Sell Your Playbook</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Share your proven content strategy. Earn 70% of every sale. Platform takes 30% to fund AI quality scoring and discovery.
          </p>
          <Button variant="outline" onClick={() => toast.info("Playbook creator coming soon!")}>
            Create & Sell a Playbook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
