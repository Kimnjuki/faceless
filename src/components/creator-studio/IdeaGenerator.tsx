import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";

export default function IdeaGenerator() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!niche.trim()) {
      toast.error("Please enter your niche");
      return;
    }

    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockIdeas = [
        `Top 5 ${niche} mistakes beginners make`,
        `How to start ${niche} in 2026`,
        `${niche} trends you need to know`,
        `The truth about ${niche} that no one tells you`,
        `Why ${niche} is the best side hustle`,
      ];
      
      setIdeas(mockIdeas);
      setIsGenerating(false);
      toast.success("Generated 30 ideas!");
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate ideas. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>AI Idea Generator</CardTitle>
          </div>
          <CardDescription>
            Generate 30 content ideas in 60 seconds. Powered by trending topics, competitor analysis, and search trends.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Your Niche *</Label>
              <Input
                id="niche"
                placeholder="e.g., Personal Finance, Tech Reviews"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="all">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="pinterest">Pinterest</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !niche.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate 30 Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Ideas */}
      {ideas.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Ideas ({ideas.length})</CardTitle>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ideas.map((idea, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <span className="text-sm">{idea}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      Use
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
