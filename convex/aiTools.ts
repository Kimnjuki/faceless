import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Script Projects ──────────────────────────────────────────────────────────

export const createScriptProject = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    title: v.string(),
    niche: v.string(),
    targetPlatform: v.string(),
    monetizationPath: v.union(
      v.literal("affiliate"),
      v.literal("digital_product"),
      v.literal("adsense"),
      v.literal("ugc_brand_deal"),
      v.literal("saas"),
      v.literal("course")
    ),
    funnelTemplateId: v.optional(v.id("script_funnel_templates")),
    hookVariants: v.optional(v.array(v.any())),
    scriptContent: v.any(),
    wordCount: v.optional(v.float64()),
    estimatedDuration: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("script_projects", {
      ...args,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateScriptProject = mutation({
  args: {
    id: v.id("script_projects"),
    title: v.optional(v.string()),
    scriptContent: v.optional(v.any()),
    hookVariants: v.optional(v.array(v.any())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    wordCount: v.optional(v.float64()),
    estimatedDuration: v.optional(v.float64()),
    performanceData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

export const listScriptProjects = query({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
  },
  handler: async (ctx, { userId, personaId, status }) => {
    let q = ctx.db
      .query("script_projects")
      .withIndex("by_user", (q) => q.eq("userId", userId));
    const results = await q.collect();
    return results
      .filter((s) => !personaId || s.personaId === personaId)
      .filter((s) => !status || s.status === status)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getScriptProject = query({
  args: { id: v.id("script_projects") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const deleteScriptProject = mutation({
  args: { id: v.id("script_projects") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
});

// ─── Script Funnel Templates ──────────────────────────────────────────────────

export const listFunnelTemplates = query({
  args: {
    platform: v.optional(v.string()),
    monetizationPath: v.optional(v.string()),
  },
  handler: async (ctx, { platform, monetizationPath }) => {
    const all = await ctx.db.query("script_funnel_templates").collect();
    return all
      .filter((t) => t.isPublic)
      .filter((t) => !platform || t.targetPlatform === platform)
      .filter((t) => !monetizationPath || t.monetizationPath === monetizationPath);
  },
});

export const createFunnelTemplate = mutation({
  args: {
    templateName: v.string(),
    monetizationPath: v.string(),
    targetPlatform: v.string(),
    structure: v.any(),
    ctaFormats: v.array(v.string()),
    exampleScripts: v.optional(v.array(v.any())),
    nicheCompatibility: v.optional(v.array(v.string())),
    isPublic: v.boolean(),
    createdBy: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("script_funnel_templates", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ─── A/B Test Experiments ─────────────────────────────────────────────────────

export const createAbExperiment = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    experimentName: v.string(),
    contentType: v.union(
      v.literal("hook"),
      v.literal("thumbnail"),
      v.literal("title"),
      v.literal("cta"),
      v.literal("description")
    ),
    platform: v.string(),
    variants: v.array(v.object({ variantLabel: v.string(), content: v.any() })),
  },
  handler: async (ctx, { variants, ...args }) => {
    const now = Date.now();
    const experimentId = await ctx.db.insert("ab_test_experiments", {
      ...args,
      status: "running",
      startedAt: now,
      createdAt: now,
    });
    for (const variant of variants) {
      await ctx.db.insert("ab_test_variants", {
        experimentId,
        variantLabel: variant.variantLabel,
        content: variant.content,
        createdAt: now,
      });
    }
    return experimentId;
  },
});

export const listAbExperiments = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    const experiments = await ctx.db
      .query("ab_test_experiments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return experiments.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getAbExperimentWithVariants = query({
  args: { experimentId: v.id("ab_test_experiments") },
  handler: async (ctx, { experimentId }) => {
    const experiment = await ctx.db.get(experimentId);
    if (!experiment) return null;
    const variants = await ctx.db
      .query("ab_test_variants")
      .withIndex("by_experiment", (q) => q.eq("experimentId", experimentId))
      .collect();
    return { experiment, variants };
  },
});

export const recordVariantImpression = mutation({
  args: { variantId: v.id("ab_test_variants") },
  handler: async (ctx, { variantId }) => {
    const variant = await ctx.db.get(variantId);
    if (!variant) return;
    await ctx.db.patch(variantId, {
      impressions: (variant.impressions ?? 0) + 1,
      ctr:
        (variant.clicks ?? 0) /
        Math.max((variant.impressions ?? 0) + 1, 1),
    });
  },
});

export const recordVariantClick = mutation({
  args: { variantId: v.id("ab_test_variants") },
  handler: async (ctx, { variantId }) => {
    const variant = await ctx.db.get(variantId);
    if (!variant) return;
    const clicks = (variant.clicks ?? 0) + 1;
    const impressions = variant.impressions ?? 1;
    await ctx.db.patch(variantId, {
      clicks,
      ctr: clicks / Math.max(impressions, 1),
    });
  },
});

export const declareAbWinner = mutation({
  args: {
    experimentId: v.id("ab_test_experiments"),
    winnerId: v.id("ab_test_variants"),
    statisticalConfidence: v.float64(),
  },
  handler: async (ctx, { experimentId, winnerId, statisticalConfidence }) => {
    await ctx.db.patch(experimentId, {
      status: "completed",
      winnerId,
      statisticalConfidence,
      completedAt: Date.now(),
    });
  },
});

// ─── Affiliate Recommendations ────────────────────────────────────────────────

export const listAffiliateRecommendations = query({
  args: { userId: v.id("profiles"), nicheId: v.optional(v.id("niches")) },
  handler: async (ctx, { userId, nicheId }) => {
    const recs = await ctx.db
      .query("affiliate_recommendations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const filtered = recs
      .filter((r) => !r.dismissed)
      .filter((r) => !nicheId || r.nicheId === nicheId)
      .sort((a, b) => b.matchScore - a.matchScore);

    // Enrich with program data
    return Promise.all(
      filtered.map(async (rec) => {
        const program = await ctx.db.get(rec.programId);
        return { ...rec, program };
      })
    );
  },
});

export const createAffiliateRecommendation = mutation({
  args: {
    userId: v.id("profiles"),
    nicheId: v.optional(v.id("niches")),
    programId: v.id("affiliate_programs"),
    matchScore: v.float64(),
    matchReasons: v.array(v.string()),
    estimatedEpc: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("affiliate_recommendations", {
      ...args,
      recommendedAt: Date.now(),
    });
  },
});

export const dismissAffiliateRecommendation = mutation({
  args: { id: v.id("affiliate_recommendations") },
  handler: async (ctx, { id }) => ctx.db.patch(id, { dismissed: true }),
});

// ─── Income Projections ───────────────────────────────────────────────────────

export const createIncomeProjection = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    nicheId: v.optional(v.id("niches")),
    postingFrequency: v.string(),
    monetizationMix: v.any(),
    projectionPeriodDays: v.float64(),
    month3Projection: v.optional(v.float64()),
    month6Projection: v.optional(v.float64()),
    month12Projection: v.optional(v.float64()),
    confidenceBand: v.optional(v.any()),
    assumptions: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("income_projections", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listIncomeProjections = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("income_projections")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// ─── Niche Trend Snapshots ────────────────────────────────────────────────────

export const getLatestNicheTrend = query({
  args: { nicheId: v.id("niches") },
  handler: async (ctx, { nicheId }) => {
    const snapshots = await ctx.db
      .query("niche_trend_snapshots")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .collect();
    return snapshots.sort((a, b) => b.snapshotDate - a.snapshotDate)[0] ?? null;
  },
});

export const insertNicheTrendSnapshot = mutation({
  args: {
    nicheId: v.id("niches"),
    trendingScore: v.float64(),
    searchVolumeDelta: v.optional(v.float64()),
    competitionDelta: v.optional(v.float64()),
    rpmDelta: v.optional(v.float64()),
    topKeywords: v.optional(v.array(v.string())),
    dataSource: v.optional(v.string()),
    rawData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("niche_trend_snapshots", {
      ...args,
      snapshotDate: Date.now(),
    });
  },
});
