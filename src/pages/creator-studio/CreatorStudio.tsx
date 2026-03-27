import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Mic, Image, Video, Calendar, Lightbulb, Sparkles, Palette } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ScriptGenerator from "@/components/creator-studio/ScriptGenerator";
import VoiceStudio from "@/components/creator-studio/VoiceStudio";
import VisualAssetCreator from "@/components/creator-studio/VisualAssetCreator";
import ContentCalendar from "@/components/creator-studio/ContentCalendar";
import IdeaGenerator from "@/components/creator-studio/IdeaGenerator";
import BrandKitPanel from "@/components/creator-studio/BrandKitPanel";
import { trackToolUsage } from "@/utils/analytics";

const TOOL_NAMES: Record<string, string> = {
  script: "Script Generator",
  voice: "Voice Studio",
  visual: "Visual Asset Creator",
  video: "Video Editor",
  calendar: "Content Calendar",
  ideas: "Idea Generator",
  brand: "Brand Kit",
};

export default function CreatorStudio() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const contentToolDefs = useQuery(api.contentTools.list, hasConvex ? { limit: 24 } : "skip");
  const toolCatalog = useQuery(api.tools.list, hasConvex ? { limit: 24 } : "skip");
  const [activeTab, setActiveTab] = useState("script");

  useEffect(() => {
    trackToolUsage(TOOL_NAMES[activeTab] || activeTab, "creator-studio", "viewed");
  }, [activeTab]);

  return (
    <>
      <SEO
        title="Creator Studio - AI-Powered Content Creation Suite | ContentAnonymity"
        description="All-in-one content creation suite with AI script generation, voice synthesis, visual assets, video editing, and content calendar. Create professional faceless content faster."
        keywords="AI content creation, script generator, voice synthesis, video editing, content calendar, faceless content tools"
        url="https://contentanonymity.com/creator-studio"
        canonical="https://contentanonymity.com/creator-studio"
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4">Creator Studio</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI-Powered Content Creation Suite
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create professional faceless content faster with our integrated AI tools. From scripts to finished videos, all in one place.
              </p>
            </div>

            {/* Studio Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-8 gap-1 h-auto py-2">
                <TabsTrigger value="script" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <span className="hidden sm:inline">Script</span>
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <span className="hidden sm:inline">Voice</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Visual</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="ideas" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Ideas</span>
                </TabsTrigger>
                <TabsTrigger value="brand" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Brand</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="script" className="mt-8">
                <ScriptGenerator />
              </TabsContent>

              <TabsContent value="voice" className="mt-8">
                <VoiceStudio />
              </TabsContent>

              <TabsContent value="visual" className="mt-8">
                <VisualAssetCreator />
              </TabsContent>

              <TabsContent value="video" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Editor</CardTitle>
                    <CardDescription>
                      Web-based video editor with auto-captions, templates, and batch editing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Video editor coming soon. This will include:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto text-left">
                        <li>✓ Auto-captions (98% accuracy)</li>
                        <li>✓ B-roll suggestions (AI-powered)</li>
                        <li>✓ Template library (300+ templates)</li>
                        <li>✓ One-click resizing (9:16, 16:9, 1:1, 4:5)</li>
                        <li>✓ Batch editing</li>
                        <li>✓ Cloud rendering</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-8">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="ideas" className="mt-8">
                <IdeaGenerator />
              </TabsContent>

              <TabsContent value="brand" className="mt-8">
                <BrandKitPanel />
              </TabsContent>
            </Tabs>

            {(contentToolDefs?.length || toolCatalog?.length) ? (
              <section className="mt-16 space-y-8">
                {contentToolDefs && contentToolDefs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Studio modules</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {contentToolDefs.map((ct) => (
                        <Card key={ct._id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{ct.name}</CardTitle>
                            <CardDescription>{ct.category}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{ct.description}</p>
                            {ct.keyFeatures && ct.keyFeatures.length > 0 && (
                              <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                                {ct.keyFeatures.slice(0, 4).map((f) => (
                                  <li key={f}>{f}</li>
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {toolCatalog && toolCatalog.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Recommended tools</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {toolCatalog.map((t) => (
                        <Card key={t._id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{t.name}</CardTitle>
                            {t.pricing && (
                              <CardDescription>{t.pricing}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            {t.description && (
                              <p className="text-muted-foreground">{t.description}</p>
                            )}
                            {t.pros && t.pros.length > 0 && (
                              <div>
                                <span className="font-medium">Pros:</span>{" "}
                                {t.pros.slice(0, 3).join(", ")}
                              </div>
                            )}
                            {t.cons && t.cons.length > 0 && (
                              <div>
                                <span className="font-medium">Cons:</span>{" "}
                                {t.cons.slice(0, 3).join(", ")}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
