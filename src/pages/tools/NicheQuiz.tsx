import { useState } from "react";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
        </div>
      </main>
      <Footer />
    </>
  );
}
