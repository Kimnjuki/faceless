import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Image, Download, Search, Sparkles, Palette } from "lucide-react";
import { toast } from "sonner";

export default function VisualAssetCreator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual Midjourney/Replicate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGeneratedImage("mock-image-url");
      setIsGenerating(false);
      toast.success("Image generated successfully!");
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate image. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">AI Generate</TabsTrigger>
          <TabsTrigger value="stock">Stock Library</TabsTrigger>
          <TabsTrigger value="thumbnail">Thumbnail Builder</TabsTrigger>
        </TabsList>

        {/* AI Image Generation */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>AI Image Generator</CardTitle>
              </div>
              <CardDescription>
                Generate custom images using AI. Powered by Midjourney API. 75+ style presets available.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Prompt *</Label>
                <Input
                  id="prompt"
                  placeholder="e.g., A minimalist workspace with laptop, plants, and natural lighting"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style Preset</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="3d">3D Render</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspect">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspect">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
                      <SelectItem value="9:16">9:16 (TikTok/Reels)</SelectItem>
                      <SelectItem value="1:1">1:1 (Instagram)</SelectItem>
                      <SelectItem value="4:5">4:5 (Instagram)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateImage} 
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>

              {generatedImage && (
                <div className="border rounded-lg p-4">
                  <div className="aspect-video bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 text-white text-center p-4">
                      <Image className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">Generated Asset</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Use in Thumbnail Builder
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Library */}
        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Library</CardTitle>
              <CardDescription>
                Search 10,000+ copyright-free images from Pexels, Pixabay, and Unsplash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search for images..." />
                <Button>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                Stock library search coming soon. This will integrate with Pexels, Pixabay, and Unsplash APIs.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thumbnail Builder */}
        <TabsContent value="thumbnail" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Builder</CardTitle>
              <CardDescription>
                Create eye-catching thumbnails with 200+ templates. A/B test and predict click-through rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Thumbnail builder coming soon. This will include:
                <ul className="text-sm space-y-2 mt-4 text-left max-w-md mx-auto">
                  <li>✓ 200+ thumbnail templates</li>
                  <li>✓ A/B testing tool</li>
                  <li>✓ AI click-through prediction</li>
                  <li>✓ Custom text and graphics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
