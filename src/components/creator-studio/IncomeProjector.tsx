import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, BarChart3, Info } from "lucide-react";

interface ProjectionResult {
  month3: { low: number; mid: number; high: number };
  month6: { low: number; mid: number; high: number };
  month12: { low: number; mid: number; high: number };
  breakdownByStream: Record<string, { month3: number; month6: number; month12: number }>;
}

const NICHE_RPM: Record<string, number> = {
  "Personal Finance": 9.5,
  "Tech & AI": 7.2,
  "Health & Wellness": 5.8,
  "Crypto & Investing": 11.2,
  "Gaming": 3.5,
  "Education": 6.0,
  "Business": 8.5,
  "Self-Improvement": 5.2,
  "Travel": 4.8,
  "Cooking": 4.2,
};

const GROWTH_CURVES = {
  conservative: { month3Multiplier: 1.0, month6Multiplier: 2.2, month12Multiplier: 5.5 },
  moderate: { month3Multiplier: 1.0, month6Multiplier: 3.0, month12Multiplier: 9.0 },
  aggressive: { month3Multiplier: 1.0, month6Multiplier: 4.5, month12Multiplier: 18.0 },
};

const calculateProjection = (
  niche: string,
  postingFreqPerWeek: number,
  avgViewsPerVideo: number,
  monetizationMix: Record<string, number>,
  growthScenario: "conservative" | "moderate" | "aggressive"
): ProjectionResult => {
  const rpm = NICHE_RPM[niche] ?? 5.0;
  const curve = GROWTH_CURVES[growthScenario];

  const monthlyVideos = postingFreqPerWeek * 4.3;
  const baseMonthlyViews = monthlyVideos * avgViewsPerVideo;

  const adsensePct = (monetizationMix.adsense ?? 0) / 100;
  const affiliatePct = (monetizationMix.affiliate ?? 0) / 100;
  const productPct = (monetizationMix.digital_product ?? 0) / 100;
  const brandPct = (monetizationMix.ugc_brand_deal ?? 0) / 100;

  const calcMonth = (viewMultiplier: number) => {
    const views = baseMonthlyViews * viewMultiplier;
    const adsense = (views / 1000) * rpm * adsensePct;
    const affiliate = views * 0.005 * 35 * affiliatePct; // 0.5% conv, $35 avg commission
    const product = views * 0.002 * 47 * productPct; // 0.2% conv, $47 avg product price
    const brand = views > 50000 ? 500 * brandPct : 0;
    return adsense + affiliate + product + brand;
  };

  const streams = { adsense: adsensePct, affiliate: affiliatePct, digital_product: productPct, ugc_brand_deal: brandPct };

  return {
    month3: {
      low: calcMonth(curve.month3Multiplier) * 0.6,
      mid: calcMonth(curve.month3Multiplier),
      high: calcMonth(curve.month3Multiplier) * 1.5,
    },
    month6: {
      low: calcMonth(curve.month6Multiplier) * 0.6,
      mid: calcMonth(curve.month6Multiplier),
      high: calcMonth(curve.month6Multiplier) * 1.5,
    },
    month12: {
      low: calcMonth(curve.month12Multiplier) * 0.6,
      mid: calcMonth(curve.month12Multiplier),
      high: calcMonth(curve.month12Multiplier) * 1.5,
    },
    breakdownByStream: Object.fromEntries(
      Object.entries(streams)
        .filter(([, pct]) => pct > 0)
        .map(([key, pct]) => {
          const views12 = baseMonthlyViews * curve.month12Multiplier;
          const base =
            key === "adsense"
              ? (views12 / 1000) * rpm * pct
              : key === "affiliate"
              ? views12 * 0.005 * 35 * pct
              : key === "digital_product"
              ? views12 * 0.002 * 47 * pct
              : views12 > 50000 ? 500 * pct : 0;
          return [key, {
            month3: base * curve.month3Multiplier / curve.month12Multiplier,
            month6: base * curve.month6Multiplier / curve.month12Multiplier,
            month12: base,
          }];
        })
    ),
  };
};

const StreamLabels: Record<string, string> = {
  adsense: "AdSense",
  affiliate: "Affiliate",
  digital_product: "Digital Products",
  ugc_brand_deal: "Brand Deals",
};

export default function IncomeProjector() {
  const [niche, setNiche] = useState("Personal Finance");
  const [postingFreq, setPostingFreq] = useState([3]);
  const [avgViews, setAvgViews] = useState([2000]);
  const [growthScenario, setGrowthScenario] = useState<"conservative" | "moderate" | "aggressive">("moderate");
  const [mix, setMix] = useState({ adsense: 40, affiliate: 40, digital_product: 15, ugc_brand_deal: 5 });
  const [result, setResult] = useState<ProjectionResult | null>(null);

  const mixTotal = Object.values(mix).reduce((a, b) => a + b, 0);

  const handleProject = () => {
    const projection = calculateProjection(niche, postingFreq[0], avgViews[0], mix, growthScenario);
    setResult(projection);
  };

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${Math.round(n)}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>AI Income Projector</CardTitle>
            <Badge variant="secondary">Multi-Stream</Badge>
          </div>
          <CardDescription>
            Project your 3/6/12-month income based on niche RPM, posting frequency, growth curves, and monetization mix. Shows confidence bands.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Niche</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(NICHE_RPM).map((n) => (
                      <SelectItem key={n} value={n}>{n} — ${NICHE_RPM[n]} RPM</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Posts per Week</Label>
                  <span className="text-sm font-semibold">{postingFreq[0]}x/week</span>
                </div>
                <Slider value={postingFreq} onValueChange={setPostingFreq} min={1} max={7} step={1} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Avg Views per Video</Label>
                  <span className="text-sm font-semibold">{avgViews[0].toLocaleString()}</span>
                </div>
                <Slider value={avgViews} onValueChange={setAvgViews} min={200} max={50000} step={200} />
              </div>

              <div className="space-y-2">
                <Label>Growth Scenario</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["conservative", "moderate", "aggressive"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setGrowthScenario(s)}
                      className={`p-2 rounded-lg border text-center text-xs font-medium transition-colors ${growthScenario === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — monetization mix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Monetization Mix</Label>
                <span className={`text-xs ${mixTotal === 100 ? "text-green-600" : "text-orange-600"}`}>
                  Total: {mixTotal}%
                </span>
              </div>
              {(Object.entries(mix) as [keyof typeof mix, number][]).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{StreamLabels[key]}</span>
                    <span className="font-semibold">{val}%</span>
                  </div>
                  <Slider
                    value={[val]}
                    onValueChange={([v]) => setMix((prev) => ({ ...prev, [key]: v }))}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              ))}
              {mixTotal !== 100 && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Adjust mix to total 100% for accurate projections
                </p>
              )}
            </div>
          </div>

          <Button onClick={handleProject} className="w-full" disabled={mixTotal === 0}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Calculate Income Projections
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Timeline projections */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "3 Months", data: result.month3 },
              { label: "6 Months", data: result.month6 },
              { label: "12 Months", data: result.month12 },
            ].map(({ label, data }) => (
              <Card key={label}>
                <CardContent className="pt-4 text-center space-y-1">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-2xl font-bold text-primary">{fmt(data.mid)}</div>
                  <div className="text-xs text-muted-foreground">
                    {fmt(data.low)} – {fmt(data.high)}
                  </div>
                  <div className="text-xs text-muted-foreground">/ month</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stream breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue by Stream (Month 12 Projection)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(result.breakdownByStream).map(([key, data]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-muted-foreground">{StreamLabels[key]}</div>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(data.month12 / result.month12.mid) * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium">{fmt(data.month12)}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-start gap-1">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                Projections use niche RPM benchmarks, industry conversion rates, and algorithmic growth models.
                Actual results depend on content quality, consistency, and niche competition.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
