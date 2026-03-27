import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EarningsSimulator() {
  const [platform, setPlatform] = useState("youtube");
  const [monthlyViews, setMonthlyViews] = useState(100000);
  const [rpm, setRpm] = useState(8);
  const [affiliatePct, setAffiliatePct] = useState(15);
  const [months, setMonths] = useState(6);

  const projection = useMemo(() => {
    const adRev = (monthlyViews / 1000) * rpm;
    const affiliate = adRev * (affiliatePct / 100);
    const monthly = adRev + affiliate;
    const growth = 1 + months * 0.04;
    return {
      monthly,
      atHorizon: monthly * growth,
      adRev,
      affiliate,
    };
  }, [monthlyViews, rpm, affiliatePct, months]);

  return (
    <>
      <SEO
        title="Earnings Projection Simulator | ContentAnonymity"
        description="Project faceless channel revenue from views, RPM, and affiliate mix."
        noindex={false}
        canonical="https://contentanonymity.com/tools/earnings-simulator"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Earnings projection simulator</h1>
        <p className="text-muted-foreground mb-8">
          Rough model for ad + affiliate revenue — not financial advice. Tune RPM by niche (finance
          higher, entertainment lower).
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Platform: {platform}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label>Monthly views ({monthlyViews.toLocaleString()})</Label>
              <Slider
                value={[monthlyViews]}
                min={5000}
                max={5_000_000}
                step={5000}
                onValueChange={(v) => setMonthlyViews(v[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>RPM (USD per 1k views)</Label>
              <Input
                type="number"
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Affiliate uplift (% of ad revenue)</Label>
              <Slider
                value={[affiliatePct]}
                min={0}
                max={80}
                step={1}
                onValueChange={(v) => setAffiliatePct(v[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>Horizon (months)</Label>
              <Input
                type="number"
                min={1}
                max={36}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              />
            </div>
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span>Est. monthly (now)</span>
                <span className="font-bold">${projection.monthly.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Ad revenue</span>
                <span>${projection.adRev.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Affiliate (modeled)</span>
                <span>${projection.affiliate.toFixed(0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>~At {months} mo (simple growth)</span>
                <span className="font-semibold">${projection.atHorizon.toFixed(0)}</span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href="/auth/signup">Create a free account</a>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
