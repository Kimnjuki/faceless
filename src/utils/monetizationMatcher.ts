/**
 * Monetization Matcher
 *
 * Recommends affiliate programs, products, courses, and offers
 * based on creator stage, niche, and monetization path.
 * Powers the /monetization-matcher page.
 */

export type CreatorStage = 'starting' | 'growing' | 'scaling' | 'established';
export type Niche = string;

export interface MonetizationProfile {
  stage: CreatorStage;
  niche: Niche;
  audienceSize: string;
  monthlyTraffic: string;
  existingRevenue: string;
  goals: string[];
}

export interface RecommendedOffer {
  id: string;
  type: 'affiliate_program' | 'course' | 'digital_product' | 'service' | 'membership' | 'lead_magnet';
  name: string;
  description: string;
  icon: string;
  matchScore: number; // 0–100
  difficulty: 'easy' | 'medium' | 'hard';
  expectedRevenue: string;
  setupTime: string;
  requirements: string[];
  link?: string;
  tags: string[];
}

export interface RevenueProjection {
  monthly: Array<{ month: number; low: number; high: number }>;
  totalLow: number;
  totalHigh: number;
  breakevenMonth: number;
}

export interface MonetizationResult {
  profile: MonetizationProfile;
  recommendations: RecommendedOffer[];
  revenueProjection: RevenueProjection;
  nextSteps: string[];
}

// ─── Offer data (hardcoded for now, replaces Convex queries) ──────────────────

const AFFILIATE_OFFERS: RecommendedOffer[] = [
  {
    id: 'aff-1', type: 'affiliate_program',
    name: 'TubeBuddy', description: 'YouTube keyword research & optimization tool. 30% recurring commission.',
    icon: '📊', matchScore: 85, difficulty: 'easy',
    expectedRevenue: '$50–300/mo', setupTime: '1 day',
    requirements: ['YouTube channel', 'Basic SEO knowledge'],
    tags: ['youtube', 'seo', 'tools', 'beginner'],
  },
  {
    id: 'aff-2', type: 'affiliate_program',
    name: 'Canva Pro', description: 'Design tool for thumbnails, graphics, and social media visuals. Recurring commission.',
    icon: '🎨', matchScore: 90, difficulty: 'easy',
    expectedRevenue: '$20–150/mo', setupTime: '1 day',
    requirements: ['Any content niche'],
    tags: ['design', 'tools', 'beginner', 'any_niche'],
  },
  {
    id: 'aff-3', type: 'affiliate_program',
    name: 'VidIQ', description: 'YouTube growth suite with AI-powered keyword & trend analysis.',
    icon: '📈', matchScore: 80, difficulty: 'easy',
    expectedRevenue: '$50–400/mo', setupTime: '1 day',
    requirements: ['YouTube channel'],
    tags: ['youtube', 'growth', 'tools'],
  },
  {
    id: 'aff-4', type: 'affiliate_program',
    name: 'ElevenLabs', description: 'AI voice cloning & text-to-speech for faceless content. High conversion rate.',
    icon: '🎙️', matchScore: 92, difficulty: 'easy',
    expectedRevenue: '$30–200/mo', setupTime: '1 day',
    requirements: ['Voiceover content', 'Faceless niche'],
    tags: ['voiceover', 'faceless', 'ai', 'tools'],
  },
  {
    id: 'aff-5', type: 'affiliate_program',
    name: 'InVideo AI', description: 'AI video generation for faceless content. Trending product with high commissions.',
    icon: '🎬', matchScore: 88, difficulty: 'easy',
    expectedRevenue: '$50–500/mo', setupTime: '1 day',
    requirements: ['Video content'],
    tags: ['video', 'ai', 'trending', 'tools'],
  },
  {
    id: 'aff-6', type: 'affiliate_program',
    name: 'Bluehost / Hosting', description: 'Web hosting affiliate — high ticket, evergreen, converts well for creator blogs.',
    icon: '🌐', matchScore: 75, difficulty: 'medium',
    expectedRevenue: '$65–150/sale', setupTime: '1 day',
    requirements: ['Blog or website'],
    tags: ['blogging', 'hosting', 'evergreen'],
  },
  {
    id: 'aff-7', type: 'affiliate_program',
    name: 'ConvertKit', description: 'Email marketing for creators. Recurring affiliate commissions.',
    icon: '📧', matchScore: 82, difficulty: 'easy',
    expectedRevenue: '$30–200/mo', setupTime: '1 day',
    requirements: ['Email list building content'],
    tags: ['email', 'marketing', 'tools'],
  },
  {
    id: 'aff-8', type: 'affiliate_program',
    name: 'Semrush', description: 'SEO & competitor research tool. High-ticket recurring.',
    icon: '🔍', matchScore: 70, difficulty: 'medium',
    expectedRevenue: '$100–500/mo', setupTime: '1–2 days',
    requirements: ['SEO content strategy'],
    tags: ['seo', 'research', 'advanced'],
  },
];

const DIGITAL_PRODUCT_OFFERS: RecommendedOffer[] = [
  {
    id: 'prod-1', type: 'digital_product',
    name: 'Niche Research Kit', description: 'Pre-researched niche data packs with audience insights, content gaps, and monetization angles.',
    icon: '📦', matchScore: 85, difficulty: 'medium',
    expectedRevenue: '$27–97/sale', setupTime: '1–2 weeks',
    requirements: ['Niche research completed', 'Basic PDF creation'],
    tags: ['niche', 'templates', 'intermediate'],
  },
  {
    id: 'prod-2', type: 'digital_product',
    name: 'Content Template Bundle', description: '50+ proven content templates for YouTube, TikTok, Instagram, and blogs.',
    icon: '📋', matchScore: 88, difficulty: 'easy',
    expectedRevenue: '$17–47/sale', setupTime: '1 week',
    requirements: ['Existing content examples'],
    tags: ['templates', 'content', 'beginner'],
  },
  {
    id: 'prod-3', type: 'digital_product',
    name: 'Affiliate Marketing Playbook', description: 'Step-by-step affiliate strategy for faceless creators with swipe files.',
    icon: '📚', matchScore: 82, difficulty: 'medium',
    expectedRevenue: '$37–97/sale', setupTime: '2–3 weeks',
    requirements: ['Affiliate experience', 'Case studies'],
    tags: ['affiliate', 'playbook', 'intermediate'],
  },
  {
    id: 'prod-4', type: 'digital_product',
    name: 'Automation Workflow Bundle', description: 'Pre-built Zapier/Make automation templates for content publishing & repurposing.',
    icon: '⚡', matchScore: 76, difficulty: 'hard',
    expectedRevenue: '$47–147/sale', setupTime: '3–4 weeks',
    requirements: ['Technical skills', 'Tool accounts'],
    tags: ['automation', 'workflow', 'advanced'],
  },
];

const COURSE_OFFERS: RecommendedOffer[] = [
  {
    id: 'course-1', type: 'course',
    name: 'Faceless YouTube Mastery', description: 'Complete course on building a profitable faceless YouTube channel from scratch.',
    icon: '🎓', matchScore: 90, difficulty: 'hard',
    expectedRevenue: '$197–497/sale', setupTime: '4–8 weeks',
    requirements: ['Deep expertise', 'Proven results', 'Video production'],
    tags: ['youtube', 'faceless', 'course', 'advanced'],
  },
  {
    id: 'course-2', type: 'course',
    name: 'Affiliate Income Accelerator', description: 'Go from $0 to $5K/month in affiliate income with proven blueprints.',
    icon: '💰', matchScore: 85, difficulty: 'hard',
    expectedRevenue: '$147–397/sale', setupTime: '4–6 weeks',
    requirements: ['Affiliate income proof', 'Case studies', 'Curriculum design'],
    tags: ['affiliate', 'income', 'course', 'intermediate'],
  },
  {
    id: 'course-3', type: 'course',
    name: 'Anonymous Creator Bootcamp', description: '30-day transformation from unknown to anonymous creator generating income.',
    icon: '🚀', matchScore: 92, difficulty: 'medium',
    expectedRevenue: '$97–297/sale', setupTime: '3–5 weeks',
    requirements: ['Track record', 'Reproducible system'],
    tags: ['anonymity', 'beginner', 'bootcamp', 'all_levels'],
  },
  {
    id: 'course-4', type: 'course',
    name: 'Instagram Carousel Growth System', description: 'Grow and monetize with Instagram carousels — the highest-engagement format.',
    icon: '📱', matchScore: 78, difficulty: 'medium',
    expectedRevenue: '$67–197/sale', setupTime: '3–5 weeks',
    requirements: ['Instagram presence', 'Design skills'],
    tags: ['instagram', 'carousel', 'growth'],
  },
];

const MEMBERSHIP_OFFERS: RecommendedOffer[] = [
  {
    id: 'memb-1', type: 'membership',
    name: 'Inner Circle Community', description: 'Private community with monthly training, templates, and creator Q&A.',
    icon: '👥', matchScore: 85, difficulty: 'medium',
    expectedRevenue: '$29–97/mo per member', setupTime: '2–4 weeks',
    requirements: ['Existing audience', 'Time for engagement'],
    tags: ['community', 'subscription', 'intermediate'],
  },
  {
    id: 'memb-2', type: 'membership',
    name: 'Monthly Content Kit', description: 'Curated monthly content packs — scripts, thumbnails, and trend reports.',
    icon: '📦', matchScore: 80, difficulty: 'medium',
    expectedRevenue: '$19–47/mo per subscriber', setupTime: '3–4 weeks',
    requirements: ['Consistent content production'],
    tags: ['content', 'subscription', 'recurring'],
  },
];

const LEAD_MAGNET_OFFERS: RecommendedOffer[] = [
  {
    id: 'lead-1', type: 'lead_magnet',
    name: 'Faceless Creator Checklist', description: 'Free 10-step checklist to launch an anonymous content business in 7 days.',
    icon: '✅', matchScore: 95, difficulty: 'easy',
    expectedRevenue: 'Email capture → $5–50/hundred subs', setupTime: '2–3 days',
    requirements: ['None — start here'],
    tags: ['lead_magnet', 'beginner', 'email_list'],
  },
  {
    id: 'lead-2', type: 'lead_magnet',
    name: 'Niche Profitability Scorecard', description: 'Interactive tool to score any niche for profitability and demand.',
    icon: '📊', matchScore: 88, difficulty: 'easy',
    expectedRevenue: 'Email capture → qualified leads', setupTime: '3–5 days',
    requirements: ['Niche research knowledge'],
    tags: ['lead_magnet', 'niche', 'tool'],
  },
  {
    id: 'lead-3', type: 'lead_magnet',
    name: 'Content Calendar Template (Notion)', description: 'Free pre-built Notion content calendar for 3 months of planning.',
    icon: '📅', matchScore: 90, difficulty: 'easy',
    expectedRevenue: 'Email capture + upsell to paid template', setupTime: '1–2 days',
    requirements: ['None'],
    tags: ['lead_magnet', 'template', 'notion'],
  },
];

const ALL_OFFERS = [
  ...AFFILIATE_OFFERS,
  ...DIGITAL_PRODUCT_OFFERS,
  ...COURSE_OFFERS,
  ...MEMBERSHIP_OFFERS,
  ...LEAD_MAGNET_OFFERS,
];

// ─── Matching logic ──────────────────────────────────────────────────────────

function stageMatchScore(offer: RecommendedOffer, stage: CreatorStage): number {
  const stageTags: Record<CreatorStage, string[]> = {
    starting: ['beginner', 'all_levels', 'lead_magnet', 'easy'],
    growing: ['beginner', 'intermediate', 'easy', 'medium', 'tools'],
    scaling: ['intermediate', 'advanced', 'medium', 'hard', 'course'],
    established: ['advanced', 'hard', 'course', 'subscription', 'recurring'],
  };
  const goodTags = stageTags[stage];
  const hasMatch = offer.tags.some(t => goodTags.includes(t));
  return hasMatch ? 10 : -10;
}

function difficultyMatchScore(offer: RecommendedOffer, stage: CreatorStage): number {
  const map: Record<CreatorStage, number> = {
    starting: 1, growing: 2, scaling: 3, established: 4,
  };
  const diffMap: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
  const diff = diffMap[offer.difficulty] || 2;
  const stageVal = map[stage];
  return stageVal >= diff ? 15 : (stageVal + 1 >= diff ? 5 : -5);
}

export function matchMonetization(profile: MonetizationProfile): MonetizationResult {
  const scored = ALL_OFFERS.map(offer => {
    const baseScore = offer.matchScore;
    const stageBonus = stageMatchScore(offer, profile.stage);
    const diffBonus = difficultyMatchScore(offer, profile.stage);
    const totalScore = Math.min(100, Math.max(0, baseScore + stageBonus + diffBonus));
    return { ...offer, matchScore: Math.round(totalScore) };
  });

  const recommendations = scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);

  const revenueProjection = generateRevenueProjection(profile);
  const nextSteps = generateNextSteps(profile, recommendations.slice(0, 3));

  return { profile, recommendations, revenueProjection, nextSteps };
}

function generateRevenueProjection(profile: MonetizationProfile): RevenueProjection {
  const base = profile.stage === 'starting' ? 200 :
    profile.stage === 'growing' ? 1000 :
    profile.stage === 'scaling' ? 3000 : 8000;

  const monthly: Array<{ month: number; low: number; high: number }> = [];
  for (let m = 1; m <= 12; m++) {
    const growth = Math.pow(1 + (profile.stage === 'starting' ? 0.4 : profile.stage === 'growing' ? 0.25 : 0.15), m - 1);
    monthly.push({
      month: m,
      low: Math.round(base * growth * 0.8),
      high: Math.round(base * growth * 1.2),
    });
  }

  return {
    monthly,
    totalLow: monthly.reduce((s, m) => s + m.low, 0),
    totalHigh: monthly.reduce((s, m) => s + m.high, 0),
    breakevenMonth: 1,
  };
}

function generateNextSteps(profile: MonetizationProfile, topRecommendations: RecommendedOffer[]): string[] {
  const steps: string[] = [];
  steps.push(`Start with a free lead magnet to build your email list (${topRecommendations.find(r => r.type === 'lead_magnet')?.name || 'try our Faceless Creator Checklist'})`);
  steps.push(`Promote 1–2 affiliate programs that match your ${profile.niche} niche content`);
  if (profile.stage === 'growing' || profile.stage === 'scaling') {
    steps.push('Create a digital product (template, kit, or playbook) — high margin, scalable');
  }
  if (profile.stage === 'scaling' || profile.stage === 'established') {
    steps.push('Launch a paid course or membership for deeper monetization');
  }
  steps.push('Track everything in your Creator Analytics Dashboard and double down on what converts');
  return steps;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function getMonetizationProfileFromStorage(): MonetizationProfile | null {
  try {
    const raw = localStorage.getItem('monetization_profile');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveMonetizationProfileToStorage(profile: MonetizationProfile) {
  localStorage.setItem('monetization_profile', JSON.stringify(profile));
}
