/**
 * Static fallback for the four core platform guides.
 * Ensures guides are always visible on /platform-guides even when Convex returns empty.
 */
export interface PlatformGuideFallback {
  slug: string;
  platform: string;
  title: string;
  excerpt: string;
  category: string;
  difficultyLevel: string;
  readTime: number;
  toolTags: string[];
  content: string;
  exampleApplications?: Record<string, unknown>;
}

export const PLATFORM_GUIDES_FALLBACK: PlatformGuideFallback[] = [
  {
    slug: "youtube-growth-guide-faceless-and-on-camera",
    platform: "youtube",
    title: "The Complete YouTube Growth Guide: Faceless and On-Camera Strategies That Actually Work in 2026",
    excerpt: "Whether you want to build a faceless YouTube channel or show up on camera, this guide breaks down the exact content strategies, SEO tactics, and workflow systems that drive real subscriber growth and income on YouTube in 2026.",
    category: "platform-strategy",
    difficultyLevel: "beginner",
    readTime: 9,
    toolTags: ["vidIQ", "TubeBuddy", "CapCut", "ElevenLabs", "Canva", "ChatGPT", "Descript"],
    content: `YouTube remains the single most powerful platform for long-term content income, and that remains true in 2026. It is the world's second-largest search engine, it pays some of the highest CPMs in the creator economy, and it rewards consistency and quality with compounding returns over time. Whether you are building a fully anonymous, faceless channel or you want to grow as an on-camera personality, the fundamentals are the same: pick a niche, understand your audience, and optimize relentlessly.

Let us walk through everything you need to know to build and scale a YouTube channel that generates real, sustainable results.

## Choosing Your Niche and Content Style

Before you record a single video, you need to get clear on your niche. Not just a topic area — a specific audience with specific problems. Finance is not a niche. "Budgeting strategies for Kenyan millennials earning under KES 100,000 per month" is a niche. The narrower you go at the start, the faster you grow, because the algorithm can place your content in front of exactly the right viewer.

Once you have your niche, spend time mapping out 8 to 10 subtopics you can cover for the next six months without running out of ideas. This becomes your content pillar system, and it is the foundation of everything else.

Next, decide on your delivery format. Are you going faceless or on-camera? Neither is better — both can generate six and seven figures — but they require different production approaches.

**Faceless YouTube** works best for educational, explainer, and tutorial content. You are using screen recordings, B-roll footage, stock visuals, motion graphics, whiteboard-style animations, and voiceover to deliver value without ever showing your face. This format is ideal if you value privacy, if you want to batch-produce content at scale, or if you are in a niche where the information matters more than the personality. Finance, tech tutorials, motivational content, history, and true crime all perform brilliantly as faceless channels.

**On-camera YouTube** creates faster audience connection and trust. Your personality becomes a core part of the brand. This works especially well for coaching, lifestyle, commentary, personal development, and niche vlogs where viewers follow the person as much as the content. The trade-off is that production depends heavily on your schedule and energy, whereas faceless channels can theoretically be outsourced and automated.

## How to Produce High-Quality Faceless YouTube Videos

Faceless video production is a workflow game. Once your system is set up, you can publish consistently without burning out. Start with the script. Your script is the backbone of a faceless video because you do not have facial expressions or body language to keep viewers engaged. Every line needs to earn its place. Write with a strong hook in the first three to five seconds — a surprising fact, a bold claim, or a question that makes the viewer feel like they need to keep watching.

For visuals, match every section of your script with relevant footage or graphics. Voiceover can be your own recorded voice or an AI-generated voice through tools like ElevenLabs. Either works, but consistency is critical. Editing pace is what separates average faceless channels from great ones. Keep your cuts tight. Remove every pause, filler, and dead second.

## How to Produce On-Camera YouTube Videos That Hold Attention

If you are going on-camera, your production environment matters from day one. You do not need a professional studio, but you do need good lighting, a clean or intentional background, and above all else, clear audio. Invest in a decent USB or XLR microphone before you invest in a camera upgrade.

Structure your videos the same way a great teacher would structure a lesson. Open with a promise, then deliver logically, use cutaways and screen shares to support your points, and close with a clear call to action. On-camera creators have a unique advantage: authenticity. Share your failures as openly as your wins. Respond to comments. Show the process, not just the result.

## YouTube SEO: How to Get Found and Keep Growing

Your video title is your single most important SEO asset. A strong title is keyword-rich, click-worthy, and honest about what the viewer will get. Use tools like TubeBuddy or vidIQ to research the actual keywords your target audience is typing into the search bar.

Your description should read like a mini-article. Include your primary keyword in the first 100 characters, then expand naturally with related terms, a summary of what the video covers, links to related resources, and timestamps for key sections. Thumbnails directly affect your click-through rate — which is one of the strongest signals YouTube uses. Invest time in creating clean, bold, high-contrast thumbnails.

## YouTube Shorts: The Fastest Path to New Subscribers

Shorts are YouTube's vertical short-form video format. The most efficient Shorts strategy is to repurpose your existing long-form videos. Identify the most engaging 30 to 60 second moment from each video and repackage it as a vertical Short. Add bold captions, dynamic text overlays, and a clear call to action.

## Building a Sustainable YouTube Content System

The channels that last are the ones that treat content creation as a system. Develop a weekly or bi-weekly production workflow. Batch as much as possible. Track your analytics monthly. YouTube rewards creators who stay consistent over long periods of time. Trust the process, optimize continuously, and you will build an asset that generates traffic and income for years.`,
    exampleApplications: {
      faceless_formats: ["Screen recordings with voiceover", "B-roll + narration explainers", "Whiteboard animations", "AI-generated avatar videos", "Slideshow-style educational content"],
      on_camera_formats: ["Talking head tutorials", "Vlog-style content", "Commentary and reaction videos", "Interview-based content", "Live Q&A and tutorials"],
      seo_tips: ["Use exact-match keyword phrases in titles", "Add timestamps to every video over 5 minutes", "Write 300+ word descriptions with natural keyword usage", "Research competition before choosing a video topic"],
    },
  },
  {
    slug: "tiktok-growth-guide-faceless-and-on-camera",
    platform: "tiktok",
    title: "How to Grow on TikTok in 2026: The Complete Guide for Faceless and Face-on-Camera Creators",
    excerpt: "TikTok has evolved into a serious search and discovery engine. This guide covers everything from content formats and algorithm triggers to faceless TikTok strategies and monetization funnels that work for creators in Africa and globally.",
    category: "platform-strategy",
    difficultyLevel: "beginner",
    readTime: 9,
    toolTags: ["CapCut", "ElevenLabs", "Canva", "ChatGPT", "TikTok Creator Marketplace", "Kalodata"],
    content: `TikTok in 2026 is not what it was two years ago. Yes, it still rewards fast, punchy, trend-driven content. But it has also matured into a serious search and discovery platform where educational content, niche expertise, and strategic SEO can earn you a loyal audience that converts into real income.

## Why TikTok Deserves a Serious Strategy in 2026

TikTok now has over a billion monthly active users. A growing number of them are using it the way they used to use Google. They type queries into the search bar. They look for tutorials, product recommendations, how-to content, and business ideas. For African creators, especially those based in Kenya, Nigeria, Ghana, and South Africa, TikTok represents an extraordinary opportunity because local content still has enormous room to grow.

## TikTok Content Formats That Generate Results

**Quick educational tips** remain one of the highest-performing formats. Videos that open with a bold claim or surprising insight and deliver a clear payoff in 15 to 30 seconds consistently rank well. **Behind-the-scenes mini-vlogs** perform exceptionally well for building community. **Duets and stitches** tap into existing viral content. **Product reviews and UGC-style content** are especially powerful for affiliate marketing or brand deals. **Series content** is increasingly favored by TikTok's algorithm.

## How to Build a Faceless TikTok Presence

Lean hard into POV-style filming. On-screen text is your silent narrator. A large percentage of TikTok viewers scroll with their sound off. Every faceless video you post should be fully comprehensible without audio. For voiceover, record your own voice or use a high-quality AI voice tool like ElevenLabs. Background music matters more on TikTok than any other platform — use trending audio at low volume beneath your voiceover.

## How to Build a Face-on-Camera TikTok Following

Authenticity is the core currency. Engage with your comments aggressively. Reply to every comment in the first hour after posting. End every video with a specific, low-friction call to action. Not "follow me" — try "Save this so you can come back to it" or "Comment GUIDE and I'll send you the full breakdown."

## TikTok SEO and Monetization

Optimize in three places: your spoken audio, your on-screen text, and your caption. Use a targeted mix of three to five hashtags. Link your TikTok to a YouTube channel, email list, or website. TikTok Shop and affiliate links are growing rapidly. Brand deals become available earlier than most creators expect.`,
    exampleApplications: {
      faceless_formats: ["POV workspace shots", "Screen recording tutorials", "Text-overlay storytelling over B-roll", "AI voiceover with trending audio beneath", "Over-the-shoulder process videos"],
      on_camera_formats: ["Direct-to-camera quick tips", "Authentic failure and lesson stories", "Duets and stitch reactions", "Day-in-the-life micro-vlogs", "Comment-reply video conversations"],
      seo_tips: ["Say your keyword phrase out loud in the video", "Display keyword text on screen", "Include keyword in caption first sentence", "Use 3-5 targeted hashtags, not 15 generic ones"],
    },
  },
  {
    slug: "instagram-reels-growth-guide-faceless-and-on-camera",
    platform: "instagram",
    title: "Instagram Reels Strategy for 2026: How Faceless and On-Camera Creators Build Real Audiences",
    excerpt: "Instagram Reels in 2026 rewards visual creativity, consistency, and community. This complete guide shows faceless and on-camera creators how to optimize content, beat the algorithm, and turn a Reels presence into a profitable brand.",
    category: "platform-strategy",
    difficultyLevel: "beginner",
    readTime: 9,
    toolTags: ["Canva", "CapCut", "Later", "Planoly", "ChatGPT", "Adobe Express", "Notion"],
    content: `Instagram Reels occupies a unique position in the short-form content landscape. It is not as trend-reactive as TikTok, not as search-heavy as YouTube. It sits at the intersection of discovery and brand-building — a place where the right content, posted consistently, can grow both your follower count and your reputation as an authority in your niche.

## Understanding Instagram Reels in 2026

The Instagram algorithm prioritizes Reels that generate high engagement in the first 30 to 60 minutes after posting — particularly saves and shares. A Reel that many people save tells Instagram that the content has lasting value. Instagram tends to reward visual polish and aesthetic consistency. Your followers see your Reels in their feed, which means Reels serve double duty: they retain existing followers while also reaching new ones through Explore.

## Content Formats That Work on Instagram Reels

**Tutorials and how-to Reels** consistently generate high save rates. **Storytelling Reels** — before-and-after transformations, mini case studies — perform strongly for profile visits and follows. **Product showcase and testimonial Reels** are the bread and butter of e-commerce creators. **Motivational and educational quote Reels** with strong B-roll and text overlays are highly shareable.

## Building a Faceless Instagram Reels Strategy

A significant portion of Instagram users scroll with sound off. Your text overlays serve as a silent narrator. Hook your viewer visually in the first one to two seconds. B-roll selection is your creative differentiator. Use trending Instagram audio strategically.

## Building an On-Camera Reels Presence

Film vertically, close-up, and well-lit. Keep your Reels punchy. Deliver one clear insight per Reel. End every on-camera Reel with an engagement driver. Engage off-screen too — reply to every comment in the first hour.

## Reels SEO and Algorithm Optimization

Your caption is searchable. Use natural, keyword-rich language in your caption's opening sentence. Use a targeted mix of three to eight well-chosen hashtags. Post in series to train both your audience and the algorithm. Use your Instagram Insights to identify when your audience is most active.`,
    exampleApplications: {
      faceless_formats: ["Text-overlay B-roll tutorials", "Quote Reels with workspace footage", "Screen recording process videos", "Before-and-after transformation clips", "Hands-only product demonstrations"],
      on_camera_formats: ["Close-up talking head insights", "Creator-brand hybrid storytelling", "Mini case study walkthroughs", "Day-in-the-life creative snippets", "Collab Reels with niche peers"],
      seo_tips: ["Write searchable opening sentences in captions", "Use 3-8 targeted hashtags", "Post in recurring series for topical authority", "Optimize posting time using Instagram Insights"],
    },
  },
  {
    slug: "cross-platform-content-strategy-youtube-tiktok-instagram",
    platform: "all",
    title: "Cross-Platform Content Strategy: How to Repurpose One Idea Across YouTube, TikTok, and Instagram in 2026",
    excerpt: "The most efficient creators are not posting three times as much content — they are posting three times as smartly. This guide shows you how to build a cross-platform content system that works for both faceless and on-camera creators.",
    category: "content-strategy",
    difficultyLevel: "intermediate",
    readTime: 8,
    toolTags: ["Notion", "CapCut", "Descript", "ChatGPT", "Canva", "Later", "Buffer"],
    content: `The biggest mistake multi-platform creators make is treating each platform like a separate job. The smartest creators in 2026 operate from a completely different model: one idea, one pillar piece of content, multiple platform-adapted derivatives. This is the system that lets a solo creator show up consistently across three major platforms without losing their mind or their quality.

## The Pillar Content Model

Every content system starts with a pillar. A pillar piece of content is your longest, most comprehensive treatment of a topic — typically a YouTube video of eight to fifteen minutes. Everything else is derived from that pillar. You are not creating new content from scratch for every platform. You are distributing different angles and extracts of the same idea, adapted for each platform's native format.

## Platform-Specific Adaptation Principles

**For YouTube:** Long form is your opportunity to go deep. Add timestamps, use chapters for SEO, and include an end screen. **For TikTok:** Speed and specificity are everything. The hook needs to work in the first two seconds. The payoff needs to arrive before the 15-second mark. **For Instagram Reels:** Visual storytelling and aesthetic coherence are the differentiators. Build your Reel around delivering one save-worthy insight.

## Faceless and On-Camera Cross-Platform Workflows

Start with your script. Write your pillar script in full. Then create a condensed version for TikTok and a caption version for Instagram. Your B-roll library is your most valuable asset. For on-camera creators, use a secondary camera to capture vertical footage simultaneously. Change your hooks for each platform even when the underlying content is the same.

## Aligning SEO Across Platforms

Use consistent keyword phrases across all platforms. Use your platforms to cross-promote each other explicitly. Build a simple monthly content audit into your workflow. When you identify a high-performing angle, create a series around it. The creators who win in 2026 treat content creation as a compounding investment, not a lottery.`,
    exampleApplications: {
      pillar_to_derivative_example: {
        pillar: "12-minute YouTube video: How to start a faceless channel in Kenya",
        tiktok_1: "30-second TikTok: The #1 mistake beginners make with faceless channels",
        tiktok_2: "25-second TikTok: Tools you need vs tools you don't",
        reels_1: "30-second Reel: Step-by-step faceless video production process",
        email: "Newsletter summary: Key takeaways with a CTA to watch",
      },
      recommended_tools: {
        scripting: "Notion or Google Docs for pillar scripts",
        editing: "CapCut or Descript for short-form repurposing",
        scheduling: "Later or Buffer for cross-platform scheduling",
        analytics: "Native platform analytics reviewed monthly",
      },
    },
  },
];

export const getFallbackGuideBySlug = (slug: string): PlatformGuideFallback | undefined =>
  PLATFORM_GUIDES_FALLBACK.find((g) => g.slug === slug);
