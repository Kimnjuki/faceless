import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PenTool, Mic, Image, Video, Calendar, Lightbulb,
  Shield, User, BarChart3, Film, Link, TrendingUp,
  BookOpen, Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ScriptGenerator from "@/components/creator-studio/ScriptGenerator";
import VoiceStudio from "@/components/creator-studio/VoiceStudio";
import VisualAssetCreator from "@/components/creator-studio/VisualAssetCreator";
import ContentCalendar from "@/components/creator-studio/ContentCalendar";
import IdeaGenerator from "@/components/creator-studio/IdeaGenerator";
import AnonymityScoreDashboard from "@/components/creator-studio/AnonymityScoreDashboard";
import CreatorPersonaManager from "@/components/creator-studio/CreatorPersonaManager";
import ContentCalendarAI from "@/components/creator-studio/ContentCalendarAI";
import ABTestManager from "@/components/creator-studio/ABTestManager";
import StoryboardGenerator from "@/components/creator-studio/StoryboardGenerator";
import AffiliateMatchEngine from "@/components/creator-studio/AffiliateMatchEngine";
import IncomeProjector from "@/components/creator-studio/IncomeProjector";
import PlaybookMarketplace from "@/components/creator-studio/PlaybookMarketplace";
import { trackToolUsage } from "@/utils/analytics";

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  // Core creation
  { id: "script", label: "Script", icon: <PenTool className="h-4 w-4" />, group: "create", badge: "AI" },
  { id: "voice", label: "Voice", icon: <Mic className="h-4 w-4" />, group: "create" },
  { id: "storyboard", label: "Storyboard", icon: <Film className="h-4 w-4" />, group: "create", badge: "New" },
  { id: "visual", label: "Visual", icon: <Image className="h-4 w-4" />, group: "create" },
  // Strategy & growth
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" />, group: "strategy", badge: "AI" },
  { id: "abtest", label: "A/B Test", icon: <BarChart3 className="h-4 w-4" />, group: "strategy", badge: "New" },
  { id: "affiliate", label: "Affiliate", icon: <Link className="h-4 w-4" />, group: "strategy", badge: "AI" },
  { id: "income", label: "Income", icon: <TrendingUp className="h-4 w-4" />, group: "strategy" },
  // Identity & privacy
  { id: "personas", label: "Personas", icon: <User className="h-4 w-4" />, group: "privacy", badge: "New" },
  { id: "anonymity", label: "Anonymity", icon: <Shield className="h-4 w-4" />, group: "privacy", badge: "New" },
  // Community
  { id: "playbooks", label: "Playbooks", icon: <BookOpen className="h-4 w-4" />, group: "community", badge: "New" },
  { id: "ideas", label: "Ideas", icon: <Lightbulb className="h-4 w-4" />, group: "community" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const GROUP_LABELS: Record<string, string> = {
  create: "Create",
  strategy: "Strategy",
  privacy: "Privacy",
  community: "Community",
};

export default function CreatorStudio() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const contentToolDefs = useQuery(api.contentTools.list, hasConvex ? { limit: 24 } : "skip");
  const toolCatalog = useQuery(api.tools.list, hasConvex ? { limit: 24 } : "skip");
  const [activeTab, setActiveTab] = useState<TabId>("script");

  useEffect(() => {
    const tabDef = TABS.find((t) => t.id === activeTab);
    trackToolUsage(tabDef?.label ?? activeTab, "creator-studio", "viewed");
  }, [activeTab]);

  return (
    <>
      <SEO
        title="Creator Studio — AI Tools for Faceless Content | ContentAnonymity"
        description="Full AI content creation suite: funnel-mapped scripts, voice anonymization, content calendars, A/B testing, storyboards, affiliate matching, income projections, and persona management."
        keywords="AI content creation, script generator, voice anonymization, content calendar, AB testing, faceless content tools, anonymity score"
        url="https://contentanonymity.com/creator-studio"
        canonical="https://contentanonymity.com/creator-studio"
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <Badge className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Creator Studio
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI-Powered Content Suite
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Build anonymous income machines. Every tool in one place — from funnel-mapped scripts to privacy-hardened exports and cross-platform publishing.
              </p>
            </div>

            {/* Group nav */}
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              {Object.entries(GROUP_LABELS).map(([group, label]) => {
                const groupTabs = TABS.filter((t) => t.group === group);
                const isActive = groupTabs.some((t) => t.id === activeTab);
                return (
                  <button
                    key={group}
                    onClick={() => setActiveTab(groupTabs[0].id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                      isActive ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Studio Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-muted/50 p-1 rounded-lg">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-1.5 px-3 py-1.5"
                  >
                    {tab.icon}
                    <span className="hidden sm:inline text-sm">{tab.label}</span>
                    {tab.badge && (
                      <span className="hidden sm:inline text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                        {tab.badge}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ── Create ── */}
              <TabsContent value="script" className="mt-0">
                <ScriptGenerator />
              </TabsContent>

              <TabsContent value="voice" className="mt-0">
                <VoiceStudio />
              </TabsContent>

              <TabsContent value="storyboard" className="mt-0">
                <StoryboardGenerator />
              </TabsContent>

              <TabsContent value="visual" className="mt-0">
                <VisualAssetCreator />
              </TabsContent>

              {/* ── Strategy ── */}
              <TabsContent value="calendar" className="mt-0">
                <ContentCalendarAI />
              </TabsContent>

              <TabsContent value="abtest" className="mt-0">
                <ABTestManager />
              </TabsContent>

              <TabsContent value="affiliate" className="mt-0">
                <AffiliateMatchEngine />
              </TabsContent>

              <TabsContent value="income" className="mt-0">
                <IncomeProjector />
              </TabsContent>

              {/* ── Privacy ── */}
              <TabsContent value="personas" className="mt-0">
                <CreatorPersonaManager />
              </TabsContent>

              <TabsContent value="anonymity" className="mt-0">
                <AnonymityScoreDashboard />
              </TabsContent>

              {/* ── Community ── */}
              <TabsContent value="playbooks" className="mt-0">
                <PlaybookMarketplace />
              </TabsContent>

              <TabsContent value="ideas" className="mt-0">
                <IdeaGenerator />
              </TabsContent>
            </Tabs>

            {/* Tool catalog from Convex */}
            {(contentToolDefs?.length || toolCatalog?.length) ? (
              <section className="mt-16 space-y-8">
                {contentToolDefs && contentToolDefs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Studio Modules</h2>
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
                    <h2 className="text-2xl font-bold mb-4">Recommended Tools</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {toolCatalog.map((t) => (
                        <Card key={t._id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{t.name}</CardTitle>
                            {t.pricing && <CardDescription>{t.pricing}</CardDescription>}
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            {t.description && <p className="text-muted-foreground">{t.description}</p>}
                            {t.pros && t.pros.length > 0 && (
                              <div><span className="font-medium">Pros:</span> {t.pros.slice(0, 3).join(", ")}</div>
                            )}
                            {t.cons && t.cons.length > 0 && (
                              <div><span className="font-medium">Cons:</span> {t.cons.slice(0, 3).join(", ")}</div>
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
