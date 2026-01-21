import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Zap,
  Globe,
  RefreshCw,
  Download
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  page: string;
  fix?: string;
}

interface PageAudit {
  url: string;
  title: string;
  h1Count: number;
  h1Text: string;
  metaDescription: string;
  metaDescriptionLength: number;
  imageCount: number;
  imagesWithoutAlt: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  loadTime: number;
  issues: SEOIssue[];
  score: number;
}

export default function SEOAudit() {
  const [url, setUrl] = useState("");
  const [auditing, setAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<PageAudit | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  const performAudit = async (targetUrl: string) => {
    setAuditing(true);
    setAuditResults(null);

    try {
      // In production, navigate to the URL first or use a server-side crawler
      // For now, audit the current page if URL matches
      const currentUrl = window.location.href;
      if (targetUrl !== currentUrl && !targetUrl.includes(window.location.hostname)) {
        // For external URLs, we'd need a server-side crawler
        // For now, show a message
        alert('To audit external URLs, please navigate to that page first, or use a server-side SEO crawler.');
        setAuditing(false);
        return;
      }

      // Import and use the SEO auditor utility
      const { auditPage } = await import('@/utils/seoAuditor');
      const auditResult = await auditPage(targetUrl);

      const result: PageAudit = {
        url: auditResult.url,
        title: auditResult.title,
        h1Count: auditResult.h1Count,
        h1Text: auditResult.h1Text.join(', '),
        metaDescription: auditResult.metaDescription,
        metaDescriptionLength: auditResult.metaDescriptionLength,
        imageCount: auditResult.imageCount,
        imagesWithoutAlt: auditResult.imagesWithoutAlt,
        wordCount: auditResult.wordCount,
        internalLinks: auditResult.internalLinks,
        externalLinks: auditResult.externalLinks,
        loadTime: auditResult.loadTime,
        issues: auditResult.issues,
        score: auditResult.score
      };

      setAuditResults(result);
      setOverallScore(result.score);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setAuditing(false);
    }
  };

  const handleAudit = () => {
    if (!url) return;
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    performAudit(targetUrl);
  };

  return (
    <>
      <SEO
        title="SEO Audit Tool - Free Technical SEO Checker | ContentAnonymity"
        description="Free SEO audit tool to check technical SEO issues, page performance, and optimization opportunities. Alternative to Ahrefs and Semrush."
      />
      <Header />
      <main className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Free SEO Audit Tool</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Technical SEO checker - Find and fix issues that hurt your rankings
              </p>
              
              <div className="flex gap-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL (e.g., contentanonymity.com/blog)"
                  className="flex-1 px-4 py-2 border rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAudit()}
                />
                <Button onClick={handleAudit} disabled={auditing || !url}>
                  {auditing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Auditing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Audit Page
                    </>
                  )}
                </Button>
              </div>
            </div>

            {auditResults && (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>SEO Score</CardTitle>
                        <CardDescription>Overall page optimization score</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-primary">{overallScore}/100</div>
                        <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}>
                          {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={overallScore} className="mt-4" />
                  </CardHeader>
                </Card>

                <Tabs defaultValue="issues" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="issues" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Found Issues</CardTitle>
                        <CardDescription>
                          {auditResults.issues.length} issue{auditResults.issues.length !== 1 ? 's' : ''} found
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {auditResults.issues.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                              <p>No issues found! Your page is well optimized.</p>
                            </div>
                          ) : (
                            auditResults.issues.map((issue, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                  issue.type === 'error' ? 'border-destructive bg-destructive/5' :
                                  issue.type === 'warning' ? 'border-yellow-500 bg-yellow-500/5' :
                                  'border-blue-500 bg-blue-500/5'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {issue.type === 'error' ? (
                                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                                  ) : issue.type === 'warning' ? (
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                  ) : (
                                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-semibold">{issue.message}</p>
                                    {issue.fix && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        <strong>Fix:</strong> {issue.fix}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="overview">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Content
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Word Count:</span>
                            <strong>{auditResults.wordCount}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>H1 Count:</span>
                            <strong>{auditResults.h1Count}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Meta Description:</span>
                            <strong>{auditResults.metaDescriptionLength} chars</strong>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5" />
                            Links
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Internal Links:</span>
                            <strong>{auditResults.internalLinks}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>External Links:</span>
                            <strong>{auditResults.externalLinks}</strong>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Images
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Images:</span>
                            <strong>{auditResults.imageCount}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Missing Alt Text:</span>
                            <strong className={auditResults.imagesWithoutAlt > 0 ? 'text-destructive' : 'text-green-500'}>
                              {auditResults.imagesWithoutAlt}
                            </strong>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Load Time:</span>
                            <strong className={auditResults.loadTime > 2.5 ? 'text-destructive' : 'text-green-500'}>
                              {auditResults.loadTime.toFixed(2)}s
                            </strong>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance">
                    <Card>
                      <CardHeader>
                        <CardTitle>Core Web Vitals</CardTitle>
                        <CardDescription>Google's ranking factors for page experience</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Largest Contentful Paint (LCP)</span>
                            <Badge variant={auditResults.loadTime <= 2.5 ? "default" : "destructive"}>
                              {auditResults.loadTime <= 2.5 ? "Good" : "Needs Improvement"}
                            </Badge>
                          </div>
                          <Progress value={Math.min(100, (2.5 / auditResults.loadTime) * 100)} />
                          <p className="text-sm text-muted-foreground mt-1">
                            Target: &lt; 2.5s | Current: {auditResults.loadTime.toFixed(2)}s
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations">
                    <Card>
                      <CardHeader>
                        <CardTitle>Optimization Recommendations</CardTitle>
                        <CardDescription>Actionable steps to improve your SEO score</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {auditResults.issues.map((issue, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h4 className="font-semibold mb-2">{issue.message}</h4>
                              <p className="text-sm text-muted-foreground">{issue.fix}</p>
                            </div>
                          ))}
                          {auditResults.issues.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              Great job! No critical issues found. Keep monitoring your page performance.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => performAudit(auditResults.url)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-audit Page
                  </Button>
                </div>
              </div>
            )}

            {/* Free Tools Section */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Free SEO Tools Stack</CardTitle>
                <CardDescription>Developer-friendly alternatives to premium SEO tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Screaming Frog (Free)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Crawl up to 500 URLs. Find broken links, duplicate content, and missing meta tags.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Google Search Console
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Free access to impressions, clicks, and average position data from Google.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      PageSpeed Insights
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Test Core Web Vitals and get performance recommendations.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Keyword Planner
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Free search volume data (requires Google Ads account, no ads needed).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

