import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { BookOpen, Wrench, Lightbulb, ArrowLeft, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import SEO from "../../components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { api } from "../../../convex/_generated/api";

type QuizResult = {
  niche: string;
  score: number;
  competition: string;
  rpm: string;
  demand: string;
  first1k: string;
};

type Tool = {
  _id: string;
  name: string;
  categoryId?: string;
  description?: string;
};

type LearningPath = {
  _id: string;
  name: string;
  difficultyLevel?: string;
  modules?: any[];
};

const NicheToToolCategories: Record<string, string[]> = {
  "Finance & Investing": ["AI Scripting/Writing", "Design & Thumbnails", "AI Video Generation"],
  "Tech & AI": ["AI Scripting/Writing", "AI Video Generation", "Generative Video (AI)"],
  "Business & Entrepreneurship": ["AI Scripting/Writing", "Repurposing/Automation", "Design & Thumbnails"],
  "Education & Explainers": ["AI Voiceover", "AI Video Creation", "AI Scripting/Writing"],
};

function toPlainTool(tool: any): Tool {
  return {
    _id: tool._id,
    name: tool.name,
    categoryId: tool.categoryId?._id ?? tool.categoryId,
    description: tool.description,
  };
}

export default function AiPlaybook() {
  const navigate = useNavigate();
  const track = useTrackEvent();
  const [result, setResult] = useState<QuizResult | null>(null);

  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const paths = useQuery(
    api.learningPaths.list,
    hasConvex ? { limit: 10 } : "skip"
  );
  const tools = useQuery(
    api.tools.list,
    hasConvex ? {} : "skip"
  );

  useEffect(() => {
    const stored = sessionStorage.getItem("quiz_result");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        setResult(null);
      }
    }
  }, []);

  useEffect(() => {
    if (result) {
      track("playbook_viewed", { niche: result.niche });
    }
  }, [result, track]);

  const recommendedPath = paths?.[0] ?? null;
  const recommendedTools = useMemoFilteredTools(tools?.map(toPlainTool), result);

  if (!result) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-20">
          <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Playbook Found</h1>
          <p className="text-muted-foreground mb-6">
            Complete the Niche Quiz to generate your personalized AI Playbook.
          </p>
          <Button onClick={() => navigate("/tools/niche-quiz")}>
            Take the Niche Quiz
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title="Your AI Playbook - Private Workspace"
        description="Your personalized faceless content starter kit."
        noindex
        canonical="https://contentanonymity.com/dashboard/playbook"
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Your AI Playbook</h1>
          <p className="text-muted-foreground">
            Personalized starter kit for <span className="font-medium text-foreground">{result.niche}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Match Score</div>
              <div className="text-3xl font-bold">{result.score}/100</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Competition</div>
              <div className="text-3xl font-bold">{result.competition}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Time to First $1K</div>
              <div className="text-3xl font-bold">{result.first1k}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Recommended Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendedPath ? (
              <div>
                <p className="font-medium text-lg mb-1">{recommendedPath.name}</p>
                <p className="text-sm text-muted-foreground mb-3">
                  {recommendedPath.modules?.length ?? 0} modules · {recommendedPath.difficultyLevel ?? "intermediate"}
                </p>
                <Button
                  onClick={() => navigate(`/learning-paths/${recommendedPath._id}`)}
                >
                  Start Learning
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No learning path available yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" /> Recommended Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendedTools.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommendedTools.map(tool => (
                  <div key={tool._id} className="p-3 rounded-lg border bg-muted/30">
                    <p className="font-medium text-sm mb-1">{tool.name}</p>
                    <Badge variant="secondary" className="text-xs">{tool.categoryId}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tools matched yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function useMemoFilteredTools(tools: Tool[] | undefined, result: QuizResult | null) {
  const categories = result
    ? NicheToToolCategories[result.niche] || ["AI Scripting/Writing", "Video Editing"]
    : ["AI Scripting/Writing", "Video Editing"];

  if (!tools) return [];
  return tools
    .filter(t => categories.includes(t.categoryId || ""))
    .slice(0, 3);
}
