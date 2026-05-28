import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Route, GraduationCap, TrendingUp, Target, Clock, CheckCircle2,
  ArrowRight, ChevronDown, Sparkles, BarChart3, DollarSign, Lightbulb,
  Monitor, Tablet, Smartphone, Users, FileText, BookOpen, Brain,
} from "lucide-react";
import { chatCompletion } from "@/lib/ai/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  generateRoadmap, type Roadmap, type RoadmapInput,
  type SkillLevel, type MonetizationGoal, saveRoadmapToStorage, getRoadmapFromStorage,
} from "@/utils/creatorRoadmap";
import { trackToolUsage } from "@/utils/analytics";

const NICHE_OPTIONS = [
  "Finance & Investing", "Technology & AI", "Health & Fitness", "Lifestyle & Self-Improvement",
  "Business & Entrepreneurship", "Gaming", "Personal Development", "Marketing & Sales",
  "Education & Online Learning", "Music & Audio Production", "Travel & Adventure",
  "Food & Cooking", "Gaming & Esports", "Design & Creative Skills",
  "Parenting & Family", "Real Estate", "Legal & Compliance", "Sustainability & Green Living",
];

interface FormData {
  niche: string;
  skillLevel: SkillLevel;
  goal: MonetizationGoal;
  weeklyHours: number;
  existingAudience: boolean;
  budget: 'none' | 'minimal' | 'moderate';
}

export default function CreatorRoadmap() {
  const [step, setStep] = useState<'form' | 'roadmap'>('form');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const [form, setForm] = useState<FormData>({
    niche: '',
    skillLevel: 'beginner',
    goal: 'affiliate',
    weeklyHours: 10,
    existingAudience: false,
    budget: 'minimal',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Load existing roadmap from storage
  useEffect(() => {
    const saved = getRoadmapFromStorage();
    if (saved) {
      setRoadmap(saved);
      setForm(saved.input as FormData);
      setStep('roadmap');
    }
  }, []);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.niche) errors.niche = 'Select or type a niche';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;

    const input: RoadmapInput = {
      niche: form.niche,
      skillLevel: form.skillLevel,
      goal: form.goal,
      weeklyHours: form.weeklyHours,
      existingAudience: form.existingAudience,
      budget: form.budget,
    };

    const r = generateRoadmap(input);
    setRoadmap(r);
    saveRoadmapToStorage(r);
    setStep('roadmap');
    setExpandedPhase(1);
    trackToolUsage('creator-roadmap-generated', 'creator-os', `${form.niche}|${form.goal}`);

    // ── NVIDIA-powered AI insights ──
    setAiInsights(null);
    setAiLoading(true);
    chatCompletion([
      {
        role: 'system',
        content: 'You are a faceless content creation strategist. Given a niche, skill level, goal, and weekly hours, provide 3 specific, actionable insights that would help THIS creator succeed. Each insight should be 1-2 sentences. Keep it under 150 words. Use bullet points. Be specific — name real tools, real strategies, real metrics.',
      },
      {
        role: 'user',
        content: `Niche: ${form.niche}\nSkill Level: ${form.skillLevel}\nGoal: ${form.goal}\nWeekly Hours: ${form.weeklyHours}\nAudience: ${form.existingAudience ? 'Has some followers' : 'Starting from zero'}\nBudget: ${form.budget}\n\nWhat are my top 3 priorities?`,
      },
    ], { temperature: 0.5, maxTokens: 384 }).then(text => {
      if (text && !text.startsWith('Here') && !text.startsWith('I analyze')) {
        setAiInsights(text);
      }
      setAiLoading(false);
    }).catch(() => setAiLoading(false));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setStep('form');
    setRoadmap(null);
    localStorage.removeItem('creator_roadmap');
  };

  return (
    <>
      <SEO
        title="AI Creator Roadmap — Build Your Anonymous Content Business"
        description="Get a personalized, step-by-step plan to build and monetize your anonymous content business. Tailored to your niche, skill level, and revenue goals."
        canonical="https://contentanonymity.com/creator-roadmap"
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_70%)]" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
            <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-300">
              <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your <span className="text-indigo-400">Personal AI</span> Creator Roadmap
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Tell us your niche, goals, and experience level — we'll generate a step-by-step plan 
              with tasks, timelines, resources, and revenue projections.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Tell Us About You</CardTitle>
                    <CardDescription>We'll create a custom roadmap based on your answers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Niche */}
                    <div className="space-y-3">
                      <Label className="text-slate-300">Your Niche</Label>
                      <Select
                        value={form.niche}
                        onValueChange={(v) => setForm({ ...form, niche: v })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select or type your niche" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {NICHE_OPTIONS.map((n) => (
                            <SelectItem key={n} value={n} className="text-slate-200">{n}</SelectItem>
                          ))}
                          <SelectItem value="other" className="text-slate-200">Other (type below)</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.niche === 'other' && (
                        <Input
                          placeholder="Type your niche"
                          value={form.niche === 'other' ? '' : form.niche}
                          onChange={(e) => setForm({ ...form, niche: e.target.value })}
                          className="bg-slate-800 border-slate-700 text-white mt-2"
                        />
                      )}
                      {formErrors.niche && <p className="text-red-400 text-sm">{formErrors.niche}</p>}
                    </div>

                    {/* Row: Skill Level + Goal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-slate-300">Experience Level</Label>
                        <Select
                          value={form.skillLevel}
                          onValueChange={(v: SkillLevel) => setForm({ ...form, skillLevel: v })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="beginner" className="text-slate-200">Beginner — Just starting out</SelectItem>
                            <SelectItem value="intermediate" className="text-slate-200">Intermediate — Some experience</SelectItem>
                            <SelectItem value="advanced" className="text-slate-200">Advanced — Experienced creator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-slate-300">Monetization Goal</Label>
                        <Select
                          value={form.goal}
                          onValueChange={(v: MonetizationGoal) => setForm({ ...form, goal: v })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="affiliate" className="text-slate-200">Affiliate Marketing</SelectItem>
                            <SelectItem value="digital_product" className="text-slate-200">Digital Products</SelectItem>
                            <SelectItem value="course" className="text-slate-200">Online Courses</SelectItem>
                            <SelectItem value="membership" className="text-slate-200">Membership Community</SelectItem>
                            <SelectItem value="ugc_brand_deal" className="text-slate-200">UGC & Brand Deals</SelectItem>
                            <SelectItem value="adsense" className="text-slate-200">Ad Revenue (AdSense)</SelectItem>
                            <SelectItem value="saas" className="text-slate-200">SaaS / Tool Building</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Row: Weekly Hours + Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-slate-300">Weekly Hours: <span className="text-indigo-400 font-bold">{form.weeklyHours}h</span></Label>
                        <input
                          type="range"
                          min={2}
                          max={40}
                          step={1}
                          value={form.weeklyHours}
                          onChange={(e) => setForm({ ...form, weeklyHours: parseInt(e.target.value) })}
                          className="w-full accent-indigo-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>2h/week</span>
                          <span>40h/week (full-time)</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-slate-300">Starting Budget</Label>
                        <Select
                          value={form.budget}
                          onValueChange={(v: 'none' | 'minimal' | 'moderate') => setForm({ ...form, budget: v })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="none" className="text-slate-200">$0 — No budget</SelectItem>
                            <SelectItem value="minimal" className="text-slate-200">$50–200/month</SelectItem>
                            <SelectItem value="moderate" className="text-slate-200">$500+/month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Existing Audience Toggle */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="existingAudience"
                        checked={form.existingAudience}
                        onChange={(e) => setForm({ ...form, existingAudience: e.target.checked })}
                        className="accent-indigo-500 h-4 w-4"
                      />
                      <Label htmlFor="existingAudience" className="text-slate-300 cursor-pointer">
                        I already have an audience (1000+ followers/subscribers)
                      </Label>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      size="lg"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-lg py-6"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate My Creator Roadmap
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : roadmap ? (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Summary Card */}
                <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-indigo-400 text-sm font-medium">Niche</p>
                        <p className="text-white text-lg font-bold">{roadmap.input.niche}</p>
                      </div>
                      <div>
                        <p className="text-indigo-400 text-sm font-medium">Goal</p>
                        <p className="text-white text-lg font-bold capitalize">{roadmap.input.goal.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-indigo-400 text-sm font-medium">Level</p>
                        <p className="text-white text-lg font-bold capitalize">{roadmap.input.skillLevel}</p>
                      </div>
                      <div>
                        <p className="text-indigo-400 text-sm font-medium">Timeline</p>
                        <p className="text-white text-lg font-bold">{roadmap.totalDuration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI-Powered Insights */}
                {(aiInsights || aiLoading) && (
                  <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        AI Insights
                        {aiLoading && (
                          <span className="text-xs text-slate-400 animate-pulse ml-2">Generating…</span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        NVIDIA NIM personalized strategy for your niche
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-950/50 rounded-lg border border-indigo-800/20 p-4">
                        {aiLoading ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2" />
                            <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3" />
                          </div>
                        ) : (
                          <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                            {aiInsights}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Revenue Projection */}
                <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-400" /> Revenue Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {roadmap.monetizationPath.map((mp, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <div>
                            <p className="text-slate-200 font-medium text-sm">{mp.stage}</p>
                            <p className="text-slate-400 text-xs">{mp.offer}</p>
                          </div>
                          <Badge variant="secondary" className="text-green-300 bg-green-900/30">
                            {mp.expectedRevenue}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones / Phases */}
                {roadmap.milestones.map((milestone) => (
                  <motion.div
                    key={milestone.phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: milestone.phase * 0.1 }}
                  >
                    <Card
                      className={`border-slate-800 bg-slate-900/80 backdrop-blur-sm cursor-pointer transition-all ${
                        expandedPhase === milestone.phase ? 'ring-1 ring-indigo-500/30' : ''
                      }`}
                      onClick={() => setExpandedPhase(expandedPhase === milestone.phase ? null : milestone.phase)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                              {milestone.phase}
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white">{milestone.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3" /> {milestone.duration}
                                {milestone.phase === 5 && (
                                  <Badge variant="outline" className="ml-2 text-amber-300 border-amber-500/30 text-[10px]">Ongoing</Badge>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${
                            expandedPhase === milestone.phase ? 'rotate-180' : ''
                          }`} />
                        </div>
                        <p className="text-slate-400 text-sm mt-2">{milestone.description}</p>
                      </CardHeader>

                      <AnimatePresence>
                        {expandedPhase === milestone.phase && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <CardContent className="space-y-6 pt-0">
                              <Separator className="bg-slate-800" />

                              {/* Tasks */}
                              <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Tasks
                                </h4>
                                {milestone.tasks.map((task, tIdx) => (
                                  <div key={tIdx} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <h5 className="text-white font-semibold">{task.title}</h5>
                                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                                        {task.resources.length > 0 && (
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {task.resources.map((r, rIdx) => (
                                              <a
                                                key={rIdx}
                                                href={r.url}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                                              >
                                                {r.label}
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <Badge variant="outline" className="text-slate-400 border-slate-600 text-[10px] whitespace-nowrap">
                                        ~{task.estimatedTime}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Deliverables */}
                              <div>
                                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
                                  <Target className="h-4 w-4 text-indigo-400" /> Deliverables
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {milestone.deliverables.map((d, dIdx) => (
                                    <div key={dIdx} className="flex items-start gap-2 text-slate-400 text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-green-400/60 mt-0.5 flex-shrink-0" />
                                      {d}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" className="border-slate-700 text-slate-300" onClick={handleReset}>
                    Create New Roadmap
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
                    <a href="/opportunity-finder">
                      Find Content Opportunities <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
