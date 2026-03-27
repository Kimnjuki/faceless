import { mutation } from "./_generated/server";

/**
 * Seed published creator showcases + niche trend rows for demos / Phase 1.
 * Run: npx convex run seedGrowth:seedAll
 */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const showcases = [
      {
        stealthHandle: "Creator_7f3a",
        platform: "YouTube",
        monthlyRevenue: "$4.2k–$6k",
        subscriberRange: "80k–120k",
        timeToFirstRevenue: "6 months",
        toolsUsed: ["Descript", "Canva", "Epidemic Sound"],
        story:
          "Started with stock footage + AI voice in the productivity niche. Doubled down on one format (top 5 lists) and improved thumbnails weekly.",
        tipForBeginners: "Pick one sub-niche and upload on a fixed schedule before optimizing anything else.",
        isFeatured: true,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "AnonFinance",
        platform: "YouTube",
        monthlyRevenue: "$12k+",
        subscriberRange: "200k+",
        timeToFirstRevenue: "4 months",
        toolsUsed: ["CapCut", "ChatGPT", "Midjourney"],
        story:
          "Animated explainers on personal finance. Focused on retention with pattern interrupts every 30 seconds.",
        tipForBeginners: "Script hooks in the first 5 seconds decide everything — test 3 hooks per topic.",
        isFeatured: true,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "SleepAudioLab",
        platform: "YouTube",
        monthlyRevenue: "$2.5k–$3.5k",
        subscriberRange: "150k+",
        timeToFirstRevenue: "8 months",
        toolsUsed: ["Reaper", "Artlist"],
        story: "Long-form ambient + guided sleep. Monetization via ads + members-only extended cuts.",
        tipForBeginners: "Consistency beats perfection — publish the same length every night.",
        isFeatured: false,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "TechShorts_AU",
        platform: "TikTok",
        monthlyRevenue: "$1k–$2k",
        subscriberRange: "400k+",
        timeToFirstRevenue: "3 months",
        toolsUsed: ["CapCut", "ElevenLabs"],
        story: "60-second software tips. Repurposed long YouTube tutorials into short clips.",
        tipForBeginners: "One idea = one video. No multi-topic shorts.",
        isFeatured: false,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "HistoryMystery",
        platform: "YouTube",
        monthlyRevenue: "$7k–$9k",
        subscriberRange: "300k+",
        timeToFirstRevenue: "5 months",
        toolsUsed: ["AI voice", "Pond5"],
        story: "Faceless documentary style with strong scripting and B-roll discipline.",
        tipForBeginners: "Build a swipe file of 50 proven titles in your niche before filming.",
        isFeatured: true,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "FitnessTimer",
        platform: "Instagram",
        monthlyRevenue: "$800–$1.2k",
        subscriberRange: "90k+",
        timeToFirstRevenue: "7 months",
        toolsUsed: ["Canva", "InShot"],
        story: "Reels with follow-along timers. Sponsorships from supplement affiliates.",
        tipForBeginners: "Use on-screen text for sound-off viewers.",
        isFeatured: false,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "AI_News_Desk",
        platform: "YouTube",
        monthlyRevenue: "$5k–$8k",
        subscriberRange: "120k+",
        timeToFirstRevenue: "5 months",
        toolsUsed: ["Perplexity", "Descript"],
        story: "Daily AI news recap with neutral tone and clear chapter markers.",
        tipForBeginners: "Batch scripts on Sunday, record Monday — ship Tue–Fri.",
        isFeatured: false,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "CookingNoFace",
        platform: "YouTube",
        monthlyRevenue: "$3k–$4k",
        subscriberRange: "250k+",
        timeToFirstRevenue: "9 months",
        toolsUsed: ["Overhead rig", "Artlist"],
        story: "Hands-only cooking with tight editing. RPM improved after focusing on US audience.",
        tipForBeginners: "Film 5 recipes in one session to reduce setup time.",
        isFeatured: false,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "MotivationVault",
        platform: "YouTube",
        monthlyRevenue: "$6k–$10k",
        subscriberRange: "500k+",
        timeToFirstRevenue: "12 months",
        toolsUsed: ["Stock footage", "Voice AI"],
        story: "Compilation + original narration. Avoided copyright by licensing all footage.",
        tipForBeginners: "Avoid reused viral clips — algorithm deprioritizes duplicate footage.",
        isFeatured: true,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
      {
        stealthHandle: "StudyWithMe_X",
        platform: "YouTube",
        monthlyRevenue: "$1.5k–$2.5k",
        subscriberRange: "180k+",
        timeToFirstRevenue: "10 months",
        toolsUsed: ["OBS", "Lo-fi library"],
        story: "Pomodoro study streams + uploads. Members for custom timers.",
        tipForBeginners: "Long uploads win in study niche — aim 2h+ loops.",
        isFeatured: false,
        status: "published" as const,
        publishedAt: now,
        createdAt: now,
      },
    ];

    let added = 0;
    for (const s of showcases) {
      const existing = await ctx.db
        .query("creator_showcases")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .filter((q) => q.eq(q.field("stealthHandle"), s.stealthHandle))
        .first();
      if (!existing) {
        await ctx.db.insert("creator_showcases", s);
        added++;
      }
    }

    const trendSeeds: {
      nicheName: string;
      platform: string;
      trendScore: number;
      trendDirection: "rising" | "stable" | "falling";
    }[] = [
      { nicheName: "AI tools explainers", platform: "YouTube", trendScore: 92, trendDirection: "rising" },
      { nicheName: "Personal finance animation", platform: "YouTube", trendScore: 88, trendDirection: "rising" },
      { nicheName: "True crime storytelling", platform: "YouTube", trendScore: 85, trendDirection: "stable" },
      { nicheName: "Study / focus content", platform: "YouTube", trendScore: 81, trendDirection: "rising" },
      { nicheName: "Software tutorials", platform: "TikTok", trendScore: 79, trendDirection: "rising" },
      { nicheName: "History documentaries", platform: "YouTube", trendScore: 76, trendDirection: "stable" },
      { nicheName: "Fitness timers / mobility", platform: "Instagram", trendScore: 72, trendDirection: "falling" },
      { nicheName: "Motivation / stoicism", platform: "YouTube", trendScore: 70, trendDirection: "stable" },
    ];

    let trendsAdded = 0;
    for (const t of trendSeeds) {
      const dup = await ctx.db
        .query("niche_trends")
        .withIndex("by_platform", (q) => q.eq("platform", t.platform))
        .filter((q) => q.eq(q.field("nicheName"), t.nicheName))
        .first();
      if (!dup) {
        await ctx.db.insert("niche_trends", {
          nicheName: t.nicheName,
          platform: t.platform,
          trendScore: t.trendScore,
          trendDirection: t.trendDirection,
          snapshotDate: now,
          createdAt: now,
          dataSource: "seedGrowth",
        });
        trendsAdded++;
      }
    }

    const badgeDefs = [
      {
        badgeId: "first_script",
        badgeName: "First script",
        badgeCategory: "tools" as const,
        description: "Generated your first AI script in Creator Studio",
        sortOrder: 1,
        createdAt: now,
      },
      {
        badgeId: "calendar_30",
        badgeName: "30-day planner",
        badgeCategory: "tools" as const,
        description: "Created a 30-day content schedule",
        sortOrder: 2,
        createdAt: now,
      },
      {
        badgeId: "community_post",
        badgeName: "Community voice",
        badgeCategory: "community" as const,
        description: "Posted in the forum or collab hub",
        sortOrder: 3,
        createdAt: now,
      },
      {
        badgeId: "income_report",
        badgeName: "Income contributor",
        badgeCategory: "earnings" as const,
        description: "Submitted an anonymous income report",
        sortOrder: 4,
        createdAt: now,
      },
      {
        badgeId: "streak_7",
        badgeName: "7-day streak",
        badgeCategory: "streak" as const,
        description: "Used platform tools 7 days in a row",
        sortOrder: 5,
        createdAt: now,
      },
    ];

    let badgesAdded = 0;
    for (const b of badgeDefs) {
      const exists = await ctx.db
        .query("badge_definitions")
        .withIndex("by_badge_id", (q) => q.eq("badgeId", b.badgeId))
        .first();
      if (!exists) {
        await ctx.db.insert("badge_definitions", b);
        badgesAdded++;
      }
    }

    return {
      showcasesInserted: added,
      trendsInserted: trendsAdded,
      badgeDefinitionsInserted: badgesAdded,
    };
  },
});
