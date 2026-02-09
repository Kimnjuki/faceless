import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, Copy, Sparkles, PenTool, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface HookTemplate {
  id: string;
  name: string;
  template: string;
  category: string;
}

const hookTemplates: HookTemplate[] = [
  {
    id: "1",
    name: "Question Hook",
    template: "Have you ever wondered [QUESTION]? In the next [TIME], I'll show you [SOLUTION].",
    category: "Educational"
  },
  {
    id: "2",
    name: "Shocking Stat Hook",
    template: "[PERCENTAGE]% of people don't know that [FACT]. Here's what you need to know...",
    category: "Educational"
  },
  {
    id: "3",
    name: "Story Hook",
    template: "I was [SITUATION] when I discovered [INSIGHT]. Let me share what I learned...",
    category: "Storytelling"
  },
  {
    id: "4",
    name: "Problem-Solution Hook",
    template: "Struggling with [PROBLEM]? Here's the [SOLUTION] that changed everything...",
    category: "Problem-Solution"
  },
  {
    id: "5",
    name: "Mystery Hook",
    template: "There's a secret about [TOPIC] that [AUTHORITY] don't want you to know...",
    category: "Mystery"
  },
  {
    id: "6",
    name: "Contrarian Hook",
    template: "Everyone says [COMMON_BELIEF], but here's why they're wrong...",
    category: "Contrarian"
  }
];

export default function ScriptGenerator() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("short");
  const [generatedScript, setGeneratedScript] = useState("");
  const [selectedHook, setSelectedHook] = useState<HookTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hookText, setHookText] = useState("");

  const handleGenerateHook = () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }
    
    // Simulate AI generation (replace with actual API call)
    setIsGenerating(true);
    setTimeout(() => {
      const template = hookTemplates[Math.floor(Math.random() * hookTemplates.length)];
      const generated = template.template
        .replace("[QUESTION]", `how ${topic} really works`)
        .replace("[TIME]", "60 seconds")
        .replace("[SOLUTION]", `the truth about ${topic}`)
        .replace("[PERCENTAGE]", "90")
        .replace("[FACT]", `${topic} is misunderstood`)
        .replace("[SITUATION]", `researching ${topic}`)
        .replace("[INSIGHT]", `something about ${topic}`)
        .replace("[PROBLEM]", topic)
        .replace("[SOLUTION]", `solution for ${topic}`)
        .replace("[TOPIC]", topic)
        .replace("[AUTHORITY]", "experts")
        .replace("[COMMON_BELIEF]", `you need X for ${topic}`);
      
      setHookText(generated);
      setSelectedHook(template);
      setIsGenerating(false);
      toast.success("Hook generated!");
    }, 1500);
  };

  const handleGenerateFullScript = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call to OpenAI
    try {
      // TODO: Replace with actual OpenAI API call
      // const response = await fetch('/api/generate-script', {
      //   method: 'POST',
      //   body: JSON.stringify({ topic, niche, tone, length })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockScript = `# ${topic}

## Hook
${hookText || `Have you ever wondered how ${topic} really works?`}

## Introduction
Welcome! Today we're diving deep into ${topic}. Whether you're a beginner or looking to level up, this guide will give you everything you need to know.

## Main Content
### Point 1: Understanding the Basics
${topic} is more than meets the eye. Here's what you need to understand...

### Point 2: Common Mistakes
Many people make these mistakes when dealing with ${topic}:
- Mistake 1
- Mistake 2
- Mistake 3

### Point 3: Best Practices
Here's how to do ${topic} the right way:
1. Step one
2. Step two
3. Step three

## Conclusion
So there you have it - everything you need to know about ${topic}. Remember, success comes from consistent action.

## Call to Action
If you found this helpful, make sure to [subscribe/follow] for more content like this. What questions do you have about ${topic}? Drop them in the comments below!`;

      setGeneratedScript(mockScript);
      setIsGenerating(false);
      toast.success("Script generated successfully!");
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate script. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript || hookText);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const content = generatedScript || hookText;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `script-${topic.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Script Generator</CardTitle>
          </div>
          <CardDescription>
            Generate hooks, outlines, or full scripts for your content. Powered by GPT-4.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Title *</Label>
              <Input
                id="topic"
                placeholder="e.g., How to start a faceless YouTube channel"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche">Niche (Optional)</Label>
              <Input
                id="niche"
                placeholder="e.g., Personal Finance, Tech, Wellness"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (30-60 sec)</SelectItem>
                  <SelectItem value="medium">Medium (2-5 min)</SelectItem>
                  <SelectItem value="long">Long (5-10 min)</SelectItem>
                  <SelectItem value="very-long">Very Long (10+ min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hook Templates */}
          <div>
            <Label>Hook Templates (100+ available)</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {hookTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedHook?.id === template.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedHook(template)}
                  className="justify-start"
                >
                  <PenTool className="h-3 w-3 mr-2" />
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleGenerateHook} disabled={isGenerating || !topic}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Hook
                </>
              )}
            </Button>
            <Button onClick={handleGenerateFullScript} disabled={isGenerating || !topic} variant="default">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Full Script
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      {(hookText || generatedScript) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedScript || hookText}
              onChange={(e) => {
                if (generatedScript) {
                  setGeneratedScript(e.target.value);
                } else {
                  setHookText(e.target.value);
                }
              }}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Generated content will appear here..."
            />
            <div className="mt-4 flex gap-2">
              <Badge variant="secondary">Export: TXT</Badge>
              <Badge variant="secondary">Export: PDF</Badge>
              <Badge variant="secondary">Export: Google Docs</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
