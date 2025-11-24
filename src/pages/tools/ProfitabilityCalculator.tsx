import { useState } from "react";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfitabilityCalculator() {
  const [inputs, setInputs] = useState({
    niche: "",
    platform: "",
    frequency: "3",
    cpm: "5"
  });

  const [results, setResults] = useState<{
    monthly: number;
    yearly: number;
    breakeven: number;
  } | null>(null);

  const calculateProfitability = () => {
    const postsPerWeek = parseInt(inputs.frequency);
    const cpmRate = parseFloat(inputs.cpm);
    const avgViews = inputs.platform === "youtube" ? 10000 : inputs.platform === "tiktok" ? 50000 : 5000;
    
    const monthlyViews = postsPerWeek * 4 * avgViews;
    const monthlyRevenue = (monthlyViews / 1000) * cpmRate;
    const yearlyRevenue = monthlyRevenue * 12;
    const breakeven = Math.ceil(1000 / monthlyRevenue);

    setResults({
      monthly: Math.round(monthlyRevenue),
      yearly: Math.round(yearlyRevenue),
      breakeven: breakeven
    });
  };

  return (
    <>
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
                    <Label htmlFor="niche">Niche</Label>
                    <Select value={inputs.niche} onValueChange={(value) => setInputs({ ...inputs, niche: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="tech">Tech & AI</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="health">Health & Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={inputs.platform} onValueChange={(value) => setInputs({ ...inputs, platform: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Posts Per Week</Label>
                    <Input
                      id="frequency"
                      type="number"
                      value={inputs.frequency}
                      onChange={(e) => setInputs({ ...inputs, frequency: e.target.value })}
                      min="1"
                      max="14"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpm">Estimated CPM ($)</Label>
                    <Input
                      id="cpm"
                      type="number"
                      value={inputs.cpm}
                      onChange={(e) => setInputs({ ...inputs, cpm: e.target.value })}
                      min="1"
                      step="0.5"
                    />
                  </div>

                  <Button onClick={calculateProfitability} className="w-full" size="lg">
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
                          <p className="text-sm text-muted-foreground mb-1">Months to $1000/mo</p>
                          <p className="text-xl font-bold">{results.breakeven} months</p>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
