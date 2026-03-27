import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const generationType = v.union(
  v.literal("script"),
  v.literal("hook"),
  v.literal("title"),
  v.literal("description"),
  v.literal("brand_kit"),
  v.literal("content_plan"),
  v.literal("thumbnail_analysis")
);

function fallbackCopy(args: {
  contentType: string;
  topic?: string;
  niche?: string;
  platform?: string;
  tone?: string;
}) {
  const t = args.topic || "your topic";
  const n = args.niche || "your niche";
  const p = args.platform || "YouTube";
  return `[Offline / demo mode — configure ANTHROPIC_API_KEY in Convex for live AI.]

## ${args.contentType} for ${p}

**Topic:** ${t}
**Niche:** ${n}
**Tone:** ${args.tone || "professional"}

### Hook (15s)
What if ${t} could change your channel in 30 days? Here is the exact framework faceless creators use on ${p}.

### Outline
1. Problem — why most channels stall in ${n}.
2. Framework — 3 repeatable steps.
3. Proof — what to measure weekly.
4. CTA — subscribe for the next part.

### Full script (short)
Hey — quick one on ${t}. If you are building in ${n} without showing your face, start with one clear promise in the first line, one story or stat in the middle, and one action at the end. Batch film, schedule, iterate.`;
}

/** Public stats for homepage / marketing strip */
export const getPublicGrowthStats = query({
  args: {},
  handler: async (ctx) => {
    const [profiles, niches, showcases, reports] = await Promise.all([
      ctx.db.query("profiles").collect(),
      ctx.db.query("niches").collect(),
      ctx.db
        .query("creator_showcases")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .collect(),
      ctx.db.query("income_reports").collect(),
    ]);
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const weekAgo = Date.now() - weekMs;
    const joinedThisWeek = profiles.filter((p) => p.createdAt >= weekAgo).length;
    let revenueSum = 0;
    let revenueCount = 0;
    for (const r of reports) {
      revenueSum += r.monthlyRevenue;
      revenueCount += 1;
    }
    const avgIncome =
      revenueCount > 0 ? Math.round(revenueSum / revenueCount) : 4200;
    return {
      creatorsJoinedThisWeek: joinedThisWeek || Math.min(profiles.length, 120),
      nichesTracked: niches.length,
      avgMonthlyIncomeDisplay: avgIncome >= 1000 ? `$${(avgIncome / 1000).toFixed(1)}k` : `$${avgIncome}`,
      showcaseCount: showcases.length,
    };
  },
});

export const listTrendingNiches = query({
  args: { limit: v.optional(v.number()), platform: v.optional(v.string()) },
  handler: async (ctx, { limit = 8, platform }) => {
    const rows = await ctx.db.query("niche_trends").collect();
    const recent = rows.filter(
      (r) => r.snapshotDate >= Date.now() - 90 * 24 * 60 * 60 * 1000
    );
    const filtered = platform
      ? recent.filter((r) => r.platform === platform)
      : recent;
    filtered.sort((a, b) => b.trendScore - a.trendScore);
    return filtered.slice(0, limit);
  },
});

export const listPublishedShowcases = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 12 }) => {
    const rows = await ctx.db
      .query("creator_showcases")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    rows.sort(
      (a, b) =>
        (b.publishedAt ?? b.createdAt) - (a.publishedAt ?? a.createdAt)
    );
    return rows.slice(0, limit ?? 12);
  },
});

export const listIncomeAggregates = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("income_reports").collect();
    const byPlatform: Record<string, { sum: number; n: number }> = {};
    for (const r of reports) {
      const p = r.platform;
      if (!byPlatform[p]) byPlatform[p] = { sum: 0, n: 0 };
      byPlatform[p].sum += r.monthlyRevenue;
      byPlatform[p].n += 1;
    }
    return { totalReports: reports.length, byPlatform };
  },
});

export const logGeneration = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    generationType,
    nicheId: v.optional(v.id("niches")),
    platform: v.optional(v.string()),
    inputData: v.any(),
    outputData: v.any(),
    tokensUsed: v.optional(v.float64()),
    subscriptionTier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ai_generation_logs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

const SUPPORTED_AUDIT_HOSTS = [
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "instagram.com",
  "facebook.com",
];

function isAllowedChannelUrl(url: string): boolean {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = u.hostname.replace(/^www\./, "");
    return SUPPORTED_AUDIT_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** Heuristic channel audit (no external API key). Saves row for history. */
export const runChannelAudit = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    channelUrl: v.string(),
    platform: v.string(),
  },
  handler: async (ctx, { userId, channelUrl, platform }) => {
    if (!isAllowedChannelUrl(channelUrl)) {
      throw new Error(
        "Channel URL must be a supported platform link (YouTube, TikTok, Instagram, Facebook)."
      );
    }
    const len = channelUrl.length;
    const hasPath = channelUrl.split("/").length > 4;
    const nicheScore = Math.min(95, 40 + (len % 40) + (hasPath ? 10 : 0));
    const monetizationReadiness = Math.min(95, 35 + ((len * 7) % 45));
    const contentGapScore = Math.min(95, 30 + ((len * 3) % 50));
    const seoScore = Math.min(95, 35 + ((len * 5) % 40));
    const overallScore = Math.round(
      (nicheScore + monetizationReadiness + contentGapScore + seoScore) / 4
    );
    const recommendations = [
      "Tighten titles around one primary keyword cluster per video.",
      "Add 3–5 chapter markers in the first 48 hours for retention.",
      "Batch thumbnails: test contrast + one emotion word on-image.",
      "Publish on a fixed weekly cadence before scaling formats.",
    ];
    const id = await ctx.db.insert("channel_audits", {
      userId,
      channelUrl,
      platform,
      nicheScore,
      monetizationReadiness,
      contentGapScore,
      seoScore,
      overallScore,
      recommendations,
      auditData: { heuristic: true, inputLength: len },
      createdAt: Date.now(),
    });
    return { auditId: id, nicheScore, monetizationReadiness, contentGapScore, seoScore, overallScore, recommendations };
  },
});

export const saveChannelAudit = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    channelUrl: v.string(),
    platform: v.string(),
    nicheScore: v.optional(v.float64()),
    monetizationReadiness: v.optional(v.float64()),
    contentGapScore: v.optional(v.float64()),
    seoScore: v.optional(v.float64()),
    overallScore: v.optional(v.float64()),
    recommendations: v.optional(v.array(v.string())),
    auditData: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("channel_audits", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const saveThumbnailTest = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    platform: v.optional(v.string()),
    imageUrl_A: v.string(),
    imageUrl_B: v.optional(v.string()),
    analysisA: v.optional(v.any()),
    analysisB: v.optional(v.any()),
    winner: v.optional(v.union(v.literal("A"), v.literal("B"), v.literal("tie"))),
    overallScore_A: v.optional(v.float64()),
    overallScore_B: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("thumbnail_tests", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const saveContentSchedule = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    platform: v.string(),
    planDays: v.number(),
    uploadsPerWeek: v.number(),
    schedule: v.any(),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("archived")
    ),
    startDate: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("content_schedules", {
      ...args,
      planDays: args.planDays,
      uploadsPerWeek: args.uploadsPerWeek,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const submitIncomeReport = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    platform: v.string(),
    nicheId: v.optional(v.id("niches")),
    monthlyRevenue: v.number(),
    revenueStreams: v.optional(v.any()),
    reportMonth: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("income_reports", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getOrComputeSaturation = mutation({
  args: {
    nicheName: v.string(),
    platform: v.string(),
  },
  handler: async (ctx, { nicheName, platform }) => {
    const existing = await ctx.db
      .query("niche_saturation_scores")
      .withIndex("by_platform", (q) => q.eq("platform", platform))
      .collect();
    const match = existing.find((r) => r.nicheName === nicheName);
    if (match && Date.now() - match.lastUpdated < 7 * 24 * 60 * 60 * 1000) {
      return match;
    }
    const hash = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return h % 100;
    };
    const saturationScore = 20 + (hash(nicheName + platform) % 60);
    const opportunityScore = 100 - saturationScore;
    const id = await ctx.db.insert("niche_saturation_scores", {
      nicheName,
      platform,
      saturationScore,
      opportunityScore,
      underservedSubNiches: [`${nicheName} — micro tutorials`, `${nicheName} — news recap`, `${nicheName} — beginner mistakes`],
      breakInStrategy: "Publish 3× weekly, one pillar video, two shorts; stack SEO titles with year + intent keywords.",
      competitorCount: Math.round(50 + hash(nicheName) * 2),
      lastUpdated: Date.now(),
      createdAt: Date.now(),
    });
    return (await ctx.db.get(id))!;
  },
});

export const getSaturationByName = query({
  args: { nicheName: v.string(), platform: v.string() },
  handler: async (ctx, { nicheName, platform }) => {
    const rows = await ctx.db
      .query("niche_saturation_scores")
      .withIndex("by_platform", (q) => q.eq("platform", platform))
      .collect();
    return rows.find((r) => r.nicheName === nicheName) ?? null;
  },
});

/** Spec alias — same data as getSaturationByName */
export const getNicheSaturationReport = query({
  args: { nicheName: v.string(), platform: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("niche_saturation_scores")
      .withIndex("by_platform", (q) => q.eq("platform", args.platform))
      .collect();
    return rows.find((r) => r.nicheName === args.nicheName) ?? null;
  },
});

function nicheSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Programmatic SEO: niche × platform landing data */
export const getProgrammaticNichePlatform = query({
  args: { nicheSlug: v.string(), platform: v.string() },
  handler: async (ctx, { nicheSlug, platform }) => {
    const normalized = nicheSlug.toLowerCase().replace(/^\/+|\/+$/g, "");
    const niches = await ctx.db.query("niches").collect();
    const niche = niches.find((n) => nicheSlugFromName(n.nicheName) === normalized);
    if (!niche) return null;
    const contentIdeas = await ctx.db
      .query("niche_content_ideas")
      .withIndex("by_niche", (q) => q.eq("nicheId", niche._id))
      .collect();
    const plat = platform.toLowerCase();
    const guides = (await ctx.db.query("platform_guides").collect())
      .filter((g) => {
        const gp = g.platform.toLowerCase();
        return gp === plat || gp.includes(plat) || plat.includes(gp);
      })
      .slice(0, 10);
    return {
      niche,
      contentIdeas: contentIdeas.slice(0, 16),
      platformGuides: guides,
    };
  },
});

/** Match or queue a collab — demo pairs first other profile when available */
export const matchCollaborators = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.id("niches"),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, { userId, nicheId, contentType }) => {
    const now = Date.now();
    const profiles = await ctx.db.query("profiles").collect();
    const candidate = profiles.find((p) => (userId ? p._id !== userId : true));
    const desc =
      contentType?.trim() ||
      "Anonymous collab — script swap or series (matched via platform)";
    if (!candidate || (userId && candidate._id === userId)) {
      return await ctx.db.insert("creator_collabs", {
        initiatorId: userId,
        nicheId,
        collabType: "script_swap",
        status: "proposed",
        description: `${desc} (waiting for partner)`,
        createdAt: now,
        updatedAt: now,
      });
    }
    const h = (id: string) => `anon_${id.slice(-8)}`;
    return await ctx.db.insert("creator_collabs", {
      initiatorId: userId,
      partnerId: candidate._id,
      nicheId,
      collabType: "script_swap",
      status: "proposed",
      stealthHandleInitiator: userId ? h(userId) : "anon_seeker",
      stealthHandlePartner: h(candidate._id),
      description: desc,
      createdAt: now,
      updatedAt: now,
    });
  },
});

function heuristicThumbAnalysis(url: string) {
  const len = url.length;
  const contrast = Math.min(98, 45 + (len % 45));
  const readability = Math.min(98, 40 + ((len * 3) % 50));
  const emotional = Math.min(98, 42 + ((len * 7) % 48));
  const overall = Math.round((contrast + readability + emotional) / 3);
  return {
    contrast,
    textReadability: readability,
    emotionalTrigger: emotional,
    ctrLikelihood: overall / 100,
    tips: [
      "Increase contrast between subject and background.",
      "Limit on-image text to 3–5 words with high legibility.",
      "Pick one clear emotion (curiosity, urgency, or relief).",
    ],
    overall,
  };
}

/** Persists thumbnail_tests with heuristic scores (vision API can replace internals later). */
export const analyzeThumbnail = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    platform: v.optional(v.string()),
    imageUrl_A: v.string(),
    imageUrl_B: v.optional(v.string()),
    nicheName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const analysisA = heuristicThumbAnalysis(args.imageUrl_A + (args.nicheName ?? ""));
    const scoreA = analysisA.overall;
    let analysisB: ReturnType<typeof heuristicThumbAnalysis> | undefined;
    let scoreB: number | undefined;
    let winner: "A" | "B" | "tie" | undefined;
    if (args.imageUrl_B) {
      analysisB = heuristicThumbAnalysis(args.imageUrl_B + (args.nicheName ?? ""));
      scoreB = analysisB.overall;
      if (scoreA > scoreB) winner = "A";
      else if (scoreB > scoreA) winner = "B";
      else winner = "tie";
    }
    const id = await ctx.db.insert("thumbnail_tests", {
      userId: args.userId,
      nicheId: args.nicheId,
      platform: args.platform,
      imageUrl_A: args.imageUrl_A,
      imageUrl_B: args.imageUrl_B,
      analysisA,
      analysisB,
      overallScore_A: scoreA,
      overallScore_B: scoreB,
      winner,
      createdAt: Date.now(),
    });
    return { testId: id, analysisA, analysisB, winner };
  },
});

/**
 * Core AI generation — used by Creator Studio and HTTP API.
 * Requires ANTHROPIC_API_KEY in Convex dashboard for live responses.
 */
export const generateCreatorContent = action({
  args: {
    userId: v.optional(v.id("profiles")),
    generationType,
    niche: v.optional(v.string()),
    platform: v.optional(v.string()),
    tone: v.optional(v.string()),
    topic: v.optional(v.string()),
    subscriptionTier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const prompt = `You are an expert faceless YouTube/TikTok creator strategist.
Generate ${args.generationType} content.
Niche: ${args.niche || "general"}
Platform: ${args.platform || "YouTube"}
Tone: ${args.tone || "professional"}
Topic: ${args.topic || "(derive from niche)"}
Keep output structured with headings. No preamble about being an AI.`;

    let text = "";
    let tokensUsed = 0;
    if (apiKey) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Anthropic API error: ${res.status} ${err}`);
      }
      const json = (await res.json()) as {
        content?: { type?: string; text?: string }[];
        usage?: { output_tokens?: number };
      };
      const block = json.content?.find((c) => c.type === "text" || c.text);
      text = block?.text ?? "";
      tokensUsed = json.usage?.output_tokens ?? 0;
    } else {
      text = fallbackCopy({
        contentType: args.generationType,
        topic: args.topic,
        niche: args.niche,
        platform: args.platform,
        tone: args.tone,
      });
    }

    await ctx.runMutation(api.creatorContent.logGeneration, {
      userId: args.userId,
      generationType: args.generationType,
      platform: args.platform,
      inputData: { topic: args.topic, niche: args.niche, tone: args.tone },
      outputData: { text: text.slice(0, 50000) },
      tokensUsed,
      subscriptionTier: args.subscriptionTier,
    });

    return { text, tokensUsed, demoMode: !apiKey };
  },
});

export const generationsThisMonth = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const rows = await ctx.db
      .query("ai_generation_logs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.filter((r) => r.createdAt >= start.getTime()).length;
  },
});

/** Spec alias: timeframe-filtered trend snapshot */
export const getNicheTrendSnapshot = query({
  args: {
    timeframeDays: v.optional(v.number()),
    platform: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { timeframeDays = 90, platform, limit = 20 }) => {
    const cutoff = Date.now() - timeframeDays * 24 * 60 * 60 * 1000;
    const rows = await ctx.db.query("niche_trends").collect();
    const recent = rows.filter((r) => r.snapshotDate >= cutoff);
    const filtered = platform
      ? recent.filter((r) => r.platform === platform)
      : recent;
    filtered.sort((a, b) => b.trendScore - a.trendScore);
    return filtered.slice(0, limit);
  },
});

export const simulateEarnings = query({
  args: {
    monthlyViews: v.optional(v.number()),
    rpm: v.optional(v.number()),
    nicheId: v.optional(v.id("niches")),
    platform: v.optional(v.string()),
    uploadsPerWeek: v.optional(v.number()),
    targetMonths: v.optional(v.number()),
    affiliateUpliftPercent: v.optional(v.number()),
    months: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let monthlyViews = args.monthlyViews ?? 100_000;
    let rpm = args.rpm ?? 6;
    const uploadsPerWeek = args.uploadsPerWeek ?? 3;
    const horizon = args.targetMonths ?? args.months ?? 6;
    const affiliateUpliftPercent = args.affiliateUpliftPercent ?? 15;

    if (args.nicheId) {
      const niche = await ctx.db.get(args.nicheId);
      if (niche?.avgRpm != null) rpm = niche.avgRpm;
      monthlyViews = Math.round(monthlyViews * (1 + uploadsPerWeek * 0.015));
    }

    const reports = await ctx.db.query("income_reports").collect();
    let communityAvg = 0;
    let n = 0;
    for (const r of reports) {
      if (args.platform && r.platform.toLowerCase() !== args.platform.toLowerCase()) continue;
      communityAvg += r.monthlyRevenue;
      n += 1;
    }
    const communityHint = n > 0 ? communityAvg / n : null;

    const adRev = (monthlyViews / 1000) * rpm;
    const affiliate = adRev * (affiliateUpliftPercent / 100);
    const monthly = adRev + affiliate;
    const growth = 1 + horizon * 0.04;
    const low = monthly * 0.75;
    const high = monthly * 1.25;
    return {
      monthly,
      projected: monthly * growth,
      adRev,
      affiliate,
      confidenceLow: low,
      confidenceHigh: high,
      horizonMonths: horizon,
      communityAverageMonthly: communityHint,
    };
  },
});

/** 30-day machine: saves a structured schedule row */
export const generate30DayPlan = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    platform: v.string(),
    hoursPerWeek: v.number(),
  },
  handler: async (ctx, { userId, nicheId, platform, hoursPerWeek }) => {
    const uploadsPerWeek = Math.max(2, Math.min(7, Math.round(hoursPerWeek / 3)));
    const days = 30;
    const schedule: { day: number; title: string; hook: string }[] = [];
    for (let d = 1; d <= days; d++) {
      schedule.push({
        day: d,
        title: `Video ${d}: pillar or short — ${platform} batch`,
        hook: `Day ${d} hook: problem → proof → CTA`,
      });
    }
    const now = Date.now();
    return await ctx.db.insert("content_schedules", {
      userId,
      nicheId,
      platform,
      planDays: days,
      uploadsPerWeek,
      schedule,
      status: "active",
      startDate: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const proposeCollab = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    collabType: v.union(
      v.literal("co_channel"),
      v.literal("script_swap"),
      v.literal("affiliate_split"),
      v.literal("series")
    ),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("creator_collabs", {
      initiatorId: args.userId,
      nicheId: args.nicheId,
      collabType: args.collabType,
      status: "proposed",
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const insertBrandKit = mutation({
  args: {
    userId: v.optional(v.id("profiles")),
    nicheId: v.optional(v.id("niches")),
    platform: v.optional(v.string()),
    channelNames: v.array(v.string()),
    taglines: v.array(v.string()),
    colorPalette: v.any(),
    toneDescriptor: v.string(),
    logoDescription: v.string(),
    styleGuide: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("brand_kits", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
