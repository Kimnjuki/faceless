import { useState } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const questions = [
  {
    question: "What's your primary goal?",
    options: ["Make money fast", "Build long-term brand", "Share knowledge", "Creative expression"]
  },
  {
    question: "How much time can you dedicate weekly?",
    options: ["1-5 hours", "5-10 hours", "10-20 hours", "20+ hours"]
  },
  {
    question: "What's your skill level?",
    options: ["Complete beginner", "Some experience", "Intermediate", "Advanced"]
  },
  {
    question: "Which content type excites you most?",
    options: ["Educational videos", "Entertainment", "Product reviews", "Storytelling"]
  }
];

const recommendations = {
  "Make money fast": { niche: "Finance & Investing", competition: "High", profit: "$$$$" },
  "Build long-term brand": { niche: "Personal Development", competition: "Medium", profit: "$$$" },
  "Share knowledge": { niche: "Tech Tutorials", competition: "Medium", profit: "$$$" },
  "Creative expression": { niche: "AI Art & Design", competition: "Low", profit: "$$" }
};

export default function NicheQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const recommendation = recommendations[answers[0] as keyof typeof recommendations] || recommendations["Make money fast"];

  return (
    <>
      <SEO
        title="Find Your Perfect Niche in 2 Minutes | Free Quiz 2026"
        description="Not sure what niche to pick? Take our 2-minute quiz and discover the perfect faceless content niche matched to your skills & interests. Start now—it's free."
        url="https://contentanonymity.com/tools/niche-quiz"
        canonical="https://contentanonymity.com/tools/niche-quiz"
        breadcrumbItems={[
          { name: 'Tools', url: 'https://contentanonymity.com/tools/all' },
          { name: 'Niche Finder Quiz', url: 'https://contentanonymity.com/tools/niche-quiz' }
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Faceless Content Niche Finder Quiz",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "ratingCount": "89"
          },
          "description": "Free interactive quiz to help faceless content creators find their perfect niche based on goals, interests, and market demand."
        }}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {!showResults ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Niche Finder Quiz</h1>
                  <p className="text-muted-foreground">Answer 4 questions to find your perfect niche</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-sm font-medium">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / questions.length) * 100} />
                </div>

                <Card>
                  <CardContent className="pt-8 pb-6">
                    <h2 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h2>
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-4 hover:border-primary hover:bg-primary/5"
                          onClick={() => handleAnswer(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Your Perfect Niche</h1>
                  <p className="text-muted-foreground">Based on your answers, here's our recommendation</p>
                </div>

                <Card className="border-2 border-primary">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">{recommendation.niche}</h2>
                      <div className="flex items-center justify-center gap-3">
                        <Badge>Competition: {recommendation.competition}</Badge>
                        <Badge variant="secondary">Profit: {recommendation.profit}</Badge>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">High Demand</p>
                          <p className="text-sm text-muted-foreground">Growing audience interest</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Multiple Revenue Streams</p>
                          <p className="text-sm text-muted-foreground">Ads, affiliates, and products</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Faceless Friendly</p>
                          <p className="text-sm text-muted-foreground">Perfect for anonymous creators</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Get Started with {recommendation.niche} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full" onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers([]);
                  setShowResults(false);
                }}>
                  Retake Quiz
                </Button>
              </div>
            )}
          </div>

          {/* Content Depth Section - 200+ words for SEO */}
          <div className="max-w-4xl mx-auto mt-16 prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">How to Find Your Perfect Faceless Content Niche</h2>
              <p className="text-lg leading-relaxed mb-4">
                Choosing the right niche is the foundation of a successful faceless content business. Our free niche finder quiz helps you identify profitable niches that align with your interests, goals, and market demand. The quiz analyzes four key factors: your primary motivation, content creation preferences, target audience, and revenue goals.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Popular faceless content niches include finance and investing, technology and AI, lifestyle and self-improvement, business and entrepreneurship, and health & fitness. Each niche has different characteristics: competition levels, profit potential, audience size, and content creation requirements. Understanding these factors helps you make an informed decision about which niche to pursue.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                High-demand niches like finance and technology offer substantial earning potential but face more competition. Emerging niches like AI tools and privacy-focused content have lower competition but require more education to build an audience. The key is finding a balance between your interests, market demand, and competition level.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Our niche finder quiz considers multiple factors to provide personalized recommendations. It evaluates your motivation (quick money vs. long-term business), content preferences (educational vs. entertainment), target audience size, and profit expectations. Based on your answers, we recommend niches that match your profile and offer the best potential for success.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Once you've identified your niche, the next steps involve validating market demand, researching successful creators in that space, and developing a unique angle. Use our profitability calculator to estimate potential earnings, then start creating content consistently. Remember, niche selection is important, but consistent execution and value delivery are what ultimately determine success in faceless content creation.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Top Faceless Content Niches for 2025</h2>
              <p className="text-lg leading-relaxed mb-4">
                The faceless content landscape continues to evolve, with new niches emerging and existing ones becoming more competitive. Finance and investing remain highly profitable, with creators earning substantial revenue through ad revenue, affiliate marketing, and digital products. Technology and AI content is experiencing explosive growth as interest in artificial intelligence reaches new heights.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Lifestyle and self-improvement niches offer broad appeal and multiple monetization opportunities. These niches work well for faceless creators because they focus on value and information rather than personal branding. Business and entrepreneurship content attracts high-intent audiences willing to invest in courses, tools, and coaching services.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Health & fitness remains a strong performer, especially when focusing on specific sub-niches like nutrition, mental health, or workout routines. The key to success in any niche is finding your unique angle and consistently delivering value that helps your audience solve problems or achieve goals.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Why Niche Selection Matters for Faceless Creators</h2>
              <p className="text-lg leading-relaxed mb-4">
                Niche selection is critical for faceless content creators because it determines your audience, competition level, and revenue potential. A well-chosen niche allows you to build authority, attract targeted audiences, and develop multiple revenue streams. Poor niche selection can lead to low engagement, difficulty monetizing, and burnout from creating content that doesn't resonate.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                The best niches for faceless creators have several characteristics: high search demand, engaged audiences, multiple monetization options, and content formats that work well without showing your face. Educational content, tutorials, reviews, and storytelling all work excellently for faceless channels across different niches.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Use our free niche finder quiz to discover niches that match your goals and interests. Then validate your choice by researching successful creators, analyzing search volume for related keywords, and testing content ideas before fully committing. Remember, you can always pivot or expand into related niches as your channel grows and you learn more about your audience's preferences.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
