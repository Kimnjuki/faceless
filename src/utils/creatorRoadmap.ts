/**
 * AI Creator Roadmaps – Personalized Step-by-Step Plans
 *
 * Generates a structured, multi-phase creator journey based on
 * the user’s niche, skill level, and monetization goal.
 * Fuels the /creator-roadmap page.
 */

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type MonetizationGoal =
  | 'affiliate'
  | 'digital_product'
  | 'adsense'
  | 'ugc_brand_deal'
  | 'saas'
  | 'course'
  | 'membership';

export interface RoadmapInput {
  niche: string;
  skillLevel: SkillLevel;
  goal: MonetizationGoal;
  weeklyHours: number;
  existingAudience?: boolean;
  budget?: 'none' | 'minimal' | 'moderate';
}

export interface RoadmapMilestone {
  phase: number;
  title: string;
  description: string;
  tasks: Array<{
    title: string;
    description: string;
    estimatedTime: string;
    resources: Array<{ label: string; url: string }>;
  }>;
  deliverables: string[];
  duration: string;
}

export interface Roadmap {
  input: RoadmapInput;
  summary: string;
  totalDuration: string;
  milestones: RoadmapMilestone[];
  monetizationPath: Array<{
    stage: string;
    offer: string;
    expectedRevenue: string;
  }>;
}

// ─── Task patterns per goal × skill × niche ──────────────────────────────────

const PHASE_TITLES: Record<number, string> = {
  1: 'Foundation & Strategy',
  2: 'Content Engine Setup',
  3: 'Audience Building',
  4: 'Monetization Launch',
  5: 'Scale & Optimize',
};

function goalLabel(g: MonetizationGoal): string {
  const map: Record<MonetizationGoal, string> = {
    affiliate: 'Affiliate Marketing',
    digital_product: 'Digital Products',
    adsense: 'Ad Revenue (AdSense)',
    ugc_brand_deal: 'UGC & Brand Deals',
    saas: 'SaaS / Tool Building',
    course: 'Online Courses',
    membership: 'Membership Community',
  };
  return map[g];
}

function estimatedTime(taskIndex: number, level: SkillLevel): string {
  const base = level === 'beginner' ? 1.5 : level === 'intermediate' ? 1 : 0.7;
  return `${Math.round((taskIndex + 1) * base)}–${Math.round((taskIndex + 2) * base)} days`;
}

function pillarResources(niche: string): Array<{ label: string; url: string }> {
  return [
    { label: `${niche} Niche Guide`, url: `/resources/niches` },
    { label: 'Faceless Creator Playbook', url: '/resources/templates' },
    { label: 'Platform Setup Guide', url: '/platform-guides' },
  ];
}

// ─── Roadmap generator ────────────────────────────────────────────────────────

export function generateRoadmap(input: RoadmapInput): Roadmap {
  const { niche, skillLevel, goal, weeklyHours, existingAudience } = input;

  const totalWeeks = skillLevel === 'beginner' ? 12 : skillLevel === 'intermediate' ? 8 : 6;
  const summary = `A ${totalWeeks}-week ${goalLabel(goal)} roadmap for "${niche}" at ${skillLevel} level, optimized for ~${weeklyHours} hrs/week.`;

  const milestones: RoadmapMilestone[] = [
    {
      phase: 1,
      title: PHASE_TITLES[1],
      description: `Define your "${niche}" niche, choose your platforms, and set up your anonymous creator identity.`,
      tasks: [
        {
          title: 'Niche Deep Dive',
          description: `Research your "${niche}" niche — competition, audience size, content gaps, and monetization potential.`,
          estimatedTime: estimatedTime(0, skillLevel),
          resources: [
            { label: 'Niche Database', url: '/resources/niches' },
            { label: 'Competitor Analysis Tool', url: '/tools/channel-analyzer' },
            ...pillarResources(niche),
          ],
        },
        {
          title: 'Anonymity Setup',
          description: 'Create anonymous email, social profiles, and brand assets. Ensure no personal info is leaked.',
          estimatedTime: estimatedTime(1, skillLevel),
          resources: [
            { label: 'Anonymity Guide', url: '/getting-started' },
            { label: 'Anonymity Score Dashboard', url: '/creator-studio' },
          ],
        },
        {
          title: 'Platform Selection',
          description: `Choose 1–2 platforms where "${niche}" audiences are most active (YouTube, TikTok, Instagram, Blog).`,
          estimatedTime: estimatedTime(2, skillLevel),
          resources: [
            { label: 'Platform Guides', url: '/platform-guides' },
            { label: 'Content Strategy Templates', url: '/resources/templates' },
          ],
        },
      ],
      deliverables: [
        `Defined "${niche}" niche and content pillars`,
        'Anonymous brand identity created',
        'Primary and secondary platform selected',
        'Content calendar template started',
      ],
      duration: `${skillLevel === 'beginner' ? 2 : 1.5} weeks`,
    },
    {
      phase: 2,
      title: PHASE_TITLES[2],
      description: 'Build a repeatable content engine — scripts, visuals, scheduling.',
      tasks: [
        {
          title: 'Content Batch Workflow',
          description: 'Set up a system to plan, script, produce, and publish content in batches using AI tools.',
          estimatedTime: estimatedTime(0, skillLevel),
          resources: [
            { label: 'Script Generator', url: '/tools/script-generator' },
            { label: 'Idea Generator', url: '/creator-studio' },
            { label: 'Content Calendar AI', url: '/creator-studio' },
          ],
        },
        {
          title: 'Produce First 10 Assets',
          description: 'Create 10 pieces of content (videos, articles, or posts) to build a launch runway.',
          estimatedTime: estimatedTime(1, skillLevel),
          resources: [
            { label: 'Voice Studio', url: '/creator-studio' },
            { label: 'Visual Asset Creator', url: '/creator-studio' },
            { label: 'Storyboard Generator', url: '/creator-studio' },
          ],
        },
        {
          title: 'SEO & Discovery Optimization',
          description: 'Optimize titles, descriptions, thumbnails, and SEO metadata for discoverability.',
          estimatedTime: estimatedTime(2, skillLevel),
          resources: [
            { label: 'SEO Audit Tool', url: '/tools/seo-audit' },
            { label: 'Keyword Research Tool', url: '/tools/keyword-research' },
            { label: 'Trend Scanner', url: '/tools/trend-scanner' },
          ],
        },
      ],
      deliverables: [
        'Repeatable content production workflow',
        '10 published content pieces ready',
        'SEO-optimized titles and metadata',
        'Content calendar populated for 4 weeks',
      ],
      duration: `${skillLevel === 'beginner' ? 3 : 2} weeks`,
    },
    {
      phase: 3,
      title: PHASE_TITLES[3],
      description: 'Grow an audience of targeted, engaged followers across chosen platforms.',
      tasks: [
        {
          title: 'Audience Growth System',
          description: `Implement daily growth tactics — commenting, collaborations, shorts/reels, and community engagement in "${niche}" spaces.`,
          estimatedTime: estimatedTime(0, skillLevel),
          resources: [
            { label: 'Channel Analyzer', url: '/tools/channel-analyzer' },
            { label: 'Performance Monitor', url: '/tools/performance' },
          ],
        },
        {
          title: 'Email List Building',
          description: 'Create lead magnets and set up email capture sequences to own your audience.',
          estimatedTime: estimatedTime(1, skillLevel),
          resources: [
            { label: 'Welcome Sequence Templates', url: '/resources/templates' },
            { label: 'Lead Magnet Ideas', url: '/opportunity-finder' },
          ],
        },
        {
          title: 'Community Foundation',
          description: 'Launch a Discord/Slack community or use built-in community features to foster engagement.',
          estimatedTime: estimatedTime(2, skillLevel),
          resources: [
            { label: 'Community Hub', url: '/community' },
            { label: 'Events Calendar', url: '/community/events' },
          ],
        },
      ],
      deliverables: [
        'Consistent growth in followers/subscribers',
        'Email list of 100+ subscribers',
        'Active community with regular engagement',
      ],
      duration: `${skillLevel === 'beginner' ? 4 : 3} weeks`,
    },
    {
      phase: 4,
      title: PHASE_TITLES[4],
      description: `Launch ${goalLabel(goal)} monetization while maintaining content quality and audience trust.`,
      tasks: [
        {
          title: `Monetization Setup: ${goalLabel(goal)}`,
          description: `Configure and launch your primary monetization channel. Set up tracking, pricing, and landing pages.`,
          estimatedTime: estimatedTime(0, skillLevel),
          resources: [
            { label: 'Monetization Matcher', url: '/monetization-matcher' },
            { label: 'Income Projector', url: '/creator-studio' },
            { label: 'Affiliate Match Engine', url: '/creator-studio' },
          ],
        },
        {
          title: 'First Revenue Campaign',
          description: 'Run your first targeted campaign — affiliate promotion, product launch, or course enrollment.',
          estimatedTime: estimatedTime(1, skillLevel),
          resources: [
            { label: 'Profitability Calculator', url: '/tools/calculator' },
            { label: 'A/B Test Manager', url: '/creator-studio' },
          ],
        },
        {
          title: 'Conversion Optimization',
          description: 'Analyze conversion data, A/B test CTAs, and optimize the funnel for higher conversion rates.',
          estimatedTime: estimatedTime(2, skillLevel),
          resources: [
            { label: 'Analytics Dashboard', url: '/dashboard/analytics' },
            { label: 'A/B Test Manager', url: '/creator-studio' },
          ],
        },
      ],
      deliverables: [
        `First revenue from ${goalLabel(goal)}`,
        'Conversion tracking fully set up',
        'Optimized monetization funnel',
      ],
      duration: `${skillLevel === 'beginner' ? 2 : 1.5} weeks`,
    },
    {
      phase: 5,
      title: PHASE_TITLES[5],
      description: 'Scale revenue, diversify income streams, and systemize the entire creator business.',
      tasks: [
        {
          title: 'Revenue Diversification',
          description: 'Add a second monetization channel (e.g., combine affiliate + course, or ads + products).',
          estimatedTime: estimatedTime(0, skillLevel),
          resources: [
            { label: 'Income Projector', url: '/creator-studio' },
            { label: 'Product Ladder Strategy', url: '/learning-paths' },
          ],
        },
        {
          title: 'Automation & Outsourcing',
          description: 'Identify repetitive tasks and either automate or outsource to free up creation time.',
          estimatedTime: estimatedTime(1, skillLevel),
          resources: [
            { label: 'Content Calendar AI', url: '/creator-studio' },
            { label: 'Script Generator', url: '/tools/script-generator' },
          ],
        },
        {
          title: 'Scale to 6-Figure Business',
          description: 'Implement advanced growth tactics — paid ads, partnerships, product launches, evergreen funnels.',
          estimatedTime: estimatedTime(2, skillLevel),
          resources: [
            { label: 'Creator Analytics Dashboard', url: '/dashboard/analytics' },
            { label: 'Playbook Marketplace', url: '/creator-studio' },
          ],
        },
      ],
      deliverables: [
        'Multiple revenue streams active',
        'Content production systemized',
        '$3,000+/month recurring revenue target',
      ],
      duration: 'ongoing',
    },
  ];

  return {
    input,
    summary,
    totalDuration: `${totalWeeks} weeks`,
    milestones,
    monetizationPath: generateMonetizationPath(goal, skillLevel),
  };
}

function generateMonetizationPath(
  goal: MonetizationGoal,
  skillLevel: SkillLevel,
): Roadmap['monetizationPath'] {
  const earlyRev = skillLevel === 'beginner' ? '$100–500' : '$500–2,000';
  const midRev = skillLevel === 'beginner' ? '$500–2,000' : '$2,000–5,000';
  const scaleRev = skillLevel === 'beginner' ? '$2,000–5,000' : '$5,000–15,000+';

  return [
    { stage: 'Weeks 1–4 (Foundation)', offer: 'Build audience, lead magnets, free content', expectedRevenue: '$0' },
    { stage: 'Weeks 5–8 (Launch)', offer: `First ${goalLabel(goal)} offer`, expectedRevenue: earlyRev },
    { stage: 'Weeks 9–12 (Growth)', offer: `Optimized ${goalLabel(goal)} + add secondary offer`, expectedRevenue: midRev },
    { stage: 'Month 4–6 (Scale)', offer: `Full ${goalLabel(goal)} stack + automations`, expectedRevenue: scaleRev },
  ];
}

// ─── Hydration helpers for the frontend ──────────────────────────────────────

export function getRoadmapFromStorage(): Roadmap | null {
  try {
    const raw = localStorage.getItem('creator_roadmap');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRoadmapToStorage(roadmap: Roadmap) {
  try {
    localStorage.setItem('creator_roadmap', JSON.stringify(roadmap));
  } catch { /* localStorage might be full */ }
}
