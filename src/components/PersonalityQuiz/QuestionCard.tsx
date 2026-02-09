import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { QuizQuestion } from "./PersonalityQuiz";

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string | string[]) => void;
  previousAnswer?: string | string[];
}

export default function QuestionCard({ question, onAnswer, previousAnswer }: QuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    previousAnswer 
      ? Array.isArray(previousAnswer) 
        ? previousAnswer 
        : [previousAnswer]
      : []
  );

  useEffect(() => {
    // Reset when question changes
    if (previousAnswer) {
      setSelectedAnswers(
        Array.isArray(previousAnswer) ? previousAnswer : [previousAnswer]
      );
    } else {
      setSelectedAnswers([]);
    }
  }, [question.id, previousAnswer]);

  const handleOptionClick = (option: string) => {
    if (question.type === "single_choice") {
      setSelectedAnswers([option]);
      onAnswer(option);
    } else {
      // Multi-choice
      const newAnswers = selectedAnswers.includes(option)
        ? selectedAnswers.filter(a => a !== option)
        : [...selectedAnswers, option];
      setSelectedAnswers(newAnswers);
      onAnswer(newAnswers);
    }
  };

  const isSelected = (option: string) => selectedAnswers.includes(option);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-6">{question.text}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:border-primary ${
              isSelected(option) 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-muted/50"
            }`}
            onClick={() => handleOptionClick(option)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="flex-1 text-left">{option}</span>
                {isSelected(option) ? (
                  <CheckCircle2 className="h-5 w-5 text-primary ml-3 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground ml-3 flex-shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {question.type === "multi_choice" && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Select all that apply • {selectedAnswers.length} selected
        </p>
      )}
    </div>
  );
}
