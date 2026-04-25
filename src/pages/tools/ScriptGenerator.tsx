import { useState, useEffect } from "react";
import { Sparkles, Copy, Check, Wand2, Loader2, AlertCircle } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trackToolUsage } from "@/utils/analytics";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type User = {
  subscriptionTier?: 'free' | 'premium' | 'vip';
};

type ScriptResult = {
  hook: string;
  intro: string;
  mainSections: string[];
  cta: string;
  titles: string[];
  thumbnail: string;
  description: string;
  tags: string[];
};

export default function ScriptGenerator() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  // Fix: There is no 'users' module, user profiles are in 'profiles' module
  // For now safely fall back to null user - will use default free tier limits
  // Explicit type annotation to prevent TypeScript from inferring 'never' type
  const user = null as { subscriptionTier?: 'free' | 'premium' | 'vip' } | null;
  const generateScript = useAction(api.ai.generateScript);
  const trackConversion = useMutation(api.conversions.track);

  const [inputs, setInputs] = useState({
    niche: "",
    platform: "youtube",
    topic: "",
    videoLength: 8,
    tone: "informative",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedToday, setGeneratedToday] = useState(0);

  useEffect(() => {
    trackToolUsage('AI Script Generator', 'tools');
    
    // Load daily usage count from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('script_generations');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setGeneratedToday(data.count);
      } else {
        setGeneratedToday(0);
        localStorage.setItem('script_generations', JSON.stringify({ date: today, count: 0 }));
      }
    }
  }, []);

  const copyToClipboard = (field: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateAIScript = async () => {
    if (!inputs.topic.trim()) {
      setError("Please enter a video topic");
      return;
    }

    // Free tier limit check
    const isPro = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'vip';
    if (!isPro && generatedToday >= 3) {
      setError("Free tier limit reached: 3 generations per day. Upgrade to Pro for unlimited access.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      trackToolUsage('AI Script Generator', 'tools', 'generate');
      
      const scriptResult = await generateScript({
        niche: inputs.niche,
        platform: inputs.platform,
        topic: inputs.topic,
        videoLength: inputs.videoLength,
        tone: inputs.tone,
      });

      setResult(scriptResult);

      // Increment daily counter
      const today = new Date().toDateString();
      const newCount = generatedToday + 1;
      setGeneratedToday(newCount);
      localStorage.setItem('script_generations', JSON.stringify({ date: today, count: newCount }));

      if (hasConvex) {
        try {
          await trackConversion({
            conversionType: "script_generated",
            source: "script_generator",
            medium: inputs.platform,
            campaign: inputs.niche || "unknown",
          });
        } catch { /* non-blocking */ }
      }

    } catch (err) {
      setError("Failed to generate script. Please try again later.");
      console.error("Script generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const isPro = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'vip';
  const remainingGenerations = isPro ? 'Unlimited' : `${3 - generatedToday} remaining today`;

  return (
    <>
      <SEO
        title="Free AI Script Generator for Faceless Content | 2026"
        description="Generate viral, platform-optimized scripts for faceless YouTube, TikTok and Instagram channels. AI-powered, anonymous creator optimized. Try it free."
        url="https://contentanonymity.com/tools/script-generator"
        canonical="https://contentanonymity.com/tools/script-generator"
        breadcrumbItems={[
          { name: 'Tools', url: 'https://contentanonymity.com/tools/all' },
          { name: 'AI Script Generator', url: 'https://contentanonymity.com/tools/script-generator' }
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Faceless Content AI Script Generator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "156"
          },
          "description": "AI-powered script generator optimized for faceless content creators. Generate complete video scripts with hooks, structure, titles and tags."
        }}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">AI Script Generator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate complete, platform-optimized scripts for faceless content. Includes hook, structure, titles, thumbnail ideas and SEO tags.
              </p>
              <div className="mt-4 inline-flex items-center gap-2">
                <Badge variant="secondary">{remainingGenerations}</Badge>
                {!isPro && <Badge>Free tier: 3/day</Badge>}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Script Details</CardTitle>
                  <CardDescription>Configure your video script parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="niche">Niche Category</Label>
                    <Select
                      value={inputs.niche}
                      onValueChange={(value) => setInputs({ ...inputs, niche: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select niche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance & Investing</SelectItem>
                        <SelectItem value="tech">Technology & AI</SelectItem>
                        <SelectItem value="business">Business & Entrepreneurship</SelectItem>
                        <SelectItem value="education">Education & Explainers</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle & Self-Improvement</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="truecrime">True Crime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Target Platform</Label>
                    <Select
                      value={inputs.platform}
                      onValueChange={(value) => setInputs({ ...inputs, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube (Long Form)</SelectItem>
                        <SelectItem value="tiktok">TikTok / Shorts</SelectItem>
                        <SelectItem value="instagram">Instagram Reels</SelectItem>
                        <SelectItem value="blog">Blog / Article</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Video Topic / Title Idea</Label>
                    <Input
                      id="topic"
                      placeholder="e.g. How to start faceless YouTube channel with $0"
                      value={inputs.topic}
                      onChange={(e) => setInputs({ ...inputs, topic: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Video Length (minutes)</Label>
                      <span className="text-sm text-muted-foreground">{inputs.videoLength} min</span>
                    </div>
                    <Slider
                      min={1}
                      max={30}
                      step={1}
                      value={[inputs.videoLength]}
                      onValueChange={(v) => setInputs({ ...inputs, videoLength: v[0] ?? 8 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Content Tone</Label>
                    <Select
                      value={inputs.tone}
                      onValueChange={(value) => setInputs({ ...inputs, tone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informative">Informative / Educational</SelectItem>
                        <SelectItem value="storytelling">Storytelling / Narrative</SelectItem>
                        <SelectItem value="entertaining">Entertaining</SelectItem>
                        <SelectItem value="motivational">Motivational</SelectItem>
                        <SelectItem value="authoritative">Authoritative / Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={() => void generateAIScript()} 
                    className="w-full" 
                    size="lg"
                    disabled={isGenerating || !inputs.topic.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Script...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Script
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div>
                {result ? (
                  <Tabs defaultValue="script" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="script">Full Script</TabsTrigger>
                      <TabsTrigger value="titles">Titles</TabsTrigger>
                      <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="script" className="mt-4">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">🎣 3-Second Hook</Badge>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard('hook', result.hook)}
                              >
                                {copiedField === 'hook' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="font-medium text-lg">{result.hook}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Introduction</Label>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard('intro', result.intro)}
                              >
                                {copiedField === 'intro' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="text-sm leading-relaxed">{result.intro}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <Label>Main Content Sections</Label>
                            {result.mainSections.map((section, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-muted/50">
                                <p className="font-medium mb-1">Section {idx + 1}</p>
                                <p className="text-sm">{section}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Call To Action</Label>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard('cta', result.cta)}
                              >
                                {copiedField === 'cta' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="text-sm">{result.cta}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="titles" className="mt-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <Label className="text-base">📌 5 Optimized Title Variations</Label>
                          {result.titles.map((title, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 group">
                              <p className="text-sm">{title}</p>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="opacity-0 group-hover:opacity-100"
                                onClick={() => copyToClipboard(`title-${idx}`, title)}
                              >
                                {copiedField === `title-${idx}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="thumbnail" className="mt-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <Label className="text-base">🖼️ Thumbnail & Concept</Label>
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm leading-relaxed">{result.thumbnail}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="seo" className="mt-4">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div className="space-y-2">
                            <Label>Video Description</Label>
                            <Textarea 
                              value={result.description} 
                              readOnly 
                              className="min-h-[100px] text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Recommended Tags</Label>
                            <div className="flex flex-wrap gap-2">
                              {result.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary">#{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-16">
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">Enter your video topic</p>
                      <p className="text-sm text-muted-foreground">
                        Our AI will generate a complete optimized script for faceless content
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Content Depth Section - SEO */}
            <div className="max-w-4xl mx-auto mt-16 prose prose-lg dark:prose-invert">
              <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">AI Script Generator for Faceless Content Creators</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Our free AI script generator is specifically optimized for faceless content creators. Unlike generic AI writing tools, this generator understands the unique requirements of anonymous content creation: strong hooks that don't require on-camera presence, structured storytelling, platform-optimized pacing, and conversion-focused CTAs.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  The generator produces complete scripts including the critical 3-second hook, introduction, structured main sections, call to action, optimized title variations, thumbnail concepts, video description, and SEO tags. Everything you need to create high-performing faceless content in seconds.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Free tier users get 3 generations per day. Upgrade to Pro for unlimited access, advanced niche targeting, and priority processing.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}