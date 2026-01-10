import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, PlayCircle, FileText, Zap, BookOpen, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLearningPaths } from "@/hooks/useLearningPaths";

export default function GettingStarted() {
  const { paths, loading } = useLearningPaths({ featured: true });
  const featuredPaths = paths.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Getting Started</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Roadmap to Faceless Content Success
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Follow this proven 4-step system to launch your faceless content business in the next 30 days
            </p>
            <Button size="lg" asChild>
              <Link to="/auth/signup">
                Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2">Step 1</Badge>
                    <CardTitle className="text-2xl mb-2">Choose Your Profitable Niche</CardTitle>
                    <CardDescription>Week 1 • 2-3 hours</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Select a niche that matches your interests and has proven profit potential. We'll help you analyze competition, audience size, and monetization opportunities.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Take our Niche Finder Quiz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Research competition and audience demand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Validate profitability with our calculator</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button asChild>
                    <Link to="/tools/niche-quiz">
                      <PlayCircle className="mr-2 h-4 w-4" /> Start Niche Quiz
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/tools/calculator">
                      <Zap className="mr-2 h-4 w-4" /> Use Calculator
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2">Step 2</Badge>
                    <CardTitle className="text-2xl mb-2">Set Up Your Content System</CardTitle>
                    <CardDescription>Week 2 • 5-7 hours</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get the right tools and templates to create professional content efficiently. No expensive software required to start.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Choose your AI tools (voice, video, editing)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Download our content templates and scripts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Set up your channel/profile properly</span>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/tools/all">
                    <FileText className="mr-2 h-4 w-4" /> View Tool Comparison
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2">Step 3</Badge>
                    <CardTitle className="text-2xl mb-2">Create Your First 10 Videos</CardTitle>
                    <CardDescription>Week 3-4 • 10-15 hours</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Follow our proven content frameworks to batch-create your first videos. Quality over quantity, but consistency is key.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Use our script templates for your niche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Create content following our checklist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Get feedback from the community</span>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/dashboard/courses">
                    <PlayCircle className="mr-2 h-4 w-4" /> Access Courses
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2">Step 4</Badge>
                    <CardTitle className="text-2xl mb-2">Launch & Monetize</CardTitle>
                    <CardDescription>Ongoing • Scale as you grow</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Publish consistently, analyze performance, and activate multiple revenue streams. Your first $1K is just the beginning.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Post 3-5 times per week consistently</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Set up monetization (ads, affiliates, products)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Scale what works, optimize what doesn't</span>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/products/all">
                    <Zap className="mr-2 h-4 w-4" /> View Monetization Options
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Learning Paths */}
      {!loading && featuredPaths.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4">Recommended Learning Paths</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Start Your Learning Journey
                </h2>
                <p className="text-lg text-muted-foreground">
                  Follow these structured paths to master faceless content creation
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {featuredPaths.map((path) => (
                  <Card key={path.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        {path.difficulty_level && (
                          <Badge variant="outline" className="capitalize">
                            {path.difficulty_level}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{path.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {path.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {path.estimated_duration && (
                            <span>{path.estimated_duration}</span>
                          )}
                          {path.modules && path.modules.length > 0 && (
                            <span>{path.modules.length} modules</span>
                          )}
                        </div>
                        <Button asChild>
                          <Link to={`/learning-paths/${path.id}`}>
                            Start Path <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/learning-paths">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Learning Paths
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Faceless Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join 10,000+ creators building profitable faceless content businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
