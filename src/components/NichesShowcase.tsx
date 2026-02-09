import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const niches = [
  {
    name: "Horror Stories",
    monthlyEarnings: "$8K - $25K",
    difficulty: "Easy",
    timeToProfit: "2-3 months",
    audience: "10M+ potential",
    description: "Narrated scary stories with AI voices and stock footage",
    trending: true
  },
  {
    name: "Meditation & Sleep",
    monthlyEarnings: "$5K - $15K",
    difficulty: "Easy",
    timeToProfit: "1-2 months",
    audience: "50M+ potential",
    description: "Calming content with ambient visuals and soothing music"
  },
  {
    name: "Finance Education",
    monthlyEarnings: "$10K - $40K",
    difficulty: "Medium",
    timeToProfit: "3-4 months",
    audience: "100M+ potential",
    description: "Money tips, investing advice with animated explainers",
    trending: true
  },
  {
    name: "Motivation & Quotes",
    monthlyEarnings: "$3K - $12K",
    difficulty: "Easy",
    timeToProfit: "1-2 months",
    audience: "200M+ potential",
    description: "Inspirational content with cinematic visuals"
  },
  {
    name: "True Crime",
    monthlyEarnings: "$12K - $35K",
    difficulty: "Medium",
    timeToProfit: "3-5 months",
    audience: "80M+ potential",
    description: "Documentary-style crime stories with narration",
    trending: true
  },
  {
    name: "Product Reviews",
    monthlyEarnings: "$6K - $20K",
    difficulty: "Medium",
    timeToProfit: "2-4 months",
    audience: "150M+ potential",
    description: "Tech and gadget reviews with affiliate commissions"
  }
];

export default function NichesShowcase() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">Profitable Niches</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proven Faceless Content Niches
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These niches are generating consistent income for faceless creators. Pick one and start building your empire today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {niches.map((niche) => (
            <Card key={niche.name} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {niche.trending && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="h-3 w-3" /> Trending
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{niche.name}</CardTitle>
                <CardDescription>{niche.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Monthly Earnings
                  </span>
                  <span className="font-semibold text-primary">{niche.monthlyEarnings}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time to Profit
                  </span>
                  <span className="font-medium">{niche.timeToProfit}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Audience Size
                  </span>
                  <span className="font-medium">{niche.audience}</span>
                </div>

                <div className="pt-2">
                  <Badge variant="secondary">{niche.difficulty} to Start</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link to="/tools/niche-quiz">
                Find Your Perfect Niche <TrendingUp className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/resources/niches">
                Browse Niche Database <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
