import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, DollarSign, Users, Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const caseStudies = [
  {
    id: "1",
    title: "From Zero to $10K/month in 6 Months",
    creator: "Anonymous Creator",
    niche: "Finance Education",
    platform: "YouTube",
    timeline: "6 months",
    revenue: "$10,000",
    subscribers: "125K",
    strategy: "Daily shorts + weekly long-form content",
    keyPoints: [
      "Started with 3 videos per week",
      "Focused on trending finance topics",
      "Used AI voice-over for all content",
      "Monetized through affiliate links",
    ],
  },
  {
    id: "2",
    title: "Building a $5K/month Faceless TikTok Empire",
    creator: "Anonymous Creator",
    niche: "Productivity Tips",
    platform: "TikTok",
    timeline: "4 months",
    revenue: "$5,000",
    followers: "450K",
    strategy: "3 posts daily + live sessions",
    keyPoints: [
      "Consistent posting schedule",
      "Engaged with comments daily",
      "Cross-promoted to Instagram",
      "Created digital products",
    ],
  },
  {
    id: "3",
    title: "Scaling to $15K/month with Multiple Niches",
    creator: "Anonymous Creator",
    niche: "Multi-Niche",
    platform: "YouTube + Instagram",
    timeline: "8 months",
    revenue: "$15,000",
    subscribers: "200K+",
    strategy: "Diversified content across 3 niches",
    keyPoints: [
      "Automated content creation workflow",
      "Hired virtual assistants",
      "Built email list of 50K subscribers",
      "Launched premium course",
    ],
  },
];

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudies = caseStudies.filter((study) =>
    study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO
        title="Success Case Studies - Real Faceless Creator Stories | ContentAnonymity"
        description="Real success stories from faceless creators earning $5K-$15K+ per month. Learn exact strategies and timelines from anonymous creators."
        keywords="faceless creator success stories, case studies, anonymous creator earnings, faceless content case studies, success stories"
        url="https://contentanonymity.com/case-studies"
        canonical="https://contentanonymity.com/learning/case-studies"
        type="article"
      />
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Success Case Studies</h1>
              <p className="text-lg text-muted-foreground">
                Real success stories with detailed breakdowns and exact strategies
              </p>
            </div>

            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="case-study-search"
                  name="search"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <Card key={study.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{study.niche}</Badge>
                      <Badge variant="outline">{study.platform}</Badge>
                    </div>
                    <CardTitle className="text-xl">{study.title}</CardTitle>
                    <CardDescription>By {study.creator}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Revenue</p>
                        <p className="font-semibold flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          {study.revenue}/month
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Timeline</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {study.timeline}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">
                          {study.platform === "YouTube" ? "Subscribers" : "Followers"}
                        </p>
                        <p className="font-semibold flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {study.subscribers || study.followers}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Growth</p>
                        <p className="font-semibold flex items-center gap-1 text-green-500">
                          <TrendingUp className="h-4 w-4" />
                          Active
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Strategy:</p>
                      <p className="text-sm text-muted-foreground">{study.strategy}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Key Points:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {study.keyPoints.slice(0, 2).map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" variant="outline" asChild>
                      <Link to={`/learning/case-studies/${study.id}`}>
                        Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}












