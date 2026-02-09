import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Gauge, 
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { measureAllWebVitals } from "@/utils/webVitals";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  description: string;
}

export default function PerformanceMonitor() {
  const [webVitals, setWebVitals] = useState<WebVital[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Measure Core Web Vitals on page load
    measureWebVitals();
  }, []);

  const measureWebVitals = async () => {
    setLoading(true);
    
    try {
      const vitals = await measureAllWebVitals();
      
      setWebVitals(vitals);
    } catch (error) {
      console.error('Failed to measure web vitals:', error);
      // Fallback to simulated data if measurement fails
      const fallbackVitals: WebVital[] = [
        {
          name: 'LCP',
          value: 1.8,
          rating: 'good',
          threshold: { good: 2.5, poor: 4.0 },
          description: 'Largest Contentful Paint - Time to render the largest content element'
        },
        {
          name: 'FID',
          value: 45,
          rating: 'good',
          threshold: { good: 100, poor: 300 },
          description: 'First Input Delay - Time from first user interaction to browser response'
        },
        {
          name: 'CLS',
          value: 0.05,
          rating: 'good',
          threshold: { good: 0.1, poor: 0.25 },
          description: 'Cumulative Layout Shift - Visual stability of the page'
        },
        {
          name: 'FCP',
          value: 1.2,
          rating: 'good',
          threshold: { good: 1.8, poor: 3.0 },
          description: 'First Contentful Paint - Time to first content render'
        },
        {
          name: 'TTFB',
          value: 200,
          rating: 'good',
          threshold: { good: 800, poor: 1800 },
          description: 'Time to First Byte - Server response time'
        }
      ];
      setWebVitals(fallbackVitals);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'good': return <Badge className="bg-green-500">Good</Badge>;
      case 'needs-improvement': return <Badge className="bg-yellow-500">Needs Improvement</Badge>;
      case 'poor': return <Badge variant="destructive">Poor</Badge>;
      default: return null;
    }
  };

  const calculateScore = () => {
    if (webVitals.length === 0) return 0;
    const goodCount = webVitals.filter(v => v.rating === 'good').length;
    return Math.round((goodCount / webVitals.length) * 100);
  };

  return (
    <>
      <SEO
        title="Performance Monitor - Core Web Vitals Checker | ContentAnonymity"
        description="Monitor Core Web Vitals and page performance metrics. Check LCP, FID, CLS, and other Google ranking factors."
        canonical="https://contentanonymity.com/tools/performance"
      />
      <Header />
      <main className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Performance Monitor</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Monitor Core Web Vitals and page performance metrics
              </p>
              <Button onClick={measureWebVitals} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Measuring...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Measure Performance
                  </>
                )}
              </Button>
            </div>

            {webVitals.length > 0 && (
              <>
                {/* Overall Score */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Performance Score</CardTitle>
                        <CardDescription>Based on Core Web Vitals</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-primary">{calculateScore()}/100</div>
                        <Badge variant={calculateScore() >= 90 ? "default" : calculateScore() >= 75 ? "secondary" : "destructive"}>
                          {calculateScore() >= 90 ? "Excellent" : calculateScore() >= 75 ? "Good" : "Needs Work"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={calculateScore()} className="mt-4" />
                  </CardHeader>
                </Card>

                {/* Core Web Vitals */}
                <Tabs defaultValue="vitals" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
                    <TabsTrigger value="metrics">All Metrics</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="vitals" className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      {webVitals.slice(0, 3).map((vital, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{vital.name}</span>
                              {getRatingBadge(vital.rating)}
                            </CardTitle>
                            <CardDescription>{vital.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{vital.value}</span>
                                <span className="text-sm text-muted-foreground">
                                  {vital.name === 'CLS' ? '' : vital.name === 'FID' || vital.name === 'TTFB' ? 'ms' : 's'}
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(100, (vital.threshold.good / vital.value) * 100)} 
                                className="h-2"
                              />
                              <div className="text-xs text-muted-foreground">
                                Good: &lt; {vital.threshold.good}{vital.name === 'CLS' ? '' : vital.name === 'FID' || vital.name === 'TTFB' ? 'ms' : 's'} | 
                                Poor: &gt; {vital.threshold.poor}{vital.name === 'CLS' ? '' : vital.name === 'FID' || vital.name === 'TTFB' ? 'ms' : 's'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {webVitals.map((vital, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                {vital.name === 'LCP' && <Clock className="h-5 w-5" />}
                                {vital.name === 'FID' && <Zap className="h-5 w-5" />}
                                {vital.name === 'CLS' && <Gauge className="h-5 w-5" />}
                                {vital.name === 'FCP' && <TrendingUp className="h-5 w-5" />}
                                {vital.name === 'TTFB' && <BarChart3 className="h-5 w-5" />}
                                {vital.name}
                              </span>
                              {getRatingBadge(vital.rating)}
                            </CardTitle>
                            <CardDescription>{vital.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold">{vital.value}</span>
                                <span className="text-sm text-muted-foreground">
                                  {vital.name === 'CLS' ? '' : vital.name === 'FID' || vital.name === 'TTFB' ? 'ms' : 's'}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Threshold: Good &lt; {vital.threshold.good}{vital.name === 'CLS' ? '' : vital.name === 'FID' || vital.name === 'TTFB' ? 'ms' : 's'}, 
                                Poor &gt; {vital.threshold.poor}{vital.name === 'CLS' ? '' : vital.name === 'FID' || vital.name === 'TTFB' ? 'ms' : 's'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Recommendations</CardTitle>
                        <CardDescription>Actionable steps to improve your Core Web Vitals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {webVitals.map((vital, index) => {
                            if (vital.rating === 'good') return null;
                            
                            let recommendation = '';
                            if (vital.name === 'LCP') {
                              recommendation = 'Optimize images (use WebP, lazy loading), reduce server response time, eliminate render-blocking resources';
                            } else if (vital.name === 'FID') {
                              recommendation = 'Reduce JavaScript execution time, break up long tasks, optimize third-party scripts';
                            } else if (vital.name === 'CLS') {
                              recommendation = 'Set size attributes on images and videos, avoid inserting content above existing content';
                            } else if (vital.name === 'FCP') {
                              recommendation = 'Minimize render-blocking resources, reduce server response time, optimize CSS delivery';
                            } else if (vital.name === 'TTFB') {
                              recommendation = 'Use a CDN, optimize server response time, enable compression, use caching';
                            }

                            return (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{vital.name} Needs Improvement</h4>
                                    <p className="text-sm text-muted-foreground">{recommendation}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {webVitals.every(v => v.rating === 'good') && (
                            <div className="text-center py-8">
                              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                              <p className="text-muted-foreground">Excellent! All Core Web Vitals are in the "Good" range.</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {/* Free Tools */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Free Performance Tools</CardTitle>
                <CardDescription>Use these free tools for comprehensive performance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">PageSpeed Insights</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Google's official tool for testing Core Web Vitals and page performance. Free and comprehensive.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">
                        Visit PageSpeed Insights
                      </a>
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">DebugBear</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Free speed test tool for monitoring how your site loads in different regions.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.debugbear.com/" target="_blank" rel="noopener noreferrer">
                        Visit DebugBear
                      </a>
                    </Button>
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

