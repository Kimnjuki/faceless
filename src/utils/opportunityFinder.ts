/**
 * Content Opportunity Finder
 *
 * Generates post ideas, platform-specific hooks, titles, and formats
 * from niche data and trending patterns. Powers the /opportunity-finder page.
 */

export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'blog' | 'podcast' | 'linkedin';
export type ContentFormat = 'video' | 'short' | 'carousel' | 'article' | 'podcast_episode' | 'infographic';

export interface OpportunityInput {
  niche: string;
  platforms: Platform[];
  goal: 'awareness' | 'engagement' | 'conversion' | 'authority';
  contentTypes: ContentFormat[];
}

export interface ContentIdea {
  id: string;
  title: string;
  platform: Platform;
  format: ContentFormat;
  hook: string;
  angle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedProductionTime: string;
  trendingScore: number; // 1-100
  monetizationPotential: 'low' | 'medium' | 'high';
  seoKeywords: string[];
}

export interface PlatformTemplate {
  platform: Platform;
  format: ContentFormat;
  titleTemplate: string;
  hookPatterns: string[];
  bestPractices: string[];
  optimalLength: string;
  ctaExamples: string[];
}

export interface OpportunityResult {
  input: OpportunityInput;
  ideas: ContentIdea[];
  templates: PlatformTemplate[];
  trendingTopics: string[];
}

// ─── Platform templates ───────────────────────────────────────────────────────

const PLATFORM_TEMPLATES: Record<Platform, Record<ContentFormat, PlatformTemplate>> = {
  youtube: {
    video: {
      platform: 'youtube', format: 'video',
      titleTemplate: 'How I [achieve result] in [timeframe] (Full [niche] Guide)',
      hookPatterns: [
        'Stop [common mistake] — here\'s the right way',
        'I tried [method] for [time] — the results shocked me',
        'The #1 [niche] mistake 90% of creators make',
      ],
      bestPractices: ['Hook in the first 5 seconds', 'Use timestamp chapters', 'End with a strong CTA'],
      optimalLength: '8–15 minutes',
      ctaExamples: ['Subscribe for weekly [niche] tips', 'Download the free checklist in the description'],
    },
    short: {
      platform: 'youtube', format: 'short',
      titleTemplate: '[Quick tip] for [niche] creators',
      hookPatterns: ['This one trick changed my [niche] game'],
      bestPractices: ['Loop-friendly', 'Text overlay for silent viewing'],
      optimalLength: '15–30 seconds',
      ctaExamples: ['Follow for more', 'Save this for later'],
    },
    article: {
      platform: 'youtube', format: 'article',
      titleTemplate: 'The Ultimate [Niche] Guide for [year]',
      hookPatterns: ['If you\'re [struggle], this guide is for you'],
      bestPractices: ['Include YouTube video embeds', 'Use timestamps matching the video'],
      optimalLength: '1500–3000 words',
      ctaExamples: ['Watch the full video above', 'Download the companion worksheet'],
    },
    carousel: {
      platform: 'youtube', format: 'carousel',
      titleTemplate: '[N] [Niche] Tips That Actually Work in [Year]',
      hookPatterns: ['Swipe through to see the full framework'],
      bestPractices: ['One idea per slide', 'Use community posts for carousels'],
      optimalLength: '5–10 slides',
      ctaExamples: ['Comment your favorite tip'],
    },
    podcast_episode: {
      platform: 'youtube', format: 'podcast_episode',
      titleTemplate: 'How [guest] Built a [result] [niche] Business',
      hookPatterns: ['The untold story behind [success]'],
      bestPractices: ['Audio-first with visual supplements'],
      optimalLength: '20–45 minutes',
      ctaExamples: ['Subscribe wherever you get podcasts'],
    },
    infographic: {
      platform: 'youtube', format: 'infographic',
      titleTemplate: '[Niche] Stats That Will [surprise/reveal] in [Year]',
      hookPatterns: ['The data doesn\'t lie — here\'s what\'s working'],
      bestPractices: ['Cite sources', 'Use brand colors'],
      optimalLength: 'Single image or 60s video',
      ctaExamples: ['Share this with a fellow creator'],
    },
  },
  tiktok: {
    short: {
      platform: 'tiktok', format: 'short',
      titleTemplate: 'POV: You\'re a [niche] creator in [year]',
      hookPatterns: ['They don\'t want you to know this', 'This [niche] hack saved me [X] hours'],
      bestPractices: ['Fast pace, 3+ scene changes', 'Use trending sounds', 'First frame text overlay'],
      optimalLength: '15–45 seconds',
      ctaExamples: ['Follow part 2', 'Link in bio'],
    },
    carousel: {
      platform: 'tiktok', format: 'carousel',
      titleTemplate: '[N] [niche] Tips in [N] Slides',
      hookPatterns: ['Save this for your next [niche] post'],
      bestPractices: ['Bold, readable text', 'Consistent visual theme'],
      optimalLength: '5–10 slides',
      ctaExamples: ['Share with someone who needs this'],
    },
    video: {
      platform: 'tiktok', format: 'video',
      titleTemplate: 'Day in the life of a [niche] creator',
      hookPatterns: ['Here\'s what nobody tells you about [niche]'],
      bestPractices: ['Authentic, raw style', 'Trend hijacking'],
      optimalLength: '60–120 seconds',
      ctaExamples: ['Follow for daily [niche] content'],
    },
    article: {
      platform: 'tiktok', format: 'article',
      titleTemplate: 'The [niche] Strategy That Actually Works',
      hookPatterns: ['Read this later — it\'ll save you months'],
      bestPractices: ['Optimize LinkedIn/article version'],
      optimalLength: 'Brief description + link',
      ctaExamples: ['Link in bio to full guide'],
    },
    podcast_episode: {
      platform: 'tiktok', format: 'podcast_episode',
      titleTemplate: '[Guest] Reveals [niche] Secret',
      hookPatterns: ['Wait until the end 👀'],
      bestPractices: ['Clip the best 60 seconds'],
      optimalLength: '60 seconds',
      ctaExamples: ['Full episode in bio'],
    },
    infographic: {
      platform: 'tiktok', format: 'infographic',
      titleTemplate: '[Niche] Stats That\'ll Blow Your Mind',
      hookPatterns: ['Numbers don\'t lie'],
      bestPractices: ['Fast reveal, one stat at a time'],
      optimalLength: '15–30 seconds',
      ctaExamples: ['Save this'],
    },
  },
  instagram: {
    carousel: {
      platform: 'instagram', format: 'carousel',
      titleTemplate: 'The [niche] Creator Roadmap → [N] Steps',
      hookPatterns: ['Save this post for your [niche] journey'],
      bestPractices: ['Cover slide with title', 'Minimal text per slide'],
      optimalLength: '7–10 slides',
      ctaExamples: ['Comment "guide" for the PDF'],
    },
    short: {
      platform: 'instagram', format: 'short',
      titleTemplate: '[Quick insight] for [niche] creators',
      hookPatterns: ['If you\'re [struggle], watch this'],
      bestPractices: ['Relatable + educational', 'Use trending audio'],
      optimalLength: '15–30 seconds',
      ctaExamples: ['DM me for the template'],
    },
    video: {
      platform: 'instagram', format: 'video',
      titleTemplate: 'How I [achieved result] as a [niche] creator',
      hookPatterns: ['This took me [X months] to figure out'],
      bestPractices: ['Educational with personal story', 'End screen CTA'],
      optimalLength: '60–90 seconds',
      ctaExamples: ['Tag a creator who needs this'],
    },
    article: {
      platform: 'instagram', format: 'article',
      titleTemplate: 'The [niche] Creator\'s Guide to [Topic]',
      hookPatterns: ['Swipe up for the full guide'],
      bestPractices: ['Use link sticker', 'Preview in story'],
      optimalLength: 'Brief teaser',
      ctaExamples: ['Link in bio'],
    },
    podcast_episode: {
      platform: 'instagram', format: 'podcast_episode',
      titleTemplate: 'Behind the Scenes: [Niche] Creator Chat',
      hookPatterns: ['You won\'t believe what they said'],
      bestPractices: ['Clip the most quotable moment'],
      optimalLength: '60 seconds',
      ctaExamples: ['Full episode @ link in bio'],
    },
    infographic: {
      platform: 'instagram', format: 'infographic',
      titleTemplate: '[Niche] Income Breakdown [Month] [Year]',
      hookPatterns: ['Real numbers, no fluff'],
      bestPractices: ['Clean, brand-consistent design'],
      optimalLength: '5–7 slides',
      ctaExamples: ['Drop a 💰 if you want more income breakdowns'],
    },
  },
  blog: {
    article: {
      platform: 'blog', format: 'article',
      titleTemplate: 'How to [achieve result] in [niche]: The Complete Guide',
      hookPatterns: ['This is the most comprehensive [niche] guide you\'ll find'],
      bestPractices: ['SEO keyword focus', 'Internal linking', 'Clear headings'],
      optimalLength: '2000–4000 words',
      ctaExamples: ['Subscribe for weekly updates', 'Download the companion checklist'],
    },
    video: {
      platform: 'blog', format: 'video',
      titleTemplate: '[Niche] Tutorial: [Specific Skill] Explained',
      hookPatterns: ['Watch the full walkthrough below'],
      bestPractices: ['Embed in blog post', 'Provide written summary'],
      optimalLength: '5–15 minutes',
      ctaExamples: ['Embedded in relevant blog sections'],
    },
    carousel: {
      platform: 'blog', format: 'carousel',
      titleTemplate: '[Niche] Insights Visualized',
      hookPatterns: ['Visual summary of the data'],
      bestPractices: ['Use for data posts', 'Pin to top of article'],
      optimalLength: '4–8 elements',
      ctaExamples: ['Share on social', 'Pin on Pinterest'],
    },
    short: {
      platform: 'blog', format: 'short',
      titleTemplate: '[Quick Tip]: [Specific Advice]',
      hookPatterns: ['Short, actionable tip format'],
      bestPractices: ['Standalone or in sidebar', 'Shareable quote format'],
      optimalLength: '100–200 words',
      ctaExamples: ['Share this tip on Twitter'],
    },
    podcast_episode: {
      platform: 'blog', format: 'podcast_episode',
      titleTemplate: 'Podcast: [Topic] with [Guest Name]',
      hookPatterns: ['Show notes format with timestamps'],
      bestPractices: ['Full transcript for SEO', 'Key takeaways section'],
      optimalLength: '1500–2500 words',
      ctaExamples: ['Subscribe to the podcast'],
    },
    infographic: {
      platform: 'blog', format: 'infographic',
      titleTemplate: '[Niche] Statistics Every Creator Should Know [Year]',
      hookPatterns: ['Data-backed insights'],
      bestPractices: ['Embed with alt text', 'Link to sources'],
      optimalLength: 'Full-width image',
      ctaExamples: ['Embed code for sharing'],
    },
  },
  podcast: {
    podcast_episode: {
      platform: 'podcast', format: 'podcast_episode',
      titleTemplate: 'EP [N]: [Compelling Topic] — [Niche] Insights',
      hookPatterns: ['Today we\'re tackling the biggest [niche] challenge'],
      bestPractices: ['Consistent intro/outro', 'Show notes with timestamps'],
      optimalLength: '20–45 minutes',
      ctaExamples: ['Rate & review', 'Join the community'],
    },
    video: {
      platform: 'podcast', format: 'video',
      titleTemplate: 'Video Podcast: [Conversational Topic]',
      hookPatterns: ['Visual podcast format'],
      bestPractices: ['YouTube versions get better reach'],
      optimalLength: '20–45 minutes',
      ctaExamples: ['Watch on YouTube'],
    },
    article: {
      platform: 'podcast', format: 'article',
      titleTemplate: 'Podcast Recap: [Episode Title]',
      hookPatterns: ['Missed the episode? Here\'s what you need to know'],
      bestPractices: ['SEO-friendly show notes', 'Key quotes highlighted'],
      optimalLength: '1000–2000 words',
      ctaExamples: ['Listen to full episode'],
    },
    short: {
      platform: 'podcast', format: 'short',
      titleTemplate: 'Best of: [Powerful Quote]',
      hookPatterns: ['The most powerful 30 seconds from this episode'],
      bestPractices: ['Promote on social', 'Use audiogram visual'],
      optimalLength: '30–60 seconds',
      ctaExamples: ['Full episode link in bio'],
    },
    carousel: {
      platform: 'podcast', format: 'carousel',
      titleTemplate: 'Top [N] Takeaways from [Episode]',
      hookPatterns: ['Save these key insights'],
      bestPractices: ['Post-episode summary carousel'],
      optimalLength: '5–8 slides',
      ctaExamples: ['Save for later reference'],
    },
    infographic: {
      platform: 'podcast', format: 'infographic',
      titleTemplate: 'Episode [N]: Key Stats & Insights',
      hookPatterns: ['Visual episode summary'],
      bestPractices: ['Social promotion asset'],
      optimalLength: 'Single tall image',
      ctaExamples: ['Share this episode'],
    },
  },
  linkedin: {
    article: {
      platform: 'linkedin', format: 'article',
      titleTemplate: 'How I Built a [Niche] Business Anonymously',
      hookPatterns: ['Most people don\'t know this about [niche]'],
      bestPractices: ['Professional but personal', 'Value-first, no gatekeeping'],
      optimalLength: '1000–2000 words',
      ctaExamples: ['Connect to follow the journey', 'Comment your biggest takeaway'],
    },
    carousel: {
      platform: 'linkedin', format: 'carousel',
      titleTemplate: '[N] [Niche] Lessons from [Experience]',
      hookPatterns: ['Scroll through → this will save you [X]'],
      bestPractices: ['Text-heavy carousels perform', 'Numbered lists work'],
      optimalLength: '7–12 slides',
      ctaExamples: ['Repost to help a creator friend'],
    },
    short: {
      platform: 'linkedin', format: 'short',
      titleTemplate: 'Daily [Niche] Tip #[N]',
      hookPatterns: ['Quick insight that changed everything'],
      bestPractices: ['Post daily for consistency', 'Reply to comments immediately'],
      optimalLength: '100–300 words',
      ctaExamples: ['Subscribe to the newsletter'],
    },
    video: {
      platform: 'linkedin', format: 'video',
      titleTemplate: '[Niche] Advice I Wish I Knew Earlier',
      hookPatterns: ['Face-to-camera, authentic delivery'],
      bestPractices: ['Caption-heavy, mute-optimized'],
      optimalLength: '1–3 minutes',
      ctaExamples: ['Comment your experience'],
    },
    podcast_episode: {
      platform: 'linkedin', format: 'podcast_episode',
      titleTemplate: 'Podcast Clip: [Insight] with [Guest]',
      hookPatterns: ['LinkedIn-native podcast clips'],
      bestPractices: ['Edit for professional audience'],
      optimalLength: '1–2 minutes',
      ctaExamples: ['Full episode link in comments'],
    },
    infographic: {
      platform: 'linkedin', format: 'infographic',
      titleTemplate: 'The State of [Niche] in [Year]',
      hookPatterns: ['Data every [niche] creator needs to see'],
      bestPractices: ['Cite research, timestamp stats'],
      optimalLength: 'Single image',
      ctaExamples: ['Save this for future reference'],
    },
  },
};

// ─── Idea generation ──────────────────────────────────────────────────────────

const IDEA_PATTERNS: Record<string, Array<{ title: (n: string) => string; hook: (n: string) => string; difficulty: string }>> = {
  youtube_video: [
    { title: n => `How I Make $${Math.floor(Math.random() * 5000 + 1000)}/Month with ${n} (Full Breakdown)`, hook: n => `I went from $0 to $${Math.floor(Math.random() * 5000 + 1000)}/mo in ${n} — here's exactly how`, difficulty: 'medium' },
    { title: n => `${n} for Beginners: Complete Step-by-Step Guide`, hook: n => `If you're starting ${n} today, do these 5 things first`, difficulty: 'easy' },
    { title: n => `The ${n} Tools I Use Every Day (Honest Reviews)`, hook: n => `After testing 50+ ${n} tools, these 7 are the only ones worth your money`, difficulty: 'easy' },
    { title: n => `Why Your ${n} Content Isn't Growing (Fix This)`, hook: n => `I spent 6 months failing at ${n} — then I changed ONE thing`, difficulty: 'medium' },
    { title: n => `I Tried [Popular Method] for ${n} — Here's What Happened`, hook: n => `Everyone says [popular method] works for ${n}. I tried it for 30 days. Honest results.`, difficulty: 'medium' },
    { title: n => `${n} Case Study: From Zero to $10K in 90 Days`, hook: n => `This ${n} creator went from 0 to $10K in 90 days. Here's their exact playbook.`, difficulty: 'hard' },
    { title: n => `The Future of ${n} in [Year]: Trends You Can't Ignore`, hook: n => `${n} is changing fast — here's what will matter most this year`, difficulty: 'hard' },
  ],
  tiktok_short: [
    { title: n => `This ${n} Hack Will Save You Hours`, hook: n => `I wish I knew this ${n} hack sooner`, difficulty: 'easy' },
    { title: n => `POV: You're a ${n} Creator`, hook: n => `The ${n} creator struggle is real`, difficulty: 'easy' },
    { title: n => `${n} Tips in 15 Seconds`, hook: n => `Quick ${n} tip that changed everything`, difficulty: 'easy' },
  ],
  blog_article: [
    { title: n => `The Complete ${n} Creator Toolkit [Year]`, hook: n => `Everything you need to succeed in ${n}`, difficulty: 'medium' },
    { title: n => `${n} vs [Competing Niche]: Which is More Profitable?`, hook: n => `Before choosing ${n}, read this comparison`, difficulty: 'medium' },
    { title: n => `10 ${n} Mistakes That Cost Me [Amount]`, hook: n => `Don't make these ${n} mistakes — they're expensive`, difficulty: 'easy' },
  ],
  instagram_carousel: [
    { title: n => `The ${n} Creator Roadmap: 5 Stages`, hook: n => `Your ${n} journey mapped out in 5 stages`, difficulty: 'medium' },
    { title: n => `${n} Income Streams Ranked by Difficulty`, hook: n => `How to monetize ${n} content`, difficulty: 'medium' },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateOpportunities(input: OpportunityInput): OpportunityResult {
  const { niche, platforms, goal, contentTypes } = input;

  const ideas: ContentIdea[] = [];
  const seenTitles = new Set<string>();
  let idCounter = 0;

  for (const platform of platforms) {
    for (const format of contentTypes) {
      const key = `${platform}_${format}`;
      const patterns = IDEA_PATTERNS[key] || [];
      // Generate 3–5 ideas per platform/format combo
      const count = Math.min(patterns.length, Math.floor(Math.random() * 3) + 3);
      const selected = shuffle(patterns).slice(0, count);

      for (const p of selected) {
        const title = p.title(niche);
        if (seenTitles.has(title)) continue;
        seenTitles.add(title);
        ideas.push({
          id: `idea-${++idCounter}`,
          title,
          platform,
          format,
          hook: p.hook(niche),
          angle: goal === 'awareness' ? 'Educational' : goal === 'conversion' ? 'Value-first pitch' : 'Authority building',
          difficulty: p.difficulty as 'easy' | 'medium' | 'hard',
          estimatedProductionTime: format === 'short' ? '1–2 hours' : format === 'video' ? '4–8 hours' : '2–4 hours',
          trendingScore: Math.floor(Math.random() * 40) + 60,
          monetizationPotential: format === 'video' || format === 'article' ? 'high' : 'medium',
          seoKeywords: [niche, `${niche} ${goal}`, `${niche} ${format}`, `${niche} tips`, `${niche} monetization`],
        });
      }
    }
  }

  const templates: PlatformTemplate[] = [];
  for (const platform of platforms) {
    for (const format of contentTypes) {
      const t = PLATFORM_TEMPLATES[platform]?.[format];
      if (t) templates.push(t);
    }
  }

  const trendingTopics = [
    `AI-powered ${niche} creation`,
    `${niche} automation tools`,
    `Anonymous ${niche} success stories`,
    `${niche} monetization in [Year]`,
    `${niche} beginner mistakes`,
    `${niche} × [trending category] crossover`,
  ];

  return { input, ideas: ideas.slice(0, 20), templates: templates.slice(0, 12), trendingTopics };
}
