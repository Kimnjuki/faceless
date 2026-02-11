import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Star, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Loader2,
  Target,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Id } from "../../../convex/_generated/dataModel";

export default function NicheDetail() {
  const { nicheId } = useParams<{ nicheId: string }>();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const niche = useQuery(
    api.niches.getById,
    hasConvex && nicheId ? { nicheId: nicheId as Id<"niches"> } : "skip"
  );

  const loading = hasConvex && nicheId && niche === undefined;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!niche) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Niche not found</h2>
              <p className="text-muted-foreground mb-4">
                The niche you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to="/resources/niches">Back to Niche Database</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const profitabilityScore = niche.profitabilityScore ?? 0;
  const evergreenScore = niche.evergreenScore ?? 0;

  return (
    <>
      <SEO
        title={`${niche.nicheName} - Profitable Faceless Niche Analysis | ContentAnonymity`}
        description={`Complete analysis of ${niche.nicheName} niche: profitability score ${profitabilityScore}/10, difficulty ${niche.difficultyLevel}, earnings potential ${niche.estimatedEarningsRange || 'high'}.`}
        url={`https://contentanonymity.com/niches/${nicheId}`}
        canonical={`https://contentanonymity.com/niches/${nicheId}`}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/resources/niches">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Niche Database
              </Link>
            </Button>

            {/* Header */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {niche.category && (
                        <Badge variant="secondary">{niche.category.name}</Badge>
                      )}
                      {niche.trendStatus && (
                        <Badge
                          variant={
                            niche.trendStatus === "rising"
                              ? "default"
                              : niche.trendStatus === "declining"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {niche.trendStatus === "rising" && (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          )}
                          {niche.trendStatus === "declining" && (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {niche.trendStatus}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-4xl mb-3">{niche.nicheName}</CardTitle>
                    {niche.description && (
                      <CardDescription className="text-lg">
                        {niche.description}
                      </CardDescription>
                    )}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Profitability</span>
                    </div>
                    <div className="text-3xl font-bold">{profitabilityScore}/10</div>
                    <Progress value={profitabilityScore * 10} className="mt-2" />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                    </div>
                    <div className="text-xl font-bold capitalize">
                      {niche.difficultyLevel || "Medium"}
                    </div>
                    <Badge variant="outline" className="mt-2 capitalize">
                      {niche.competitionLevel || "Medium"}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">Earnings</span>
                    </div>
                    <div className="text-lg font-bold">
                      {niche.estimatedEarningsRange || "High Potential"}
                    </div>
                    {niche.avgRpm && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Avg RPM: ${niche.avgRpm}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Evergreen</span>
                    </div>
                    <div className="text-3xl font-bold">{evergreenScore}/10</div>
                    <Progress value={evergreenScore * 10} className="mt-2" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs: Overview, Case Studies, Content Ideas, Tools */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="case-studies">
                  Case Studies ({niche.caseStudies?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="content-ideas">
                  Content Ideas ({niche.contentIdeas?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="tools">Tools & Resources</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {niche.targetAudience && (
                        <div>
                          <span className="text-sm font-medium">Target Audience:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {niche.targetAudience}
                          </p>
                        </div>
                      )}
                      {niche.primaryContentFocus && (
                        <div>
                          <span className="text-sm font-medium">Content Focus:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {niche.primaryContentFocus}
                          </p>
                        </div>
                      )}
                      {niche.startupCost && (
                        <div>
                          <span className="text-sm font-medium">Startup Cost:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {niche.startupCost}
                          </p>
                        </div>
                      )}
                      {niche.timeToMonetization && (
                        <div>
                          <span className="text-sm font-medium">Time to Monetization:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {niche.timeToMonetization}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Monetization Strategies */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monetization Strategies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {niche.monetizationStrategies ? (
                        <div className="space-y-2">
                          {Array.isArray(niche.monetizationStrategies) ? (
                            niche.monetizationStrategies.map((strategy: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="mr-2 mb-2">
                                {strategy}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {JSON.stringify(niche.monetizationStrategies)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Multiple revenue streams available
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Risks & Opportunities */}
                {niche.risks && niche.risks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Risks & Considerations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {niche.risks.map((risk: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Required Tools */}
                {niche.requiredTools && niche.requiredTools.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {niche.requiredTools.map((tool: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Case Studies Tab */}
              <TabsContent value="case-studies" className="space-y-4">
                {niche.caseStudies && niche.caseStudies.length > 0 ? (
                  niche.caseStudies.map((study: any) => (
                    <Card key={study._id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{study.channelName}</CardTitle>
                            <CardDescription className="mt-1">
                              {study.contentStyle || "Content Creator"}
                            </CardDescription>
                          </div>
                          {study.estimatedEarnings && (
                            <Badge className="bg-green-500">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${study.estimatedEarnings.toLocaleString()}/mo
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          {study.monthlyViews && (
                            <div>
                              <span className="text-sm text-muted-foreground">Monthly Views</span>
                              <div className="text-lg font-bold">
                                {study.monthlyViews.toLocaleString()}
                              </div>
                            </div>
                          )}
                          {study.subscribersCount && (
                            <div>
                              <span className="text-sm text-muted-foreground">Subscribers</span>
                              <div className="text-lg font-bold">
                                {study.subscribersCount.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                        {study.keySuccessFactors && study.keySuccessFactors.length > 0 && (
                          <div>
                            <span className="text-sm font-medium mb-2 block">
                              Key Success Factors:
                            </span>
                            <ul className="space-y-1">
                              {study.keySuccessFactors.map((factor: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {study.toolsUsed && study.toolsUsed.length > 0 && (
                          <div className="mt-4">
                            <span className="text-sm font-medium mb-2 block">Tools Used:</span>
                            <div className="flex flex-wrap gap-2">
                              {study.toolsUsed.map((tool: string, idx: number) => (
                                <Badge key={idx} variant="outline">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No case studies available yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Content Ideas Tab */}
              <TabsContent value="content-ideas" className="space-y-4">
                {niche.contentIdeas && niche.contentIdeas.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {niche.contentIdeas.map((idea: any) => (
                      <Card key={idea._id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{idea.contentTitle}</CardTitle>
                            {idea.contentFormat && (
                              <Badge variant="outline">{idea.contentFormat}</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {idea.seoPotential && (
                            <div>
                              <span className="text-xs text-muted-foreground">SEO Potential:</span>
                              <Badge variant="secondary" className="ml-2">
                                {idea.seoPotential}
                              </Badge>
                            </div>
                          )}
                          {idea.estimatedProductionTime && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{idea.estimatedProductionTime}</span>
                            </div>
                          )}
                          {idea.requiredTools && idea.requiredTools.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground mb-1 block">
                                Tools Needed:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {idea.requiredTools.map((tool: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No content ideas available yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Best AI Tools */}
                  {niche.bestAiTools && niche.bestAiTools.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Best AI Tools</CardTitle>
                        <CardDescription>
                          Recommended tools for this niche
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {niche.bestAiTools.map((tool: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="text-sm">{tool}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Required Tools */}
                  {niche.requiredTools && niche.requiredTools.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Required Tools</CardTitle>
                        <CardDescription>
                          Essential tools to get started
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {niche.requiredTools.map((tool: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{tool}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-semibold">Ready to Start?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use our tools to validate this niche and start creating content.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" asChild>
                        <Link to="/tools/calculator">Profitability Calculator</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/tools/niche-quiz">Niche Finder Quiz</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/resources/templates">Browse Templates</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
