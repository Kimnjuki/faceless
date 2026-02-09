import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import QuestionCard from "./QuestionCard";
import ResultsPage from "./ResultsPage";
import { calculateQuizResults, type QuizAnswers, type CreatorArchetype } from "./quizLogic";

export interface QuizQuestion {
  id: string;
  text: string;
  type: "single_choice" | "multi_choice";
  options: string[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    text: "What's your primary goal?",
    type: "single_choice",
    options: [
      "Generate passive income",
      "Build a scalable business",
      "Express creativity anonymously",
      "Educate and help others"
    ]
  },
  {
    id: "q2",
    text: "How much time can you dedicate weekly?",
    type: "single_choice",
    options: [
      "1-3 hours (side hustle)",
      "4-10 hours (part-time)",
      "11-20 hours (serious commitment)",
      "20+ hours (full-time)"
    ]
  },
  {
    id: "q3",
    text: "What's your current skill level?",
    type: "single_choice",
    options: [
      "Complete beginner",
      "Some social media experience",
      "Experienced content creator",
      "Advanced marketer"
    ]
  },
  {
    id: "q4",
    text: "Which content format excites you most?",
    type: "multi_choice",
    options: [
      "Short-form video (TikTok, Reels)",
      "Long-form YouTube videos",
      "Written content (blogs, newsletters)",
      "Audio (podcasts, voiceovers)",
      "Visual design (infographics, carousels)"
    ]
  },
  {
    id: "q5",
    text: "What's your preferred niche area?",
    type: "single_choice",
    options: [
      "Finance & Business",
      "Technology & AI",
      "Health & Wellness",
      "Education & How-To",
      "Entertainment & Storytelling",
      "Not sure yet"
    ]
  },
  {
    id: "q6",
    text: "What's your biggest challenge?",
    type: "single_choice",
    options: [
      "Coming up with content ideas",
      "Video editing skills",
      "Understanding algorithms",
      "Monetization strategies",
      "Consistency and motivation"
    ]
  },
  {
    id: "q7",
    text: "What's your budget for tools?",
    type: "single_choice",
    options: [
      "$0-50/month (bootstrap)",
      "$51-150/month (starter)",
      "$151-300/month (growth)",
      "$300+/month (scale)"
    ]
  },
  {
    id: "q8",
    text: "How do you prefer to learn?",
    type: "multi_choice",
    options: [
      "Video tutorials",
      "Step-by-step guides",
      "Interactive exercises",
      "Case studies",
      "Live workshops",
      "Community discussions"
    ]
  }
];

export default function PersonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<CreatorArchetype | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  const currentQ = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (answer: string | string[]) => {
    const newAnswers = {
      ...answers,
      [currentQ.id]: answer
    };
    setAnswers(newAnswers);

    // Check if this is the last question
    if (currentQuestion === QUIZ_QUESTIONS.length - 1) {
      handleComplete(newAnswers);
    } else {
      // Move to next question after a short delay for UX
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleComplete = async (finalAnswers: QuizAnswers) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const quizResult = calculateQuizResults(finalAnswers);
    setResult(quizResult);
    setIsComplete(true);
    setIsCalculating(false);

    // TODO: Save results to database
    // await saveQuizResults(quizResult);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setResult(null);
  };

  if (isCalculating) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Calculating Your Results...</h3>
          <p className="text-muted-foreground text-center">
            Analyzing your answers to find your perfect creator archetype
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isComplete && result) {
    return <ResultsPage result={result} onRestart={handleRestart} />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Badge variant="outline">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</Badge>
        </div>
        <CardTitle className="text-2xl">What Type of Faceless Creator Are You?</CardTitle>
        <CardDescription>
          Answer 8 questions to get your personalized learning path
        </CardDescription>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <QuestionCard
          question={currentQ}
          onAnswer={handleAnswer}
          previousAnswer={answers[currentQ.id]}
        />
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground flex items-center">
            {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
