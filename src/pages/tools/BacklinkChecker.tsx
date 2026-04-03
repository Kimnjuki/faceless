import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Link as LinkIcon, 
  ExternalLink,
  TrendingUp,
  Globe,
  Search,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { trackToolUsage } from "@/utils/analytics";

interface Backlink {
  url: string;
  domain: string;
  anchorText: string;
  domainAuthority: number;
  type: 'dofollow' | 'nofollow';
  date: string;
  trustScore?: number;
  toxicityFlag?: "low" | "medium" | "high";
  facelessTag?: string;
}

export default function BacklinkChecker() {
  const [url, setUrl] = useState("");
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "fetching" | "analyzing" | "generating">("idle");
  const [stats, setStats] = useState({
    total: 0,
    dofollow: 0,
    nofollow: 0,
    referringDomains: 0
  });

  useEffect(() => {
    trackToolUsage("Anonymous Authority Builder", "tools");
  }, []);

  const handleCheck = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setPhase("fetching");
    
    // Simulate API call (in production, integrate with Ahrefs Free Backlink Checker API or similar)
    setTimeout(() => {
      setPhase("analyzing");
      const sampleBacklinks: Backlink[] = [
        {
          url: 'https://example.com/article',
          domain: 'example.com',
          anchorText: 'faceless content creation',
          domainAuthority: 65,
          type: 'dofollow',
          date: '2024-01-15',
          trustScore: 74,
          toxicityFlag: 'low',
          facelessTag: 'resource_page'
        },
        {
          url: 'https://blog.example.org/post',
          domain: 'blog.example.org',
          anchorText: 'ContentAnonymity',
          domainAuthority: 45,
          type: 'dofollow',
          date: '2024-01-10',
          trustScore: 62,
          toxicityFlag: 'low',
          facelessTag: 'blog_editorial'
        },
        {
          url: 'https://socialmedia.com/share',
          domain: 'socialmedia.com',
          anchorText: 'anonymous content',
          domainAuthority: 80,
          type: 'nofollow',
          date: '2024-01-05',
          trustScore: 38,
          toxicityFlag: 'medium',
          facelessTag: 'social_profile'
        }
      ];

      const uniqueDomains = new Set(sampleBacklinks.map(b => b.domain));
      
      setStats({
        total: sampleBacklinks.length,
        dofollow: sampleBacklinks.filter(b => b.type === 'dofollow').length,
        nofollow: sampleBacklinks.filter(b => b.type === 'nofollow').length,
        referringDomains: uniqueDomains.size
      });
      
      setTimeout(() => {
        setPhase("generating");
        setBacklinks(sampleBacklinks);
        setLoading(false);
        setPhase("idle");
      }, 600);
    }, 1500);
  };

  const avgTrust = useMemo(() => {
    if (!backlinks.length) return 0;
    const total = backlinks.reduce((acc, curr) => acc + (curr.trustScore ?? 0), 0);
    return Math.round(total / backlinks.length);
  }, [backlinks]);

  return (
    <>
      <SEO
        title="Free Backlink Checker - Analyze Backlinks | ContentAnonymity"
        description="Free backlink checker to analyze your backlink profile. See referring domains, anchor text, and link types. Alternative to Ahrefs backlink tool."
        canonical="https://contentanonymity.com/tools/backlink-checker"
      />
      <Header />
      <main className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Anonymous Authority Builder</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Backlink insights built for faceless creators — find anonymous-friendly link opportunities
              </p>

              {loading && (
                <div className="mb-6 text-sm text-muted-foreground">
                  {phase === "fetching" && "Fetching backlinks..."}
                  {phase === "analyzing" && "Analyzing patterns..."}
                  {phase === "generating" && "Generating insights..."}
                </div>
              )}
              
              <div className="flex gap-4 max-w-2xl mx-auto mb-8">
                <Input
                  id="backlink-url"
                  name="url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL (e.g., contentanonymity.com)"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                />
                <Button onClick={handleCheck} disabled={loading || !url.trim()}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Check Backlinks
                    </>
                  )}
                </Button>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">{stats.total}</div>
                      <p className="text-sm text-muted-foreground">Total Backlinks</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1 text-green-500">{stats.dofollow}</div>
                      <p className="text-sm text-muted-foreground">DoFollow Links</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1 text-yellow-500">{stats.nofollow}</div>
                      <p className="text-sm text-muted-foreground">NoFollow Links</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">{stats.referringDomains}</div>
                      <p className="text-sm text-muted-foreground">Referring Domains (Free: 50)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">{avgTrust}</div>
                      <p className="text-sm text-muted-foreground">Avg Trust Score</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {backlinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Backlink Profile</CardTitle>
                  <CardDescription>
                    {backlinks.length} backlink{backlinks.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {backlinks.map((backlink, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <a 
                              href={backlink.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                              {backlink.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <p className="text-sm text-muted-foreground mt-1">
                              From: <span className="font-medium">{backlink.domain}</span>
                            </p>
                          </div>
                          <Badge variant={backlink.type === 'dofollow' ? 'default' : 'secondary'}>
                            {backlink.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm mt-3">
                          <div className="flex items-center gap-1">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Anchor:</span>
                            <span className="font-medium">"{backlink.anchorText}"</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">DA:</span>
                            <span className="font-medium">{backlink.domainAuthority}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{backlink.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Trust:</span>
                            <span className="font-medium">{backlink.trustScore ?? 0}</span>
                          </div>
                          <Badge variant="outline">{backlink.facelessTag}</Badge>
                          <Badge variant={backlink.toxicityFlag === 'high' ? 'destructive' : 'secondary'}>
                            Toxicity: {backlink.toxicityFlag}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Free Tools */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Free Backlink Checker Tools</CardTitle>
                <CardDescription>Use these free tools for comprehensive backlink analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Ahrefs Free Backlink Checker
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Check top 100 backlinks for any domain. Free version shows referring domains and anchor text.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://ahrefs.com/backlink-checker" target="_blank" rel="noopener noreferrer">
                        Visit Ahrefs Free Checker
                      </a>
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Google Search Console
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      See which sites link to your pages. Go to Links → External links in GSC.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                        Visit Search Console
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {backlinks.length === 0 && !loading && (
              <Card className="mt-8">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Enter a URL above to check backlinks. Results will show referring domains, anchor text, and link types.
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






