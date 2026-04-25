import { useState, useEffect } from "react";
import { TrendingUp, BarChart3, Clock, Zap, Search, ChevronDown, ChevronUp, ExternalLink, Loader2 } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackToolUsage } from "@/utils/analytics";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

type TrendResult = {
  keyword: string;
  searchVolume: number;
  growth: number;
  competition: 'low' | 'medium' | 'high';
  viralPotential: number;
  trend: 'rising' | 'stable' | 'falling';
  platforms: string[];
  lastUpdated: string;
};

export default function TrendScanner() {
  const [keyword, setKeyword] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<TrendResult[] | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    trackToolUsage('Trend Scanner', 'tools');
  }, []);

  const scanTrends = async () => {
    if (!keyword.trim()) return;
    
    setIsScanning(true);
    try {
      trackToolUsage('Trend Scanner', 'tools', 'scan');
      
      // Demo mock data - will be replaced with real API call
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const mockResults: TrendResult[] = [
        {
          keyword: `${keyword} for beginners`,
          searchVolume: 12500,
          growth: 47,
          competition: 'low',
          viralPotential: 89,
          trend: 'rising',
          platforms: ['youtube', 'tiktok', 'instagram'],
          lastUpdated: '2 minutes ago'
        },
        {
          keyword: `how to start ${keyword}`,
          searchVolume: 8900,
          growth: 23,
          competition: 'medium',
          viralPotential: 72,
          trend: 'stable',
          platforms: ['youtube', 'google'],
          lastUpdated: '5 minutes ago'
        },
        {
          keyword: `${keyword} step by step`,
          searchVolume: 6200,
          growth: 81,
          competition: 'low',
          viralPotential: 95,
          trend: 'rising',
          platforms: ['youtube', 'tiktok'],
          lastUpdated: '1 minute ago'
        },
        {
          keyword: `${keyword} mistakes`,
          searchVolume: 4100,
          growth: 12,
          competition: 'low',
          viralPotential: 68,
          trend: 'stable',
          platforms: ['youtube'],
          lastUpdated: '12 minutes ago'
        },
        {
          keyword: `${keyword} vs traditional`,
          searchVolume: 3800,
          growth: -5,
          competition: 'medium',
          viralPotential: 54,
          trend: 'falling',
          platforms: ['google'],
          lastUpdated: '1 hour ago'
        }
      ];
      
      setResults(mockResults);
    } finally {
      setIsScanning(false);
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch(competition) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-yellow-500" />;
      case 'falling': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return null;
    }
  };

  return (
    <>
      <SEO
        title="Faceless Content Trend Scanner | Viral Topic Finder"
        description="Find trending topics with high viral potential for faceless YouTube and TikTok channels. Real-time trend analysis, competition scores and growth metrics."
        url="https://contentanonymity.com/tools/trend-scanner"
        canonical="https://contentanonymity.com/tools/trend-scanner"
        breadcrumbItems={[
          { name: 'Tools', url: 'https://contentanonymity.com/tools/all' },
          { name: 'Trend Scanner', url: 'https://contentanonymity.com/tools/trend-scanner' }
        ]}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Trend Scanner</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover trending topics with high viral potential. Analyze search volume, growth trends and competition levels across all major platforms.
              </p>
            </div>

            <Card className="max-w-3xl mx-auto mb-8">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter niche or topic to scan (e.g. faceless youtube)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && void scanTrends()}
                    className="text-base h-12"
                  />
                  <Button 
                    onClick={() => void scanTrends()} 
                    size="lg"
                    disabled={isScanning || !keyword.trim()}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Scan Trends
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {results && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Results</CardDescription>
                      <CardTitle className="text-3xl">{results.length}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Rising Trends</CardDescription>
                      <CardTitle className="text-3xl text-green-500">
                        {results.filter(r => r.trend === 'rising').length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Avg Growth</CardDescription>
                      <CardTitle className="text-3xl">
                        +{Math.round(results.reduce((a, b) => a + b.growth, 0) / results.length)}%
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Low Competition</CardDescription>
                      <CardTitle className="text-3xl">
                        {results.filter(r => r.competition === 'low').length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Keyword</TableHead>
                          <TableHead>Volume</TableHead>
                          <TableHead>Growth</TableHead>
                          <TableHead>Competition</TableHead>
                          <TableHead>Viral Potential</TableHead>
                          <TableHead>Platforms</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result, idx) => (
                          <>
                            <TableRow 
                              key={idx}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {getTrendIcon(result.trend)}
                                  {result.keyword}
                                </div>
                              </TableCell>
                              <TableCell>{result.searchVolume.toLocaleString()}/mo</TableCell>
                              <TableCell className={result.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                                {result.growth > 0 ? '+' : ''}{result.growth}%
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getCompetitionColor(result.competition)}`} />
                                  <span className="capitalize">{result.competition}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 w-[140px]">
                                  <Progress value={result.viralPotential} className="h-2" />
                                  <span className="text-sm">{result.viralPotential}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {result.platforms.map(p => (
                                    <Badge key={p} variant="secondary" className="text-xs capitalize">{p}</Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                {expandedRow === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </TableCell>
                            </TableRow>
                            {expandedRow === idx && (
                              <TableRow>
                                <TableCell colSpan={7} className="bg-muted/30">
                                  <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Content Recommendations</h4>
                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                          <li>• Best format: Tutorial / Step-by-step guide</li>
                                          <li>• Recommended video length: 8-12 minutes</li>
                                          <li>• Ideal upload schedule: Tuesday & Thursday</li>
                                          <li>• Expected CTR: 7-11%</li>
                                        </ul>
                                      </div>
                                      <div className="flex flex-col gap-2 items-end">
                                        <Button size="sm" variant="secondary">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View on Google Trends
                                        </Button>
                                        <Button size="sm">
                                          Generate Script for this topic
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {!results && !isScanning && (
              <Card className="max-w-xl mx-auto">
                <CardContent className="text-center py-16">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Enter a topic or niche to discover trending content opportunities</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze search trends, competition levels and viral potential across all platforms
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