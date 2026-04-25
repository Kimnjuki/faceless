import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Eye, ThumbsUp, Clock, DollarSign, Zap, Loader2, Search } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { trackToolUsage } from "@/utils/analytics";

type ChannelAnalysis = {
  channelName: string;
  subscribers: number;
  totalViews: number;
  averageViews: number;
  uploadFrequency: string;
  estimatedRevenue: {
    min: number;
    max: number;
  };
  engagementRate: number;
  ctrEstimate: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  growthScore: number;
  benchmark: {
    nicheAverage: number;
    percentile: number;
  };
  lastAnalyzed: string;
};

export default function ChannelAnalyzer() {
  const [channelUrl, setChannelUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ChannelAnalysis | null>(null);

  useEffect(() => {
    trackToolUsage('Channel Analyzer', 'tools');
  }, []);

  const analyzeChannel = async () => {
    if (!channelUrl.trim()) return;
    
    setIsAnalyzing(true);
    try {
      trackToolUsage('Channel Analyzer', 'tools', 'analyze');
      
      // Demo mock analysis - will be replaced with real API integration
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      const mockAnalysis: ChannelAnalysis = {
        channelName: "Faceless Content Academy",
        subscribers: 124500,
        totalViews: 8924500,
        averageViews: 124500,
        uploadFrequency: "2 videos/week",
        estimatedRevenue: {
          min: 4200,
          max: 12600
        },
        engagementRate: 6.8,
        ctrEstimate: 8.2,
        strengths: [
          "Excellent hook retention in first 30 seconds",
          "Consistent branding and thumbnails",
          "Strong call to action performance",
          "High average watch time (62%)"
        ],
        weaknesses: [
          "Low video description optimization",
          "Missing end screen elements",
          "Inconsistent upload schedule",
          "Poor playlists organization"
        ],
        opportunities: [
          "Create short-form content from long videos",
          "Add chapter timestamps for SEO",
          "Implement card links between related videos",
          "Add pinned comments with timestamps"
        ],
        growthScore: 76,
        benchmark: {
          nicheAverage: 58,
          percentile: 82
        },
        lastAnalyzed: new Date().toLocaleString()
      };
      
      setAnalysis(mockAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <SEO
        title="YouTube Channel Analyzer | Faceless Channel Audit"
        description="Analyze any YouTube channel anonymously. Get performance benchmarks, revenue estimates, engagement metrics and growth recommendations."
        url="https://contentanonymity.com/tools/channel-analyzer"
        canonical="https://contentanonymity.com/tools/channel-analyzer"
        breadcrumbItems={[
          { name: 'Tools', url: 'https://contentanonymity.com/tools/all' },
          { name: 'Channel Analyzer', url: 'https://contentanonymity.com/tools/channel-analyzer' }
        ]}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Channel Analyzer</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Anonymous YouTube channel audit. Analyze any channel performance, estimate revenue, benchmark against competitors and get actionable growth recommendations.
              </p>
            </div>

            <Card className="max-w-3xl mx-auto mb-8">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Paste YouTube channel URL or username"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && void analyzeChannel()}
                    className="text-base h-12"
                  />
                  <Button 
                    onClick={() => void analyzeChannel()} 
                    size="lg"
                    disabled={isAnalyzing || !channelUrl.trim()}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze Channel
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {analysis && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> Subscribers
                      </CardDescription>
                      <CardTitle className="text-2xl">{analysis.subscribers.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> Average Views
                      </CardDescription>
                      <CardTitle className="text-2xl">{analysis.averageViews.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> Est. Revenue
                      </CardDescription>
                      <CardTitle className="text-2xl">${analysis.estimatedRevenue.min.toLocaleString()} - ${analysis.estimatedRevenue.max.toLocaleString()}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" /> Growth Score
                      </CardDescription>
                      <CardTitle className={`text-2xl ${getScoreColor(analysis.growthScore)}`}>{analysis.growthScore}/100</CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Channel metrics and benchmark comparison</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                          <span>Engagement Rate</span>
                        </div>
                        <span className="font-medium">{analysis.engagementRate}%</span>
                      </div>
                      <Progress value={analysis.engagementRate * 10} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span>Click Through Rate (CTR)</span>
                        </div>
                        <span className="font-medium">{analysis.ctrEstimate}%</span>
                      </div>
                      <Progress value={analysis.ctrEstimate * 12} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Upload Frequency</span>
                        </div>
                        <span className="font-medium">{analysis.uploadFrequency}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Niche Average Score</span>
                        <span>{analysis.benchmark.nicheAverage}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Percentile Rank</span>
                        <span>Top {100 - analysis.benchmark.percentile}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="strengths" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="strengths">✅ Strengths</TabsTrigger>
                    <TabsTrigger value="weaknesses">⚠️ Weaknesses</TabsTrigger>
                    <TabsTrigger value="opportunities">🚀 Opportunities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="strengths" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {analysis.strengths.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge variant="secondary" className="mt-0.5 bg-green-500/10 text-green-600">✓</Badge>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="weaknesses" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {analysis.weaknesses.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge variant="secondary" className="mt-0.5 bg-yellow-500/10 text-yellow-600">!</Badge>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="opportunities" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {analysis.opportunities.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge variant="secondary" className="mt-0.5 bg-blue-500/10 text-blue-600">→</Badge>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Growth Potential</h3>
                        <p className="text-sm text-muted-foreground">Based on current metrics and optimization opportunities</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        +37% Growth possible in 90 days
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!analysis && !isAnalyzing && (
              <Card className="max-w-xl mx-auto">
                <CardContent className="text-center py-16">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Enter any YouTube channel URL to perform a complete audit</p>
                  <p className="text-sm text-muted-foreground">
                    No login required. 100% anonymous analysis with actionable recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}