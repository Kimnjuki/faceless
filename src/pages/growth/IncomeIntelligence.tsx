import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function IncomeIntelligence() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const agg = useQuery(api.creatorContent.listIncomeAggregates, hasConvex ? {} : "skip");
  const submit = useMutation(api.creatorContent.submitIncomeReport);
  const [platform, setPlatform] = useState("YouTube");
  const [amount, setAmount] = useState("2500");
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasConvex) return;
    const n = parseFloat(amount);
    if (Number.isNaN(n) || n < 0) {
      toast.error("Enter a valid monthly revenue");
      return;
    }
    await submit({
      platform,
      monthlyRevenue: n,
      reportMonth: month,
    });
    toast.success("Thanks — your report helps anonymized benchmarks.");
  };

  return (
    <>
      <SEO
        title="Income Intelligence | ContentAnonymity"
        description="Aggregated community earnings by platform and optional anonymous self-reporting."
        canonical="https://contentanonymity.com/income-intelligence"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Income intelligence</h1>
        <p className="text-muted-foreground mb-8">
          Aggregates are anonymized. More reports = better benchmarks for everyone.
        </p>
        {agg && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Total reports: {agg.totalReports}</p>
              {Object.entries(agg.byPlatform).map(([p, v]) => {
                const row = v as { sum: number; n: number };
                return (
                <p key={p}>
                  {p}: avg ${Math.round(row.sum / Math.max(1, row.n))}/mo ({row.n} reports)
                </p>
              );
              })}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Submit anonymous report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4 max-w-md">
              <div>
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Monthly revenue (USD)</Label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min={0}
                />
              </div>
              <div>
                <Label>Month</Label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <Button type="submit" disabled={!hasConvex}>
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
