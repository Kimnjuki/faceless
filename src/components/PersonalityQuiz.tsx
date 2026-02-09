import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, X, CheckCircle2, Target, Zap, Users, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizQuestion {
  id: string;
  text: string;
  type: "single_choice" | "multi_choice";
  options: string[];
}

interface QuizResults {
  archetype: string;
  description: string;
  recommendedNiches: string[];
  learningPath: string;
  toolsNeeded: string[];
  roadmap: {
    timeline: string;
    milestones: Array<{
      day: string;
      title: string;
      tasks: string[];
    }>;
  };
}

const questions: QuizQuestion[] = [
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

const archetypes: Record<string, QuizResults> = {
  "strategic_educator": {
    archetype: "The Strategic Educator",
    description: "You excel at breaking down complex topics into digestible, valuable content. Your strength lies in teaching and helping others understand difficult concepts.",
    recommendedNiches: ["Personal Finance", "Business", "Technology"],
    learningPath: "educational_content_mastery",
    toolsNeeded: ["CapCut", "ChatGPT Plus", "Canva Pro"],
    roadmap: {
      timeline: "90 days",
      milestones: [
        {
          day: "1-14",
          title: "Foundation & Setup",
          tasks: ["Complete niche validation", "Set up accounts", "Learn tool basics"]
        },
        {
          day: "15-30",
          title: "First Content Creation",
          tasks: ["Create 10 test videos", "Analyze performance", "Refine strategy"]
        },
        {
          day: "31-60",
          title: "Growth & Optimization",
          tasks: ["Scale to 3-5 videos/week", "Build audience", "Test monetization"]
        },
        {
          day: "61-90",
          title: "Monetization & Automation",
          tasks: ["Launch revenue streams", "Automate workflows", "Plan scaling"]
        }
      ]
    }
  },
  "visual_storyteller": {
    archetype: "The Visual Storyteller",
    description: "You create compelling narratives through visuals. Your content captivates audiences with engaging stories, mystery, and visual appeal.",
    recommendedNiches: ["True Crime", "Mystery", "Documentaries"],
    learningPath: "visual_storytelling_excellence",
    toolsNeeded: ["InVideo", "ElevenLabs", "Midjourney"],
    roadmap: {
      timeline: "90 days",
      milestones: [
        {
          day: "1-14",
          title: "Foundation & Setup",
          tasks: ["Complete niche validation", "Set up accounts", "Learn tool basics"]
        },
        {
          day: "15-30",
          title: "First Content Creation",
          tasks: ["Create 10 test videos", "Analyze performance", "Refine strategy"]
        },
        {
          day: "31-60",
          title: "Growth & Optimization",
          tasks: ["Scale to 3-5 videos/week", "Build audience", "Test monetization"]
        },
        {
          day: "61-90",
          title: "Monetization & Automation",
          tasks: ["Launch revenue streams", "Automate workflows", "Plan scaling"]
        }
      ]
    }
  },
  "productivity_automator": {
    archetype: "The Productivity Automator",
    description: "You thrive on systems and scalability. Efficiency and automation are your superpowers, allowing you to create more content in less time.",
    recommendedNiches: ["Productivity", "AI Tools", "Entrepreneurship"],
    learningPath: "automation_and_scale",
    toolsNeeded: ["Clippie AI", "Make.com", "ManyChat"],
    roadmap: {
      timeline: "90 days",
      milestones: [
        {
          day: "1-14",
          title: "Foundation & Setup",
          tasks: ["Complete niche validation", "Set up accounts", "Learn tool basics"]
        },
        {
          day: "15-30",
          title: "First Content Creation",
          tasks: ["Create 10 test videos", "Analyze performance", "Refine strategy"]
        },
        {
          day: "31-60",
          title: "Growth & Optimization",
          tasks: ["Scale to 3-5 videos/week", "Build audience", "Test monetization"]
        },
        {
          day: "61-90",
          title: "Monetization & Automation",
          tasks: ["Launch revenue streams", "Automate workflows", "Plan scaling"]
        }
      ]
    }
  },
  "community_builder": {
    archetype: "The Community Builder",
    description: "You create content that sparks conversation and builds engaged communities. Your strength is connecting with audiences on a deeper level.",
    recommendedNiches: ["Wellness", "Lifestyle", "Motivation"],
    learningPath: "engagement_driven_growth",
    toolsNeeded: ["Beehive", "ConvertKit", "Circle"],
    roadmap: {
      timeline: "90 days",
      milestones: [
        {
          day: "1-14",
          title: "Foundation & Setup",
          tasks: ["Complete niche validation", "Set up accounts", "Learn tool basics"]
        },
        {
          day: "15-30",
          title: "First Content Creation",
          tasks: ["Create 10 test videos", "Analyze performance", "Refine strategy"]
        },
        {
          day: "31-60",
          title: "Growth & Optimization",
          tasks: ["Scale to 3-5 videos/week", "Build audience", "Test monetization"]
        },
        {
          day: "61-90",
          title: "Monetization & Automation",
          tasks: ["Launch revenue streams", "Automate workflows", "Plan scaling"]
        }
      ]
    }
  }
};

interface PersonalityQuizProps {
  onComplete: (results: QuizResults) => void;
  onClose?: () => void;
}

export default function PersonalityQuiz({ onComplete, onClose }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (option: string) => {
    if (question.type === "single_choice") {
      const newAnswers = { ...answers, [question.id]: option };
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOptions([]);
        }, 300);
      } else {
        calculateResults(newAnswers);
      }
    } else {
      // Multi-choice handling
      const currentAnswers = (answers[question.id] as string[]) || [];
      let newAnswers: string[];
      
      if (selectedOptions.includes(option)) {
        newAnswers = selectedOptions.filter(o => o !== option);
      } else {
        newAnswers = [...selectedOptions, option];
      }
      
      setSelectedOptions(newAnswers);
      setAnswers({ ...answers, [question.id]: newAnswers });
    }
  };

  const handleMultiChoiceNext = () => {
    if (selectedOptions.length === 0) return;
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOptions([]);
      }, 300);
    } else {
      calculateResults(answers);
    }
  };

  const calculateResults = (finalAnswers: Record<string, string | string[]>) => {
    // Simple scoring algorithm - can be enhanced with ML
    const q1 = finalAnswers.q1 as string;
    const q3 = finalAnswers.q3 as string;
    const q5 = finalAnswers.q5 as string;
    
    let archetypeKey = "strategic_educator"; // default
    
    // Determine archetype based on answers
    if (q1 === "Educate and help others" || q5 === "Education & How-To") {
      archetypeKey = "strategic_educator";
    } else if (q1 === "Express creativity anonymously" || q5 === "Entertainment & Storytelling") {
      archetypeKey = "visual_storyteller";
    } else if (q1 === "Build a scalable business" || q3 === "Advanced marketer") {
      archetypeKey = "productivity_automator";
    } else if (q1 === "Express creativity anonymously" || q5 === "Health & Wellness") {
      archetypeKey = "community_builder";
    }
    
    const results = archetypes[archetypeKey];
    setTimeout(() => {
      setShowResults(true);
      onComplete(results);
    }, 500);
  };

  if (showResults) {
    const results = archetypes[Object.keys(archetypes)[0]]; // Get first archetype for now
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl mb-2">{results.archetype}</CardTitle>
          <CardDescription className="text-lg">{results.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Recommended Niches:</h3>
            <div className="flex flex-wrap gap-2">
              {results.recommendedNiches.map((niche) => (
                <Badge key={niche} variant="secondary">{niche}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Tools You'll Need:</h3>
            <div className="flex flex-wrap gap-2">
              {results.toolsNeeded.map((tool) => (
                <Badge key={tool}>{tool}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Your 90-Day Roadmap:</h3>
            <div className="space-y-4">
              {results.roadmap.milestones.map((milestone, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <Badge>{milestone.day}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {milestone.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button size="lg" className="flex-1" asChild>
              <Link to={`/learning-paths/${results.learningPath}`}>
                Start Your Learning Path <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={onClose}>
              Explore More
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      {onClose && (
        <div className="flex justify-end p-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl mb-2">What Type of Faceless Creator Are You?</CardTitle>
        <CardDescription>Answer 8 questions to get your personalized learning path</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">{question.text}</h3>
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = question.type === "single_choice" 
                ? answers[question.id] === option
                : selectedOptions.includes(option);
              
              return (
                <Button
                  key={idx}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start h-auto py-4 px-4 text-left"
                  onClick={() => handleAnswer(option)}
                >
                  <span className="flex-1">{option}</span>
                  {isSelected && <CheckCircle2 className="h-5 w-5 ml-2" />}
                </Button>
              );
            })}
          </div>
        </div>

        {question.type === "multi_choice" && (
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                  setSelectedOptions([]);
                }
              }}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleMultiChoiceNext}
              disabled={selectedOptions.length === 0}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
