import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link, Sparkles, Loader2, ExternalLink, ThumbsDown, Star, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";

interface AffiliateProgram {
  id: string;
  name: string;
  company: string;
  category: string;
  commissionRate: number;
  commissionType: "percentage" | "flat";
  cookieDuration: number;
  epc: number;
  qualityScore: number;
  matchScore: number;
  matchReasons: string[];
  signupUrl: string;
  isRecurring: boolean;
}

// Static curated affiliate programs — extend from Convex affiliate_programs table
const AFFILIATE_DATABASE: Omit<AffiliateProgram, "matchScore" | "matchReasons">[] = [
  { id: "1", name: "TubeBuddy", company: "TubeBuddy", category: "youtube-tools", commissionRate: 50, commissionType: "percentage", cookieDuration: 30, epc: 4.20, qualityScore: 91, signupUrl: "#", isRecurring: true },
  { id: "2", name: "Epidemic Sound", company: "Epidemic Sound", category: "music-licensing", commissionRate: 50, commissionType: "percentage", cookieDuration: 90, epc: 8.50, qualityScore: 89, signupUrl: "#", isRecurring: false },
  { id: "3", name: "Pictory.AI", company: "Pictory", category: "video-ai", commissionRate: 20, commissionType: "percentage", cookieDuration: 30, epc: 12.00, qualityScore: 85, signupUrl: "#", isRecurring: true },
  { id: "4", name: "Jasper.ai", company: "Jasper", category: "ai-writing", commissionRate: 30, commissionType: "percentage", cookieDuration: 30, epc: 18.00, qualityScore: 88, signupUrl: "#", isRecurring: true },
  { id: "5", name: "Canva Pro", company: "Canva", category: "design", commissionRate: 25, commissionType: "percentage", cookieDuration: 30, epc: 6.80, qualityScore: 92, signupUrl: "#", isRecurring: false },
  { id: "6", name: "Hostinger", company: "Hostinger", category: "web-hosting", commissionRate: 60, commissionType: "percentage", cookieDuration: 30, epc: 65.00, qualityScore: 87, signupUrl: "#", isRecurring: false },
  { id: "7", name: "ConvertKit", company: "ConvertKit", category: "email-marketing", commissionRate: 30, commissionType: "percentage", cookieDuration: 60, epc: 22.00, qualityScore: 90, signupUrl: "#", isRecurring: true },
  { id: "8", name: "Teachable", company: "Teachable", category: "course-platform", commissionRate: 30, commissionType: "percentage", cookieDuration: 90, epc: 35.00, qualityScore: 86, signupUrl: "#", isRecurring: true },
  { id: "9", name: "Invideo AI", company: "Invideo", category: "video-ai", commissionRate: 35, commissionType: "percentage", cookieDuration: 30, epc: 14.00, qualityScore: 83, signupUrl: "#", isRecurring: true },
  { id: "10", name: "Envato Elements", company: "Envato", category: "design-assets", commissionRate: 30, commissionType: "percentage", cookieDuration: 30, epc: 9.00, qualityScore: 84, signupUrl: "#", isRecurring: false },
];

const NICHE_CATEGORY_MAP: Record<string, string[]> = {
  "Tech & AI": ["ai-writing", "video-ai", "youtube-tools"],
  "Personal Finance": ["email-marketing", "course-platform", "web-hosting"],
  "Health & Wellness": ["course-platform", "email-marketing"],
  "YouTube Growth": ["youtube-tools", "music-licensing", "video-ai", "design"],
  "Education": ["course-platform", "ai-writing", "design"],
  "Business": ["email-marketing", "web-hosting", "course-platform", "ai-writing"],
  "Creative": ["design", "music-licensing", "design-assets", "video-ai"],
};

const matchPrograms = (niche: string, monetization: string, platforms: string[]): AffiliateProgram[] => {
  const relevantCategories = NICHE_CATEGORY_MAP[niche] ?? Object.values(NICHE_CATEGORY_MAP).flat();

  return AFFILIATE_DATABASE.map((prog) => {
    let matchScore = 50;
    const matchReasons: string[] = [];

    if (relevantCategories.includes(prog.category)) {
      matchScore += 25;
      matchReasons.push(`Highly relevant to ${niche} content`);
    }
    if (prog.isRecurring && monetization === "affiliate") {
      matchScore += 10;
      matchReasons.push("Recurring commission — passive income");
    }
    if (prog.epc > 10) {
      matchScore += 8;
      matchReasons.push(`High EPC ($${prog.epc.toFixed(2)}) — proven conversions`);
    }
    if (prog.cookieDuration >= 60) {
      matchScore += 5;
      matchReasons.push(`Long ${prog.cookieDuration}-day cookie window`);
    }
    if (prog.commissionRate >= 30) {
      matchScore += 5;
      matchReasons.push(`${prog.commissionRate}% commission rate`);
    }

    return { ...prog, matchScore: Math.min(matchScore, 99), matchReasons };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

export default function AffiliateMatchEngine() {
  const [niche, setNiche] = useState("");
  const [monetization, setMonetization] = useState("affiliate");
  const [platforms, setPlatforms] = useState<string[]>(["YouTube"]);
  const [recommendations, setRecommendations] = useState<AffiliateProgram[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isMatching, setIsMatching] = useState(false);

  const handleMatch = async () => {
    if (!niche) { toast.error("Select a niche"); return; }
    setIsMatching(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRecommendations(matchPrograms(niche, monetization, platforms));
    setDismissed(new Set());
    setIsMatching(false);
    toast.success("Top affiliate matches found!");
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    toast.info("Program dismissed");
  };

  const visible = recommendations.filter((r) => !dismissed.has(r.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            <CardTitle>AI Affiliate Match Engine</CardTitle>
            <Badge variant="secondary">Auto-Ranked</Badge>
          </div>
          <CardDescription>
            Based on your niche and content plan, get ranked affiliate programs by commission rate, EPC, cookie duration, and niche compatibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Your Niche</Label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger><SelectValue placeholder="Select niche" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(NICHE_CATEGORY_MAP).map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Monetization</Label>
              <Select value={monetization} onValueChange={setMonetization}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="affiliate">Affiliate Marketing</SelectItem>
                  <SelectItem value="adsense">AdSense + Affiliate</SelectItem>
                  <SelectItem value="digital_product">Digital Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleMatch} disabled={isMatching || !niche} className="w-full">
                {isMatching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Find Best Matches
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {visible.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Top {visible.length} Affiliate Programs for {niche}</h3>
            <Badge variant="outline">Ranked by match score + EPC</Badge>
          </div>
          {visible.map((program, i) => (
            <Card key={program.id} className={i === 0 ? "border-primary/40 bg-primary/5" : ""}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold">{program.name}</span>
                          {program.isRecurring && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Recurring</Badge>
                          )}
                          {i === 0 && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Best Match</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">{program.company}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-primary">{program.matchScore}</div>
                        <div className="text-xs text-muted-foreground">Match %</div>
                      </div>
                    </div>

                    <Progress value={program.matchScore} className="h-1.5 mb-3" />

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center p-2 bg-muted/40 rounded">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                          <DollarSign className="h-3 w-3" /> Commission
                        </div>
                        <div className="font-semibold text-sm">{program.commissionRate}%</div>
                      </div>
                      <div className="text-center p-2 bg-muted/40 rounded">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                          <Star className="h-3 w-3" /> EPC
                        </div>
                        <div className="font-semibold text-sm">${program.epc.toFixed(2)}</div>
                      </div>
                      <div className="text-center p-2 bg-muted/40 rounded">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                          <Clock className="h-3 w-3" /> Cookie
                        </div>
                        <div className="font-semibold text-sm">{program.cookieDuration}d</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {program.matchReasons.map((reason, j) => (
                        <Badge key={j} variant="outline" className="text-xs">{reason}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={program.signupUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Join Program
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(program.id)}
                        className="text-muted-foreground"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {recommendations.length > 0 && visible.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>All programs dismissed. <Button variant="link" onClick={() => setDismissed(new Set())} className="h-auto p-0">Reset</Button></p>
        </div>
      )}
    </div>
  );
}
