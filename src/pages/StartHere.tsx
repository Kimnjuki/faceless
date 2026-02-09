import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, PlayCircle, ArrowRight, CheckCircle2, Trophy, Target, Zap, Users, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PersonalityQuiz from "@/components/PersonalityQuiz";
import InteractiveJourneyMap from "@/components/InteractiveJourneyMap";

export default function StartHere() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleQuizComplete = (results: any) => {
    setQuizCompleted(true);
    setShowQuiz(false);
    // Save results to user profile/localStorage
    localStorage.setItem('personality_quiz_results', JSON.stringify(results));
  };

  return (
    <>
      <SEO
        title="Your Faceless Content Journey Begins Here | ContentAnonymity"
        description="Build a profitable faceless brand in 90 days. From complete beginner to monetized creator with our AI-powered learning system. Take the quiz to get started."
        keywords="faceless content creator, anonymous content business, faceless brand, faceless content journey, AI content creation"
        url="https://contentanonymity.com/start-here"
        canonical="https://contentanonymity.com/start-here"
        breadcrumbItems={[{ name: 'Start Here', url: 'https://contentanonymity.com/start-here' }]}
      />
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4" variant="secondary">
                Welcome to Your Journey
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Build a Profitable Faceless Brand in 90 Days
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                From complete beginner to monetized creator with our AI-powered learning system
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  onClick={() => setShowQuiz(true)}
                  className="text-lg px-8 py-6"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Take the Quiz
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowVideoModal(true)}
                  className="text-lg px-8 py-6"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch 2-Min Overview
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-2">12,847</div>
                    <div className="text-sm text-muted-foreground">Active Creators</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-2">$2.4M+</div>
                    <div className="text-sm text-muted-foreground">Total Revenue Generated</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Personality Quiz Section */}
        {showQuiz && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <PersonalityQuiz 
                onComplete={handleQuizComplete}
                onClose={() => setShowQuiz(false)}
              />
            </div>
          </section>
        )}

        {/* Interactive Journey Map */}
        {!showQuiz && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Your 8-Stage Journey to $5K/Month
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Click each stage to explore what you'll learn
                  </p>
                </div>
                <InteractiveJourneyMap />
              </div>
            </div>
          </section>
        )}

        {/* Quick Start Options */}
        {!showQuiz && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Not Ready for the Full Journey?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Start with these focused learning sprints
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Viral Video Framework</CardTitle>
                      <CardDescription>2 hours • Free</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your first viral-worthy video
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/learning-paths">Start Free</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Niche Selection Sprint</CardTitle>
                      <CardDescription>3 hours • Free</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Find your profitable niche today
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/tools/niche-quiz">Start Free</Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>First $100 Challenge</CardTitle>
                      <CardDescription>7 days • $27</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Make your first dollar online
                      </p>
                      <Button className="w-full" asChild>
                        <Link to="/challenge/first-100">Join Challenge</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
            <div className="bg-background rounded-lg max-w-4xl w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">2-Minute Platform Overview</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowVideoModal(false)}>
                  ×
                </Button>
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Video embed placeholder - Add your overview video URL here</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
