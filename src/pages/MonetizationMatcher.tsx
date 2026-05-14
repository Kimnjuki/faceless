import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, Target, Sparkles, ArrowRight, CheckCircle2,
  ShoppingCart, GraduationCap, Users, Gift, Briefcase, Star,
  BarChart3, Zap, Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  matchMonetization, type MonetizationProfile, type RecommendedOffer,
  type CreatorStage, saveMonetizationProfileToStorage, getMonetizationProfileFromStorage,
} from "@/utils/monetizationMatcher";
import { trackToolUsage } from "@/utils/analytics";

const NICHE_OPTIONS = [
  "Finance & Investing", "Technology & AI", "Health & Fitness", "Lifestyle & Self-Improvement",
  "Business & Entrepreneurship", "Gaming", "Personal Development", "Marketing & Sales",
  "Education & Online Learning", "Music & Audio Production", "Travel & Adventure",
  "Food & Cooking", "Design & Creative Skills", "Parenting & Family",
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  affiliate_program: <ShoppingCart className="h-5 w-5" />,
  course: <GraduationCap className="h-5 w-5" />,
  digital_product: <Gift className="h-5 w-5" />,
  service: <Briefcase className="h-5 w-5" />,
  membership: <Users className="h-5 w-5" />,
  lead_magnet: <Zap className="h-5 w-5" />,
};

const TYPE_COLORS: Record<string, string> = {
  affiliate_program: 'text-blue-400 bg-blue-900/20 border-blue-500/30',
  course: 'text-purple-400 bg-purple-900/20 border-purple-500/30',
  digital_product: 'text-green-400 bg-green-900/20 border-green-500/30',
  service: 'text-amber-400 bg-amber-900/20 border-amber-500/30',
  membership: 'text-pink-400 bg-pink-900/20 border-pink-500/30',
  lead_magnet: 'text-cyan-400 bg-cyan-900/20 border-cyan-500/30',
};

const AUDIENCE_OPTIONS = [
  '0–100', '100–1K', '1K–5K', '5K–10K', '10K–50K', '50K–100K', '100K+',
];
const TRAFFIC_OPTIONS = [
  '0–100', '100–500', '500–2K', '2K–10K', '10K–50K', '50K–100K', '100K+',
];
const REVENUE_OPTIONS = [
  '$0', '$100–500/mo', '$500–2K/mo', '$2K–5K/mo', '$5K–10K/mo', '$10K+/mo',
];

export default function MonetizationMatcher() {
  const [stage, setStage] = useState<CreatorStage>('starting');
  const [niche, setNiche] = useState('');
  const [audienceSize, setAudienceSize] = useState('0–100');
  const [traffic, setTraffic] = useState('0–100');
  const [existingRevenue, setExistingRevenue] = useState('$0');
  const [goals, setGoals] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof matchMonetization> | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  // Load saved profile
  useEffect(() => {
    const saved = getMonetizationProfileFromStorage();
    if (saved) {
      setNiche(saved.niche);
      setStage(saved.stage);
      setAudienceSize(saved.audienceSize);
      setTraffic(saved.monthlyTraffic);
      setExistingRevenue(saved.existingRevenue);
      const r = matchMonetization(saved);
      setResult(r);
    }
  }, []);

  const toggleGoal = (g: string) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const GOAL_OPTIONS = [
    'Build email list', 'Sell digital products', 'Promote affiliate offers',
    'Create a course', 'Launch membership', 'Get brand deals',
  ];

  const handleGenerate = () => {
    if (!niche) return;

    const profile: MonetizationProfile = {
      stage,
      niche,
      audienceSize,
      monthlyTraffic: traffic,
      existingRevenue,
      goals: goals.length > 0 ? goals : ['Build email list'],
    };

    const r = matchMonetization(profile);
    setResult(r);
    saveMonetizationProfileToStorage(profile);
    trackToolUsage('monetization-matcher', { stage, niche });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-slate-400';
  };

  return (
    <>
      <SEO
        title="Monetization Matcher — Find Your Best Revenue Path"
        description="Discover the best monetization strategies for your content niche and creator stage. Get matched with affiliate programs, courses, products, and memberships."
        canonical="https://contentanonymity.com/monetization-matcher"
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_70%)]" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
            <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-300">
              <DollarSign className="h-3 w-3 mr-1" /> Revenue Matchmaker
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-emerald-400">Monetization</span> Matcher
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              We analyze your creator stage, niche, and traffic to recommend exactly 
              which monetization path fits you best.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {!result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">What's Your Current Situation?</CardTitle>
                  <CardDescription>We'll match you with the best monetization opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Niche */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-medium">Your Niche</label>
                    <Select value={niche} onValueChange={setNiche}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {NICHE_OPTIONS.map((n) => (
                          <SelectItem key={n} value={n} className="text-slate-200">{n}</SelectItem>
                        ))}
                        <SelectItem value="other" className="text-slate-200">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {niche === 'other' && (
                      <input
                        type="text"
                        placeholder="Type your niche"
                        onChange={(e) => setNiche(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 mt-2"
                      />
                    )}
                  </div>

                  {/* Row: Stage + Audience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-slate-300 font-medium">Creator Stage</label>
                      <Select value={stage} onValueChange={(v: CreatorStage) => setStage(v)}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="starting" className="text-slate-200">Starting — just launched</SelectItem>
                          <SelectItem value="growing" className="text-slate-200">Growing — getting momentum</SelectItem>
                          <SelectItem value="scaling" className="text-slate-200">Scaling — consistent revenue</SelectItem>
                          <SelectItem value="established" className="text-slate-200">Established — full-time creator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-slate-300 font-medium">Audience Size</label>
                      <Select value={audienceSize} onValueChange={setAudienceSize}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {AUDIENCE_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o} className="text-slate-200">{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row: Traffic + Revenue */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-slate-300 font-medium">Monthly Traffic (visitors)</label>
                      <Select value={traffic} onValueChange={setTraffic}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {TRAFFIC_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o} className="text-slate-200">{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-slate-300 font-medium">Current Monthly Revenue</label>
                      <Select value={existingRevenue} onValueChange={setExistingRevenue}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {REVENUE_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o} className="text-slate-200">{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-3">
                    <label className="text-slate-300 font-medium">Monetization Goals (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {GOAL_OPTIONS.map((g) => (
                        <button
                          key={g}
                          onClick={() => toggleGoal(g)}
                          className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                            goals.includes(g)
                              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-lg py-6"
                    disabled={!niche}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Find My Monetization Path
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Summary */}
              <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-900/20 to-slate-900">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-emerald-400 text-sm">Niche</p>
                      <p className="text-white font-bold">{result.profile.niche}</p>
                    </div>
                    <div>
                      <p className="text-emerald-400 text-sm">Stage</p>
                      <p className="text-white font-bold capitalize">{result.profile.stage}</p>
                    </div>
                    <div>
                      <p className="text-emerald-400 text-sm">Revenue (12mo)</p>
                      <p className="text-white font-bold">${result.revenueProjection.totalLow.toLocaleString()} – ${result.revenueProjection.totalHigh.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-emerald-400 text-sm">Matches</p>
                      <p className="text-white font-bold">{result.recommendations.length} offers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-400" /> Recommended Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {result.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Revenue Projection Chart */}
              <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-400" /> 12-Month Revenue Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.revenueProjection.monthly.filter((_, i) => i % 2 === 0).map((m) => (
                      <div key={m.month} className="flex items-center gap-4">
                        <span className="text-slate-500 text-xs w-12">Month {m.month}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-4 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-600/60 to-emerald-500"
                              style={{ width: `${Math.min(100, (m.low / result.revenueProjection.monthly[result.revenueProjection.monthly.length - 1].high) * 100)}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs w-24 text-right">
                            ${m.low.toLocaleString()} – ${m.high.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4 bg-slate-800" />
                  <div className="text-center text-sm text-slate-400">
                    Total projected: <span className="text-emerald-400 font-bold">${result.revenueProjection.totalLow.toLocaleString()} – ${result.revenueProjection.totalHigh.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Offers by Type */}
              {['lead_magnet', 'affiliate_program', 'digital_product', 'course', 'membership', 'service'].map((type) => {
                const items = result.recommendations.filter(r => r.type === type);
                if (items.length === 0) return null;

                return (
                  <motion.div key={type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card
                      className={`border-slate-800 bg-slate-900/80 backdrop-blur-sm cursor-pointer transition-all ${
                        expandedType === type ? 'ring-1 ring-emerald-500/30' : ''
                      }`}
                      onClick={() => setExpandedType(expandedType === type ? null : type)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={TYPE_COLORS[type] || 'text-slate-400'}>{TYPE_ICONS[type]}</span>
                            <CardTitle className="text-white text-base capitalize">
                              {type.replace('_', ' ')}s
                            </CardTitle>
                            <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                              {items.length} recommended
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedType === type && (
                        <CardContent className="space-y-3 pt-0">
                          <Separator className="bg-slate-800" />
                          {items.map((offer) => (
                            <div key={offer.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-semibold text-sm">{offer.name}</h4>
                                    <Badge className={`text-[10px] ${getMatchColor(offer.matchScore)} bg-slate-900 border-slate-700`}>
                                      {offer.matchScore}% match
                                    </Badge>
                                  </div>
                                  <p className="text-slate-400 text-sm">{offer.description}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                                      🎯 {offer.difficulty}
                                    </span>
                                    <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded">
                                      💰 {offer.expectedRevenue}
                                    </span>
                                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                                      ⏱ {offer.setupTime}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="relative h-14 w-14">
                                    <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-800" />
                                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3"
                                        strokeDasharray={`${offer.matchScore} ${100 - offer.matchScore}`}
                                        strokeLinecap="round"
                                        className={offer.matchScore >= 85 ? 'text-emerald-400' : offer.matchScore >= 70 ? 'text-amber-400' : 'text-slate-400'}
                                      />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                      {offer.matchScore}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                );
              })}

              {/* New Search */}
              <div className="text-center">
                <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setResult(null)}>
                  Start New Match
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
