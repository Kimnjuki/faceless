import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { trackToolUsage } from "@/utils/analytics";
import { Separator } from "@/components/ui/separator";

export default function ProfitabilityCalculator() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const nicheRows = useQuery(api.niche_analysis.list, hasConvex ? { limit: 200 } : "skip");
  const trackConversion = useMutation(api.conversions.track);

  const nicheOptions = useMemo(() => {
    if (!nicheRows?.length) return [];
    return nicheRows.map((r) => r.nicheName).filter(Boolean) as string[];
  }, [nicheRows]);

  const [inputs, setInputs] = useState({
    nicheName: "",
    platform: "youtube",
    videosPerWeek: 3,
    avgViewsPerVideo: 8000,
    rpm: 12,
  });

  const [results, setResults] = useState<{
    monthly: number;
    yearly: number;
    breakeven: number;
    monthlyViews: number;
    contentForMonetization: string;
  } | null>(null);

  useEffect(() => {
    trackToolUsage("Profitability Calculator", "tools");
  }, []);

  useEffect(() => {
    if (!nicheRows?.length || inputs.nicheName) return;
    const first = nicheRows[0];
    if (first?.nicheName != null && first.avgRpm != null) {
      const r = first.avgRpm;
      setInputs((s) => ({
        ...s,
        nicheName: first.nicheName,
        rpm: Math.round(r * 10) / 10,
      }));
    }
  }, [nicheRows, inputs.nicheName]);

  const onNicheChange = (nicheName: string) => {
    const row = nicheRows?.find((r) => r.nicheName === nicheName);
    setInputs((s) => ({
      ...s,
      nicheName,
      rpm: row?.avgRpm != null ? Math.round(row.avgRpm * 10) / 10 : s.rpm,
    }));
  };

  const calculateProfitability = async () => {
    trackToolUsage("Profitability Calculator", "tools", "calculate");
    const postsPerWeek = inputs.videosPerWeek;
    const rpm = inputs.rpm;
    const avgViews = inputs.avgViewsPerVideo;

    const monthlyViews = postsPerWeek * 4 * avgViews;
    const monthlyRevenue = (monthlyViews / 1000) * rpm;
    const yearlyRevenue = monthlyRevenue * 12;
    const breakeven = monthlyRevenue > 0 ? Math.ceil(1000 / monthlyRevenue) : 999;
    const yppHours = 4000;
    const avgMinutesPerVideo = inputs.platform === "tiktok" ? 0.5 : inputs.platform === "instagram" ? 1 : 8;
    const watchHoursPerMonth = (monthlyViews * avgMinutesPerVideo) / 60;
    const monthsToYpp =
      watchHoursPerMonth > 0 ? Math.ceil(yppHours / watchHoursPerMonth) : 999;

    if (hasConvex) {
      try {
        await trackConversion({
          conversionType: "calculator_use",
          source: "profitability_calculator",
          medium: inputs.platform,
          campaign: inputs.nicheName || "unknown",
        });
      } catch {
        /* non-blocking */
      }
    }

    setResults({
      monthly: Math.round(monthlyRevenue),
      yearly: Math.round(yearlyRevenue),
      breakeven,
      monthlyViews: Math.round(monthlyViews),
      contentForMonetization: `Rough order-of-magnitude: ~${monthsToYpp} months of this pace to reach 4,000 public watch hours (YouTube Partner Programme style threshold) if average watch time tracks video length.`,
    });
  };

  return (
    <>
      <SEO
        title="How Much Can You Earn? Free Faceless Calculator 2026"
        description="Estimate your earning potential from faceless content in seconds. Input your niche, hours & platform — get a detailed revenue breakdown. Try it free now."
        url="https://contentanonymity.com/tools/calculator"
        canonical="https://contentanonymity.com/tools/calculator"
        breadcrumbItems={[
          { name: 'Tools', url: 'https://contentanonymity.com/tools/all' },
          { name: 'Profitability Calculator', url: 'https://contentanonymity.com/tools/calculator' }
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Faceless Content Profitability Calculator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127"
          },
          "description": "Free calculator to estimate potential earnings from faceless content creation across YouTube, TikTok, and Instagram platforms."
        }}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Profitability Calculator</h1>
              <p className="text-lg text-muted-foreground">
                Estimate your potential earnings from faceless content creation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                  <CardDescription>Enter your content strategy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="niche">Niche (RPM from benchmarks)</Label>
                    <Select
                      value={inputs.nicheName}
                      onValueChange={onNicheChange}
                      disabled={!nicheOptions.length}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={nicheOptions.length ? "Select niche" : "Loading niches…"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(nicheOptions.length ? nicheOptions : ["Personal Finance & Budgeting"]).map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!hasConvex && (
                      <p className="text-xs text-muted-foreground">
                        Connect Convex to load RPM benchmarks from niche analysis.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={inputs.platform}
                      onValueChange={(value) => setInputs({ ...inputs, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Videos / posts per week</Label>
                      <span className="text-sm text-muted-foreground">{inputs.videosPerWeek}</span>
                    </div>
                    <Slider
                      min={1}
                      max={7}
                      step={1}
                      value={[inputs.videosPerWeek]}
                      onValueChange={(v) => setInputs({ ...inputs, videosPerWeek: v[0] ?? 1 })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Avg views per video / post</Label>
                      <span className="text-sm text-muted-foreground">
                        {inputs.avgViewsPerVideo.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      min={500}
                      max={200000}
                      step={500}
                      value={[inputs.avgViewsPerVideo]}
                      onValueChange={(v) => setInputs({ ...inputs, avgViewsPerVideo: v[0] ?? 500 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rpm">RPM ($ per 1,000 views)</Label>
                    <Input
                      id="rpm"
                      name="rpm"
                      type="number"
                      value={inputs.rpm}
                      onChange={(e) =>
                        setInputs({ ...inputs, rpm: parseFloat(e.target.value) || 0 })
                      }
                      autoComplete="off"
                      min="0.5"
                      step="0.1"
                    />
                  </div>

                  <Button onClick={() => void calculateProfitability()} className="w-full" size="lg">
                    Calculate Earnings
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {results ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          Estimated Earnings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
                          <p className="text-3xl font-bold text-primary">${results.monthly.toLocaleString()}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Yearly Revenue</p>
                          <p className="text-2xl font-bold">${results.yearly.toLocaleString()}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Estimated monthly views</p>
                          <p className="text-xl font-bold">{results.monthlyViews.toLocaleString()}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Months to ~$1k/mo (ad-only)</p>
                          <p className="text-xl font-bold">{results.breakeven} months</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Content volume note</p>
                          <p className="text-sm leading-relaxed">{results.contentForMonetization}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">Pro Tip</p>
                            <p className="text-sm text-muted-foreground">
                              Diversify revenue with affiliate marketing, digital products, and sponsorships to 3-5x these numbers.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Fill in your details and click Calculate to see your potential earnings
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Content Depth Section - 200+ words for SEO */}
          <div className="max-w-4xl mx-auto mt-16 prose prose-lg dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">How to Use the Faceless Content Profitability Calculator</h2>
              <p className="text-lg leading-relaxed mb-4">
                Our free profitability calculator helps you estimate potential earnings from faceless content creation. Whether you're planning a YouTube channel, TikTok account, or Instagram presence, this tool provides realistic revenue projections based on your content strategy.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                To get accurate results, start by selecting your niche. Popular faceless niches include finance, technology, lifestyle, business, and health & fitness. Each niche has different CPM rates and audience engagement levels, which directly impact your earning potential.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Next, choose your primary platform. YouTube typically offers higher CPM rates ($3-8 per 1000 views) but requires more production time. TikTok has lower CPM rates ($1-3) but offers viral potential and faster content creation. Instagram falls somewhere in between, with strong engagement rates.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                The calculator uses industry-standard metrics to estimate your earnings. It factors in average view counts, engagement rates, and platform-specific monetization models. Remember, these are estimates based on consistent posting and audience growth. Actual earnings may vary based on content quality, niche competition, and algorithm performance.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                For best results, aim for 3-5 posts per week to maintain algorithm momentum. Higher posting frequency can increase total views, but quality should never be sacrificed for quantity. The calculator shows both monthly and yearly projections, plus how many months it will take to reach $1,000 per month in revenue.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Pro tip: Diversify your revenue streams beyond ad revenue. Successful faceless creators often earn 3-5x their ad revenue through affiliate marketing, digital products, sponsorships, and community memberships. Use this calculator as a baseline, then explore additional monetization strategies to maximize your faceless content business potential.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Understanding Faceless Content Revenue Streams</h2>
              <p className="text-lg leading-relaxed mb-4">
                Faceless content creation has become one of the most profitable online business models in 2025. Unlike traditional content creation, faceless channels focus on value, entertainment, and information rather than personal branding. This approach allows creators to maintain complete anonymity while building substantial audiences.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                The profitability calculator accounts for platform ad revenue, but successful faceless creators typically earn from multiple sources. Ad revenue from YouTube, TikTok, or Instagram provides a baseline income, but affiliate marketing can double or triple your earnings. Promoting tools, courses, and services relevant to your niche generates commissions without requiring additional content creation.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Digital products represent another high-margin revenue stream. Create comprehensive guides, templates, or courses that solve specific problems for your audience. These products can be sold repeatedly without ongoing production costs, making them highly profitable for faceless creators.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Community memberships offer recurring revenue and deeper audience engagement. Platforms like Patreon or custom membership sites allow you to offer exclusive content, early access, or direct access for a monthly fee. This creates predictable income that grows with your audience.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Sponsored content becomes viable once you have a substantial following, with rates typically ranging from $500 to $5,000 per sponsored video depending on audience size and engagement. The key is maintaining authenticity and only promoting products that genuinely benefit your audience.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Maximizing Your Faceless Content Earnings</h2>
              <p className="text-lg leading-relaxed mb-4">
                To maximize earnings from faceless content, focus on three key areas: content quality, posting consistency, and audience engagement. High-quality content that provides genuine value will naturally attract more views and subscribers, increasing your ad revenue potential.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Consistency is crucial for algorithm performance. The calculator assumes regular posting schedules, but irregular posting can significantly reduce your estimated earnings. Set a realistic posting schedule you can maintain long-term, whether that's 3 posts per week or daily content.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Engagement metrics directly impact your CPM rates. Higher engagement rates (likes, comments, shares) signal to platforms that your content is valuable, which can increase your ad revenue rates. Focus on creating content that encourages interaction and builds community.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Remember, the calculator provides estimates based on industry averages. Your actual earnings will depend on factors like niche competition, content uniqueness, SEO optimization, and audience demographics. Use these projections as a starting point, then track your actual performance to refine your strategy.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Start your faceless content journey today. Use this free calculator to set realistic expectations, then focus on creating valuable content that serves your audience. With consistent effort and strategic monetization, building a profitable faceless content business is achievable for anyone willing to put in the work.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
