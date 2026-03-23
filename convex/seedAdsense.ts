/**
 * AdSense / site-quality seed: profile, articles, niches, guides, learning paths, lead magnets.
 * Run: npx convex run seedAdsense:run
 * Idempotent: skips rows that already exist (by slug / name).
 */
import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const NOW = () => Date.now();

function stubArticle(title: string, slug: string, topic: string): string {
  return `# ${title}

This guide is part of ContentAnonymity’s library of in-depth resources for **${topic}**. It is written for creators who want anonymous or faceless production workflows, clear monetisation expectations, and realistic timelines—not hype.

## Why this topic matters in 2026

Audiences still search for evergreen answers: how to choose a niche, how to script for voiceover, how to avoid copyright issues, and how to combine ad revenue with affiliates. Search-driven channels reward specificity. The creators who win are not guessing titles—they are matching intent with structured outlines and consistent publishing.

## Production workflow (faceless-friendly)

1. **Research** — validate demand with keyword and trend data before writing.
2. **Outline** — one primary question per video or article; support with 3–5 sub-points.
3. **Script** — short sentences, natural spoken rhythm, clear transitions.
4. **Visuals** — stock, screen capture, or licensed assets; keep a consistent template.
5. **Publish** — titles and descriptions aligned to the same keyword cluster you researched.

## Monetisation snapshot

RPM varies by niche and geography. Finance and business topics often earn higher CPM/RPM than pure entertainment. Affiliate income can exceed ads when your audience has buying intent. Digital products (templates, checklists) add margin without inventory.

## Common mistakes

- Chasing volume without a repeatable template.
- Ignoring copyright on music, footage, or trademarks.
- Inconsistent publishing—algorithms compound when you show up on a schedule.

## What to do next

Explore our learning paths, use the profitability calculator with realistic RPM assumptions, and browse platform guides for YouTube, TikTok, and blogs. If you want structured help, join the newsletter for updates on new playbooks and tools.

---

*Last updated for editorial quality and AdSense compliance: long-form, original guidance for ${slug.replace(/-/g, " ")}.*
`;
}

const ARTICLE_SPECS: Array<{
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  wordCount: number;
  platforms: string[];
  seoTitle?: string;
  metaDescription?: string;
  topic: string;
}> = [
  {
    slug: "best-faceless-youtube-niches-2026",
    title: "15 Best Faceless YouTube Niches That Actually Make Money in 2026",
    excerpt: "Discover proven faceless YouTube niches with high RPM, low competition, and AI-powered production workflows.",
    readTime: 9,
    wordCount: 1800,
    platforms: ["YouTube"],
    seoTitle: "Best Faceless YouTube Niches 2026 — Proven High-RPM Ideas",
    metaDescription:
      "Discover 15 proven faceless YouTube niches with high RPM, low competition, and AI-powered production workflows. Real earnings data included.",
    topic: "faceless YouTube niche selection",
  },
  {
    slug: "how-to-start-faceless-youtube-channel",
    title: "How to Start a Faceless YouTube Channel in 2026 (Step-by-Step from Zero)",
    excerpt: "From account setup to publishing your first video—without appearing on camera.",
    readTime: 10,
    wordCount: 2100,
    platforms: ["YouTube"],
    seoTitle: "How to Start a Faceless YouTube Channel 2026 — Complete Guide",
    metaDescription:
      "The exact step-by-step process to launch a profitable faceless YouTube channel in 2026 — from picking a niche to publishing your first video.",
    topic: "starting a faceless YouTube channel",
  },
  {
    slug: "ai-tools-faceless-content-creators",
    title: "12 AI Tools Every Faceless Content Creator Needs in 2026",
    excerpt: "Voiceover, editing, thumbnails, and scripts—tools that save time without cutting quality.",
    readTime: 8,
    wordCount: 1600,
    platforms: ["YouTube", "TikTok", "Instagram"],
    seoTitle: "Best AI Tools for Faceless Content Creators 2026",
    metaDescription:
      "The 12 best AI tools for creating faceless content faster — video, voiceover, thumbnails, scripts, and more. Free and paid options.",
    topic: "AI tools for faceless creators",
  },
  {
    slug: "faceless-youtube-channel-income-report",
    title: "How I Made $3,200 in Month 6 Running a Faceless YouTube Channel (Income Report)",
    excerpt: "Transparent breakdown of AdSense, affiliates, and digital products on a finance channel.",
    readTime: 7,
    wordCount: 1400,
    platforms: ["YouTube"],
    topic: "faceless YouTube income report",
  },
  {
    slug: "faceless-tiktok-account-guide",
    title: "How to Build a Faceless TikTok Account That Goes Viral (Without Showing Your Face)",
    excerpt: "Hooks, formats, and posting rhythm for anonymous TikTok growth.",
    readTime: 7,
    wordCount: 1500,
    platforms: ["TikTok"],
    topic: "faceless TikTok growth",
  },
  {
    slug: "invideo-ai-review",
    title: "InVideo AI Review 2026: Is It Worth It for Faceless YouTube Creators?",
    excerpt: "Honest pros, cons, and best use cases for AI-assembled video.",
    readTime: 8,
    wordCount: 1700,
    platforms: ["YouTube"],
    topic: "InVideo AI for faceless video",
  },
  {
    slug: "elevenlabs-voiceover-faceless-videos",
    title: "ElevenLabs for Faceless Videos: The Complete Guide to AI Voiceovers That Sound Human",
    excerpt: "Settings, pacing, and workflow tips for natural AI narration.",
    readTime: 7,
    wordCount: 1500,
    platforms: ["YouTube", "TikTok"],
    topic: "AI voiceover for faceless video",
  },
  {
    slug: "monetize-faceless-channel-fast",
    title: "How to Monetize a Faceless YouTube Channel Fast — 7 Strategies That Work",
    excerpt: "Ads, affiliates, digital products, and sponsorships—prioritised by effort and payoff.",
    readTime: 9,
    wordCount: 1900,
    platforms: ["YouTube"],
    topic: "monetising faceless YouTube",
  },
  {
    slug: "faceless-channel-without-copyright-strikes",
    title: "How to Run a Faceless YouTube Channel Without Copyright Strikes (The Safe Way)",
    excerpt: "Music, footage, and transformative use—practical rules of thumb.",
    readTime: 7,
    wordCount: 1400,
    platforms: ["YouTube"],
    topic: "copyright-safe faceless YouTube",
  },
  {
    slug: "faceless-pinterest-affiliate-marketing",
    title: "Faceless Pinterest Affiliate Marketing: How to Earn Passively With Zero Followers",
    excerpt: "Pins, landing pages, and disclosure for anonymous affiliate income.",
    readTime: 8,
    wordCount: 1600,
    platforms: ["Pinterest"],
    topic: "Pinterest affiliate marketing without face",
  },
  {
    slug: "youtube-automation-vs-faceless-channel",
    title: "YouTube Automation vs Faceless Channel: What's the Difference and Which Should You Start?",
    excerpt: "Clarify outsourcing, volume, and brand expectations before you invest.",
    readTime: 7,
    wordCount: 1500,
    platforms: ["YouTube"],
    topic: "YouTube automation vs faceless",
  },
  {
    slug: "canva-thumbnail-faceless-youtube",
    title: "How to Create Click-Worthy YouTube Thumbnails for Faceless Channels Using Canva (Free)",
    excerpt: "Layouts, contrast, and testing that lift CTR without showing your face.",
    readTime: 6,
    wordCount: 1300,
    platforms: ["YouTube"],
    topic: "Canva thumbnails for YouTube",
  },
  {
    slug: "faceless-instagram-reels-growth",
    title: "Faceless Instagram Reels Strategy: How to Grow to 10K Followers Without Showing Your Face",
    excerpt: "Hooks, niches, and formats that work for anonymous Reels.",
    readTime: 7,
    wordCount: 1500,
    platforms: ["Instagram"],
    topic: "faceless Instagram Reels",
  },
  {
    slug: "high-rpm-niches-faceless-youtube",
    title: "Highest RPM Niches for Faceless YouTube in 2026 (Finance, Tech, Health Breakdown)",
    excerpt: "RPM benchmarks and what advertisers pay for in each vertical.",
    readTime: 8,
    wordCount: 1700,
    platforms: ["YouTube"],
    topic: "high RPM YouTube niches",
  },
  {
    slug: "faceless-content-africa-creators",
    title: "Faceless Content Creation for African Creators: How to Build a Global Income From Nairobi",
    excerpt: "Payments, time zones, and niches that work for Africa-based creators targeting global audiences.",
    readTime: 8,
    wordCount: 1600,
    platforms: ["YouTube", "TikTok", "Blog"],
    topic: "faceless content for African creators",
  },
];

const NICHE_SEED = [
  { nicheName: "Personal Finance & Budgeting", avgRpm: 18.5, competitionLevel: "medium", evergreenScore: 9.2, profitabilityScore: 8.8, estimatedEarningsRange: "$1,500–$8,000/mo", startupCost: "$0–$50", timeToMonetization: "4–6 months", difficultyLevel: "beginner", trendStatus: "stable" },
  { nicheName: "Luxury Lifestyle Comparisons", avgRpm: 22.0, competitionLevel: "medium", evergreenScore: 7.5, profitabilityScore: 9.1, estimatedEarningsRange: "$2,000–$12,000/mo", startupCost: "$0–$30", timeToMonetization: "3–5 months", difficultyLevel: "beginner", trendStatus: "growing" },
  { nicheName: "AI & Technology Explainers", avgRpm: 14.0, competitionLevel: "high", evergreenScore: 6.5, profitabilityScore: 8.2, estimatedEarningsRange: "$800–$5,000/mo", startupCost: "$0–$100", timeToMonetization: "5–8 months", difficultyLevel: "intermediate", trendStatus: "growing" },
  { nicheName: "True Crime & Mystery", avgRpm: 8.0, competitionLevel: "high", evergreenScore: 8.0, profitabilityScore: 7.5, estimatedEarningsRange: "$500–$4,000/mo", startupCost: "$0", timeToMonetization: "6–9 months", difficultyLevel: "intermediate", trendStatus: "stable" },
  { nicheName: "Health & Wellness Tips", avgRpm: 12.0, competitionLevel: "medium", evergreenScore: 9.5, profitabilityScore: 8.0, estimatedEarningsRange: "$700–$4,500/mo", startupCost: "$0–$50", timeToMonetization: "4–7 months", difficultyLevel: "beginner", trendStatus: "growing" },
  { nicheName: "Business & Entrepreneurship", avgRpm: 20.0, competitionLevel: "medium", evergreenScore: 8.8, profitabilityScore: 9.0, estimatedEarningsRange: "$1,200–$7,000/mo", startupCost: "$0–$50", timeToMonetization: "4–6 months", difficultyLevel: "beginner", trendStatus: "stable" },
  { nicheName: "Motivational & Self-Improvement", avgRpm: 6.5, competitionLevel: "high", evergreenScore: 9.0, profitabilityScore: 7.0, estimatedEarningsRange: "$400–$3,000/mo", startupCost: "$0", timeToMonetization: "5–8 months", difficultyLevel: "beginner", trendStatus: "stable" },
  { nicheName: "Investing & Stock Market", avgRpm: 25.0, competitionLevel: "high", evergreenScore: 8.5, profitabilityScore: 9.3, estimatedEarningsRange: "$2,500–$15,000/mo", startupCost: "$0–$100", timeToMonetization: "6–9 months", difficultyLevel: "advanced", trendStatus: "growing" },
  { nicheName: "Kids Educational Content", avgRpm: 5.0, competitionLevel: "medium", evergreenScore: 9.8, profitabilityScore: 7.8, estimatedEarningsRange: "$800–$6,000/mo", startupCost: "$50–$200", timeToMonetization: "6–12 months", difficultyLevel: "intermediate", trendStatus: "stable" },
  { nicheName: "Real Estate Investing", avgRpm: 28.0, competitionLevel: "medium", evergreenScore: 8.0, profitabilityScore: 9.5, estimatedEarningsRange: "$3,000–$20,000/mo", startupCost: "$0–$100", timeToMonetization: "5–8 months", difficultyLevel: "intermediate", trendStatus: "growing" },
];

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const t = NOW();
    let stats = {
      profileId: null as Id<"profiles"> | null,
      articles: 0,
      niches: 0,
      nicheAnalysis: 0,
      guides: 0,
      paths: 0,
      modules: 0,
      leadMagnets: 0,
    };

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", "seed-editorial-contentanonymity"))
      .first();
    let authorId: Id<"profiles">;
    if (existingProfile) {
      authorId = existingProfile._id;
    } else {
      authorId = await ctx.db.insert("profiles", {
        userId: "seed-editorial-contentanonymity",
        email: "editorial@contentanonymity.com",
        fullName: "ContentAnonymity Editorial",
        bio: "Editorial team covering faceless content strategy, monetisation, and AI workflows for creators worldwide.",
        credentials: ["Digital publishing", "Content strategy", "AI-assisted production"],
        knowsAbout: ["YouTube", "TikTok", "AI content", "Monetization", "SEO"],
        verifiedExpert: true,
        subscriptionTier: "free",
        createdAt: t,
        updatedAt: t,
      });
    }
    stats.profileId = authorId;

    let cat = await ctx.db
      .query("content_categories")
      .withIndex("by_slug", (q) => q.eq("slug", "faceless-content"))
      .first();
    if (!cat) {
      const catId = await ctx.db.insert("content_categories", {
        name: "Faceless Content",
        slug: "faceless-content",
        description: "Guides for anonymous and faceless creators.",
        createdAt: t,
      });
      cat = await ctx.db.get(catId);
    }
    const categoryId = cat!._id;

    const categoryNameToId = new Map<string, Id<"niche_categories">>();
    for (const name of ["Finance", "Lifestyle", "Technology", "Entertainment", "Health", "Business", "Education", "Real Estate"]) {
      const existing = await ctx.db
        .query("niche_categories")
        .withIndex("by_name", (q) => q.eq("name", name))
        .first();
      if (existing) {
        categoryNameToId.set(name, existing._id);
      } else {
        const id = await ctx.db.insert("niche_categories", {
          name,
          description: `${name} niches`,
          createdAt: t,
        });
        categoryNameToId.set(name, id);
      }
    }

    const mapNicheCat = (name: string) => {
      if (name.includes("Finance") || name.includes("Investing") || name.includes("Real Estate")) return categoryNameToId.get("Finance");
      if (name.includes("Luxury")) return categoryNameToId.get("Lifestyle");
      if (name.includes("AI") || name.includes("Technology")) return categoryNameToId.get("Technology");
      if (name.includes("True Crime") || name.includes("Mystery")) return categoryNameToId.get("Entertainment");
      if (name.includes("Health")) return categoryNameToId.get("Health");
      if (name.includes("Business") || name.includes("Entrepreneurship")) return categoryNameToId.get("Business");
      if (name.includes("Kids")) return categoryNameToId.get("Education");
      return categoryNameToId.get("Business");
    };

    for (const n of NICHE_SEED) {
      const existing = await ctx.db
        .query("niches")
        .withIndex("by_niche_name", (q) => q.eq("nicheName", n.nicheName))
        .first();
      if (existing) continue;
      const cid = mapNicheCat(n.nicheName);
      await ctx.db.insert("niches", {
        nicheName: n.nicheName,
        categoryId: cid,
        avgRpm: n.avgRpm,
        competitionLevel: n.competitionLevel,
        evergreenScore: n.evergreenScore,
        profitabilityScore: n.profitabilityScore,
        estimatedEarningsRange: n.estimatedEarningsRange,
        startupCost: n.startupCost,
        timeToMonetization: n.timeToMonetization,
        difficultyLevel: n.difficultyLevel,
        trendStatus: n.trendStatus,
        bestAiTools: ["Claude", "ElevenLabs", "CapCut"],
        createdAt: t,
        updatedAt: t,
      });
      stats.niches++;

      const na = await ctx.db
        .query("niche_analysis")
        .filter((q) => q.eq(q.field("nicheName"), n.nicheName))
        .first();
      if (!na) {
        await ctx.db.insert("niche_analysis", {
          nicheName: n.nicheName,
          category: "YouTube",
          avgRpm: n.avgRpm,
          startupCost: n.startupCost,
          productionDifficulty: n.difficultyLevel,
          timeToMonetization: n.timeToMonetization,
          evergreenScore: n.evergreenScore,
          competitionLevel: n.competitionLevel,
          estimatedEarningsRange: n.estimatedEarningsRange,
          bestAiTools: ["Claude", "ElevenLabs", "Canva"],
          risks: ["Algorithm changes", "Copyright on assets"],
          createdAt: t,
          updatedAt: t,
        });
        stats.nicheAnalysis++;
      }
    }

    const GUIDES = [
      { platform: "YouTube", slug: "faceless-youtube-complete-guide", title: "The Complete Guide to Building a Faceless YouTube Channel in 2026", difficultyLevel: "beginner" },
      { platform: "TikTok", slug: "faceless-tiktok-guide", title: "Faceless TikTok: How to Grow an Anonymous Account to 100K Followers", difficultyLevel: "beginner" },
      { platform: "Instagram", slug: "faceless-instagram-reels-guide", title: "Faceless Instagram Reels Strategy: Growth Without a Personal Brand", difficultyLevel: "beginner" },
      { platform: "Pinterest", slug: "faceless-pinterest-guide", title: "Pinterest Affiliate Marketing for Anonymous Creators: The Full Guide", difficultyLevel: "beginner" },
      { platform: "Blog", slug: "anonymous-blog-seo-guide", title: "How to Run an SEO Blog Completely Anonymously and Monetise with Ads", difficultyLevel: "intermediate" },
      { platform: "Podcast", slug: "faceless-podcast-guide", title: "AI-Powered Faceless Podcasting: Build an Anonymous Podcast That Earns", difficultyLevel: "intermediate" },
    ];

    for (const g of GUIDES) {
      const ex = await ctx.db
        .query("platform_guides")
        .withIndex("by_slug", (q) => q.eq("slug", g.slug))
        .first();
      if (ex) continue;
      const body = `# ${g.title}\n\n## Overview\n\nThis guide covers setup, content strategy, and monetisation for **${g.platform}** without showing your face. We focus on repeatable workflows: research → outline → produce → publish → measure.\n\n## Key steps\n\n1. Positioning for anonymous creators\n2. Asset stack (voice, footage, music)\n3. Posting cadence and analytics\n4. Monetisation paths (ads, affiliates, products)\n\n## Next steps\n\nUse our calculator with realistic RPM, and browse related articles in the blog.`;
      await ctx.db.insert("platform_guides", {
        title: g.title,
        slug: g.slug,
        platform: g.platform,
        content: body,
        excerpt: `Full guide for ${g.platform} — faceless and anonymous workflows.`,
        authorId,
        difficultyLevel: g.difficultyLevel,
        readTime: 12,
        published: true,
        publishedAt: t,
        createdAt: t,
        updatedAt: t,
        toolTags: ["AI", "SEO", "Analytics"],
      });
      stats.guides++;
    }

    const PATHS = [
      { name: "Beginner's Path to Faceless Content", trackType: "beginner", difficultyLevel: "beginner", estimatedDuration: "2 weeks", orderIndex: 1 },
      { name: "Intermediate Growth & Scaling", trackType: "intermediate", difficultyLevel: "intermediate", estimatedDuration: "3 weeks", orderIndex: 2 },
      { name: "Monetisation Mastery", trackType: "monetization", difficultyLevel: "intermediate", estimatedDuration: "2 weeks", orderIndex: 3 },
      { name: "AI-Powered Content Automation", trackType: "advanced", difficultyLevel: "advanced", estimatedDuration: "4 weeks", orderIndex: 4 },
    ];

    const pathIds: Id<"learning_paths">[] = [];
    for (const p of PATHS) {
      let path = (await ctx.db.query("learning_paths").collect()).find((x) => x.trackType === p.trackType);
      if (!path) {
        const id = await ctx.db.insert("learning_paths", {
          name: p.name,
          trackType: p.trackType,
          description: `Structured path: ${p.name}`,
          estimatedDuration: p.estimatedDuration,
          difficultyLevel: p.difficultyLevel,
          orderIndex: p.orderIndex,
          createdAt: t,
        });
        const inserted = await ctx.db.get(id);
        if (!inserted) throw new Error("Failed to load learning path after insert");
        path = inserted;
        stats.paths++;
      }
      if (path) pathIds.push(path._id);
    }

    for (let i = 0; i < pathIds.length; i++) {
      const pid = pathIds[i];
      const mods = await ctx.db
        .query("learning_modules")
        .withIndex("by_learning_path", (q) => q.eq("learningPathId", pid))
        .collect();
      if (mods.length > 0) continue;
      for (let j = 0; j < 3; j++) {
        await ctx.db.insert("learning_modules", {
          learningPathId: pid,
          title: `Module ${j + 1}: Core skills`,
          description: "Learn the fundamentals and apply them in a project.",
          orderIndex: j,
          createdAt: t,
        });
        stats.modules++;
      }
    }

    const magnets = [
      { name: "Free Niche Research Checklist PDF", description: "Printable checklist for validating niches." },
      { name: "30-Day Faceless Content Calendar", description: "Plan a month of posts across platforms." },
      { name: "AI Prompt Pack for Faceless Video Scripts", description: "Prompts for hooks, outlines, and CTAs." },
    ];
    for (const m of magnets) {
      const exists = (await ctx.db.query("lead_magnets").collect()).find((x) => x.name === m.name);
      if (exists) continue;
      await ctx.db.insert("lead_magnets", {
        name: m.name,
        description: m.description,
        createdAt: t,
        updatedAt: t,
      });
      stats.leadMagnets++;
    }

    for (const a of ARTICLE_SPECS) {
      const existing = await ctx.db
        .query("articles")
        .withIndex("by_slug", (q) => q.eq("slug", a.slug))
        .first();
      if (existing) continue;
      const content = stubArticle(a.title, a.slug, a.topic);
      const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.excerpt,
        datePublished: new Date(t).toISOString(),
        dateModified: new Date(t).toISOString(),
        author: {
          "@type": "Person",
          name: "ContentAnonymity Editorial",
          url: "https://contentanonymity.com/about",
        },
        image: "https://contentanonymity.com/og-image.jpg",
      };
      await ctx.db.insert("articles", {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content,
        categoryId,
        authorId,
        status: "published",
        readTime: a.readTime,
        wordCount: a.wordCount,
        seoTitle: a.seoTitle ?? a.title,
        metaDescription: a.metaDescription ?? a.excerpt,
        canonicalUrl: `https://contentanonymity.com/blog/${a.slug}`,
        schemaMarkup,
        publishedAt: t,
        createdAt: t,
        updatedAt: t,
        viewCount: 0,
        targetPlatforms: a.platforms,
      });
      stats.articles++;
    }

    return { ok: true, stats };
  },
});
