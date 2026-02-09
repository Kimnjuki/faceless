import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, CheckCircle2, Circle, ArrowRight, Video, BookOpen, Zap, Target, TrendingUp, DollarSign, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

interface JourneyStage {
  stage: number;
  title: string;
  duration: string;
  status: "locked" | "unlocked" | "completed";
  unlockCriteria?: string;
  modules: Array<{
    name: string;
    type: string;
    duration: string;
  }>;
  deliverable: string;
  communityChallenge?: string;
}

const journeyStages: JourneyStage[] = [
  {
    stage: 1,
    title: "Foundation Mindset",
    duration: "Week 1",
    status: "unlocked",
    modules: [
      { name: "The Psychology of Faceless Content", type: "video", duration: "18 min" },
      { name: "Understanding Fragment Communication", type: "interactive", duration: "12 min" },
      { name: "Building Empathy Without Presence", type: "case_study", duration: "15 min" },
      { name: "Mindset Assessment", type: "quiz", duration: "5 min" }
    ],
    deliverable: "Personal mindset blueprint",
    communityChallenge: "Share your 'why' anonymously"
  },
  {
    stage: 2,
    title: "Strategic Niche Selection",
    duration: "Week 1-2",
    status: "unlocked",
    modules: [
      { name: "RPM Tier Deep Dive", type: "interactive_calculator", duration: "20 min" },
      { name: "Niche Validation Framework", type: "workbook", duration: "30 min" },
      { name: "Competitor Analysis Toolkit", type: "tool", duration: "25 min" },
      { name: "AI-Powered Niche Discovery", type: "ai_assistant", duration: "15 min" }
    ],
    deliverable: "Validated niche selection document",
    communityChallenge: "Present your niche for peer review"
  },
  {
    stage: 3,
    title: "Professional Tool Stack",
    duration: "Week 2-3",
    status: "locked",
    unlockCriteria: "Complete Stage 2",
    modules: [
      { name: "Tool Stack Builder", type: "interactive_tool", duration: "30 min" },
      { name: "ChatGPT Prompt Library", type: "resource", duration: "15 min" },
      { name: "ElevenLabs Voice Cloning Tutorial", type: "video", duration: "22 min" },
      { name: "Midjourney Style Guide", type: "interactive_guide", duration: "30 min" }
    ],
    deliverable: "Configured tool stack + workflow"
  },
  {
    stage: 4,
    title: "Profile Optimization & Branding",
    duration: "Week 3",
    status: "locked",
    unlockCriteria: "Complete Stage 3",
    modules: [
      { name: "AI Logo Generator", type: "tool", duration: "20 min" },
      { name: "Username Availability Checker", type: "tool", duration: "10 min" },
      { name: "Bio Optimization Framework", type: "interactive", duration: "25 min" },
      { name: "Brand Voice Calibrator", type: "ai_tool", duration: "15 min" }
    ],
    deliverable: "Complete brand identity package"
  },
  {
    stage: 5,
    title: "Content Production Workflow",
    duration: "Week 4-6",
    status: "locked",
    unlockCriteria: "Complete Stage 4",
    modules: [
      { name: "Viral Content Matrix", type: "interactive_tool", duration: "30 min" },
      { name: "Batch Production System", type: "video_course", duration: "45 min" },
      { name: "Editing Shortcuts Masterclass", type: "hands_on", duration: "40 min" },
      { name: "Content Quality Scorecard", type: "assessment_tool", duration: "20 min" }
    ],
    deliverable: "First 10 content pieces"
  },
  {
    stage: 6,
    title: "Algorithm Mastery",
    duration: "Week 6-8",
    status: "locked",
    unlockCriteria: "Complete Stage 5",
    modules: [
      { name: "Platform Algorithm Decoder", type: "interactive_course", duration: "35 min" },
      { name: "Thumbnail A/B Testing Lab", type: "tool", duration: "25 min" },
      { name: "Engagement Velocity Calculator", type: "analytics_tool", duration: "20 min" },
      { name: "Hashtag Strategy Builder", type: "ai_tool", duration: "30 min" }
    ],
    deliverable: "Platform-specific growth strategy"
  },
  {
    stage: 7,
    title: "Diversified Monetization",
    duration: "Week 8-10",
    status: "locked",
    unlockCriteria: "Complete Stage 6",
    modules: [
      { name: "Revenue Stream Evaluator", type: "interactive_calculator", duration: "30 min" },
      { name: "Digital Product Creator Suite", type: "tool_integration", duration: "40 min" },
      { name: "Brand Deal Pitch Generator", type: "ai_tool", duration: "25 min" },
      { name: "Newsletter Monetization Blueprint", type: "course", duration: "45 min" }
    ],
    deliverable: "3 active revenue streams"
  },
  {
    stage: 8,
    title: "Scaling & Automation",
    duration: "Week 10-12",
    status: "locked",
    unlockCriteria: "Complete Stage 7",
    modules: [
      { name: "Outsourcing Framework", type: "guide", duration: "35 min" },
      { name: "Content Calendar Automation", type: "tool", duration: "30 min" },
      { name: "Multi-Account Management", type: "course", duration: "35 min" },
      { name: "Growth Forecasting Model", type: "spreadsheet_tool", duration: "25 min" }
    ],
    deliverable: "Automated content system"
  }
];

const stageIcons = [
  Target, // Stage 1
  TrendingUp, // Stage 2
  Zap, // Stage 3
  Rocket, // Stage 4
  Video, // Stage 5
  TrendingUp, // Stage 6
  DollarSign, // Stage 7
  Rocket // Stage 8
];

export default function InteractiveJourneyMap() {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "unlocked":
        return <Unlock className="h-5 w-5 text-primary" />;
      default:
        return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "interactive":
      case "interactive_tool":
      case "interactive_calculator":
        return <Zap className="h-4 w-4" />;
      case "quiz":
      case "assessment_tool":
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {journeyStages.map((stage, idx) => {
        const StageIcon = stageIcons[idx];
        const isExpanded = expandedStage === stage.stage;
        
        return (
          <Card 
            key={stage.stage}
            className={`cursor-pointer transition-all ${
              stage.status === "locked" 
                ? "opacity-60" 
                : isExpanded 
                  ? "border-primary border-2" 
                  : "hover:border-primary/50"
            }`}
            onClick={() => stage.status !== "locked" && setExpandedStage(isExpanded ? null : stage.stage)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    stage.status === "completed" 
                      ? "bg-green-500/10" 
                      : stage.status === "unlocked" 
                        ? "bg-primary/10" 
                        : "bg-muted"
                  }`}>
                    {stage.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <StageIcon className={`h-6 w-6 ${
                        stage.status === "unlocked" ? "text-primary" : "text-muted-foreground"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl">Stage {stage.stage}: {stage.title}</CardTitle>
                      {getStatusIcon(stage.status)}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span>{stage.duration}</span>
                      {stage.status === "locked" && stage.unlockCriteria && (
                        <Badge variant="outline" className="text-xs">
                          {stage.unlockCriteria}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={stage.status === "completed" ? "default" : "secondary"}>
                  {stage.modules.length} modules
                </Badge>
              </div>
            </CardHeader>
            
            {isExpanded && stage.status !== "locked" && (
              <CardContent className="space-y-4 pt-0">
                <div>
                  <h4 className="font-semibold mb-3">Modules in this stage:</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {stage.modules.map((module, moduleIdx) => (
                      <div 
                        key={moduleIdx}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                      >
                        {getModuleIcon(module.type)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{module.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{module.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {module.type.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium mb-1">Deliverable:</p>
                      <p className="text-sm text-muted-foreground">{stage.deliverable}</p>
                      {stage.communityChallenge && (
                        <>
                          <p className="text-sm font-medium mt-3 mb-1">Community Challenge:</p>
                          <p className="text-sm text-muted-foreground">{stage.communityChallenge}</p>
                        </>
                      )}
                    </div>
                    <Button asChild>
                      <Link to={`/learning-paths/stage-${stage.stage}`}>
                        Start Stage {stage.stage} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
