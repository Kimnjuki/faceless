import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Lightbulb, Target, Hash, TrendingUp, Youtube, Music2,
  Instagram, Globe, Mic, Linkedin, BookOpen, Copy, Download, Share2,
  Search, Filter, ArrowRight, CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  generateOpportunities, type ContentIdea, type PlatformTemplate,
  type Platform, type ContentFormat, type OpportunityInput,
} from "@/utils/opportunityFinder";
import { trackToolUsage } from "@/utils/analytics";

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  youtube: <Youtube className="h-4 w-4 text-red-400" />,
  tiktok: <Music2 className="h-4 w-4 text-pink-400" />,
  instagram: <Instagram className="h-4 w-4 text-purple-400" />,
  blog: <Globe className="h-4 w-4 text-blue-400" />,
  podcast: <Mic className="h-4 w-4 text-amber-400" />,
  linkedin: <Linkedin className="h-4 w-4 text-blue-500" />,
};

const FORMAT_LABELS: Record<ContentFormat, string> = {
  video: 'Video', short: 'Short', carousel: 'Carousel',
  article: 'Article', podcast_episode: 'Podcast', infographic: 'Infographic',
};

const FORMAT_ICONS: Record<ContentFormat, React.ReactNode> = {
  video: <Youtube className="h-4 w-4" />,
  short: <TrendingUp className="h-4 w-4" />,
  carousel: <BookOpen className="h-4 w-4" />,
  article: <FileTextIcon />,
  podcast_episode: <Mic className="h-4 w-4" />,
  infographic: <Lightbulb className="h-4 w-4" />,
};

function FileTextIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

const ALL_PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram', 'blog', 'podcast', 'linkedin'];
const ALL_FORMATS: ContentFormat[] = ['video', 'short', 'carousel', 'article', 'podcast_episode', 'infographic'];

export default function OpportunityFinder() {
  const [niche, setNiche] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['youtube', 'tiktok']);
  const [selectedFormats, setSelectedFormats] = useState<ContentFormat[]>(['video', 'short']);
  const [goal, setGoal] = useState<OpportunityInput['goal']>('awareness');
  const [result, setResult] = useState<ReturnType<typeof generateOpportunities> | null>(null);
  const [activeTab, setActiveTab] = useState('ideas');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const toggleFormat = (f: ContentFormat) => {
    setSelectedFormats(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleGenerate = () => {
    if (!niche) return;

    const input: OpportunityInput = {
      niche,
      platforms: selectedPlatforms,
      goal,
      contentTypes: selectedFormats,
    };

    const r = generateOpportunities(input);
    setResult(r);
    trackToolUsage('opportunity-finder', { niche, platforms: selectedPlatforms.join(','), formats: selectedFormats.join(',') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* clipboard not available */ }
  };

  const difficultyColor = (d: string) => {
    if (d === 'easy') return 'text-green-400 bg-green-900/20 border-green-500/30';
    if (d === 'medium') return 'text-amber-400 bg-amber-900/20 border-amber-500/30';
    return 'text-red-400 bg-red-900/20 border-red-500/30';
  };

  return (
    <>
      <SEO
        title="Content Opportunity Finder — AI-Powered Content Ideas"
        description="Discover high-impact content ideas, hooks, and platform-specific templates for your niche. Generate posts that get views and drive growth."
        canonical="https://contentanonymity.com/opportunity-finder"
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_70%)]" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-300">
              <Lightbulb className="h-3 w-3 mr-1" /> Never Run Out of Ideas
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Content <span className="text-purple-400">Opportunity</span> Finder
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Generate platform-specific content ideas, hooks, titles, and templates 
              tailored to your niche and goals.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {!result ? (
            /* Setup Form */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Configure Your Search</CardTitle>
                  <CardDescription>Pick your niche, platforms, and content formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Niche */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-medium">Your Niche</label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g., Personal Finance, AI Tutorials, Fitness..."
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Platforms */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-medium">Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_PLATFORMS.map((p) => (
                        <button
                          key={p}
                          onClick={() => togglePlatform(p)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm ${
                            selectedPlatforms.includes(p)
                              ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {PLATFORM_ICONS[p]}
                          <span className="capitalize">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Formats */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-medium">Content Formats</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_FORMATS.map((f) => (
                        <button
                          key={f}
                          onClick={() => toggleFormat(f)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm ${
                            selectedFormats.includes(f)
                              ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {FORMAT_ICONS[f]}
                          <span>{FORMAT_LABELS[f]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-medium">Primary Goal</label>
                    <Select value={goal} onValueChange={(v: OpportunityInput['goal']) => setGoal(v)}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="awareness" className="text-slate-200">Awareness — Get discovered</SelectItem>
                        <SelectItem value="engagement" className="text-slate-200">Engagement — Build community</SelectItem>
                        <SelectItem value="conversion" className="text-slate-200">Conversion — Drive sales/signups</SelectItem>
                        <SelectItem value="authority" className="text-slate-200">Authority — Establish expertise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-lg py-6"
                    disabled={!niche}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Find Content Opportunities
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Results */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Trending Topics */}
              <Card className="border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-slate-900">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    Trending Angles for <span className="text-purple-300">{result.input.niche}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.trendingTopics.map((t, i) => (
                      <Badge key={i} variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-500/20">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs: Ideas / Templates */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-slate-800/50 border border-slate-700/50">
                  <TabsTrigger value="ideas" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300">
                    <Lightbulb className="h-4 w-4 mr-2" /> Content Ideas ({result.ideas.length})
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300">
                    <Copy className="h-4 w-4 mr-2" /> Templates ({result.templates.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ideas" className="space-y-4 focus-visible:outline-none">
                  {result.ideas.map((idea, i) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm hover:border-slate-700 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px] capitalize">
                                  {PLATFORM_ICONS[idea.platform]} {idea.platform}
                                </Badge>
                                <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                                  {FORMAT_LABELS[idea.format]}
                                </Badge>
                                <Badge className={`text-[10px] ${difficultyColor(idea.difficulty)}`}>
                                  {idea.difficulty}
                                </Badge>
                                <Badge className={`text-[10px] ${
                                  idea.monetizationPotential === 'high' 
                                    ? 'text-green-400 bg-green-900/20 border-green-500/30' 
                                    : 'text-slate-400 bg-slate-800 border-slate-700'
                                }`}>
                                  {idea.monetizationPotential === 'high' ? '💰 High Revenue' : `${idea.monetizationPotential} revenue`}
                                </Badge>
                              </div>
                              <h3 className="text-white font-semibold text-base mb-1">{idea.title}</h3>
                              <p className="text-slate-400 text-sm italic">"{idea.hook}"</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span>⏱ {idea.estimatedProductionTime}</span>
                                <span>🔥 Score: {idea.trendingScore}/100</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {idea.seoKeywords.slice(0, 3).map((kw, kIdx) => (
                                  <span key={kIdx} className="text-[10px] text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                                    #{kw.replace(/\s+/g, '')}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white h-8 px-2"
                                onClick={() => copyToClipboard(`${idea.title}\n\nHook: ${idea.hook}`, `copy-${idea.id}`)}
                              >
                                {copiedId === `copy-${idea.id}` ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white h-8 px-2"
                                asChild
                              >
                                <a href={`/creator-studio?idea=${encodeURIComponent(idea.title)}`}>
                                  <ArrowRight className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="templates" className="space-y-4 focus-visible:outline-none">
                  {result.templates.map((tmpl, i) => (
                    <motion.div
                      key={`${tmpl.platform}-${tmpl.format}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            {PLATFORM_ICONS[tmpl.platform]}
                            <CardTitle className="text-white text-sm capitalize">{tmpl.platform} — {FORMAT_LABELS[tmpl.format]}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 rounded bg-slate-800/50 border border-slate-700/50">
                            <p className="text-xs text-slate-500 mb-1">Title Template</p>
                            <p className="text-slate-200 font-mono text-sm">{tmpl.titleTemplate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Hook Patterns</p>
                            <div className="flex flex-wrap gap-2">
                              {tmpl.hookPatterns.map((h, hIdx) => (
                                <span key={hIdx} className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50 italic">
                                  "{h}"
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span><span className="text-slate-400 font-medium">Best:</span> {tmpl.bestPractices.join(', ')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Optimal: {tmpl.optimalLength}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white h-7"
                              onClick={() => copyToClipboard(
                                `Platform: ${tmpl.platform}\nFormat: ${tmpl.format}\nTitle: ${tmpl.titleTemplate}\n\nHook Patterns:\n${tmpl.hookPatterns.map(h => `- "${h}"`).join('\n')}\n\nBest Practices:\n${tmpl.bestPractices.join('\n')}\n\nCTA Examples:\n${tmpl.ctaExamples.join('\n')}`,
                                `tmpl-${tmpl.platform}-${tmpl.format}`
                              )}
                            >
                              {copiedId === `tmpl-${tmpl.platform}-${tmpl.format}` ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-400" /> : <Copy className="h-3 w-3 mr-1" />}
                              {copiedId === `tmpl-${tmpl.platform}-${tmpl.format}` ? 'Copied' : 'Copy'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Generate New */}
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300"
                  onClick={() => setResult(null)}
                >
                  New Search
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
