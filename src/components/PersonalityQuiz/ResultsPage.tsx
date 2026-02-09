import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, ArrowRight, RotateCcw, BookOpen, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { CreatorArchetype, generatePersonalizedRoadmap } from "./quizLogic";

interface ResultsPageProps {
  result: CreatorArchetype;
  onRestart: () => void;
}

export default function ResultsPage({ result, onRestart }: ResultsPageProps) {
  const roadmap = generatePersonalizedRoadmap(result);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Header */}
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <Badge className="text-sm">Your Creator Archetype</Badge>
          </div>
          <CardTitle className="text-3xl md:text-4xl mb-4">
            You're {result.type}!
          </CardTitle>
          <CardDescription className="text-lg">
            {result.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Recommended Niches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Niches for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.recommendedNiches.map((niche, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                {niche}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools Needed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recommended Tools
          </CardTitle>
          <CardDescription>
            These tools will help you succeed as a {result.type}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {result.toolsNeeded.map((tool, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{tool}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Strengths */}
      <Card>
        <CardHeader>
          <CardTitle>Your Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your 90-Day Roadmap
          </CardTitle>
          <CardDescription>
            A personalized plan to get you from zero to monetized creator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmap.milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-primary/30">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{milestone.title}</h4>
                    <Badge variant="outline">{milestone.day} days</Badge>
                  </div>
                  <ul className="space-y-1 ml-4">
                    {milestone.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Your Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="flex-1" asChild>
          <Link to={`/learning-paths?path=${result.learningPath}`}>
            Start Your Learning Path
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" onClick={onRestart}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Quiz
        </Button>
      </div>

      {/* Save Results CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Save Your Results</h3>
            <p className="text-sm text-muted-foreground">
              Create a free account to save your quiz results and get personalized recommendations
            </p>
            <Button asChild>
              <Link to="/auth/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
