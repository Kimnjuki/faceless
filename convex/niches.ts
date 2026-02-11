import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List niches with optional category/difficulty and sort.
 */
export const list = query({
  args: {
    categoryId: v.optional(v.id("niche_categories")),
    categoryName: v.optional(v.string()),
    difficultyLevel: v.optional(v.string()),
    sortBy: v.optional(v.union(v.literal("profitability"), v.literal("difficulty"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { categoryId, categoryName, difficultyLevel, sortBy, limit }) => {
    let results = await ctx.db.query("niches").collect();
    if (categoryName) {
      const cat = await ctx.db
        .query("niche_categories")
        .filter((q) => q.eq(q.field("name"), categoryName))
        .first();
      if (cat) results = results.filter((r) => r.categoryId === cat._id);
    } else if (categoryId) {
      results = results.filter((r) => r.categoryId === categoryId);
    }
    if (difficultyLevel && difficultyLevel !== "all")
      results = results.filter((r) => r.difficultyLevel === difficultyLevel);
    if (sortBy === "profitability")
      results.sort((a, b) => (b.profitabilityScore ?? 0) - (a.profitabilityScore ?? 0));
    else results.sort((a, b) => (a.nicheName ?? "").localeCompare(b.nicheName ?? ""));
    if (limit) results = results.slice(0, limit);
    const categories = await ctx.db.query("niche_categories").collect();
    const catMap = Object.fromEntries(categories.map((c) => [c._id, c]));
    return results.map((n) => ({
      ...n,
      category: n.categoryId ? catMap[n.categoryId] : null,
    }));
  },
});

/**
 * List niche categories.
 */
export const listCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("niche_categories").collect();
  },
});

/**
 * Get niche by ID with full details (case studies, content ideas, analysis).
 */
export const getById = query({
  args: { nicheId: v.id("niches") },
  handler: async (ctx, { nicheId }) => {
    const niche = await ctx.db.get(nicheId);
    if (!niche) return null;

    // Get category
    const category = niche.categoryId ? await ctx.db.get(niche.categoryId) : null;

    // Get case studies
    const caseStudies = await ctx.db
      .query("niche_case_studies")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .collect();

    // Get content ideas
    const contentIdeas = await ctx.db
      .query("niche_content_ideas")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .collect();

    // Get niche analysis if exists
    const analysis = await ctx.db
      .query("niche_analysis")
      .filter((q) => q.eq(q.field("nicheName"), niche.nicheName))
      .first();

    return {
      ...niche,
      category,
      caseStudies,
      contentIdeas,
      analysis,
    };
  },
});

/**
 * Get niche by name (slug-friendly lookup).
 */
export const getByName = query({
  args: { nicheName: v.string() },
  handler: async (ctx, { nicheName }) => {
    const niche = await ctx.db
      .query("niches")
      .withIndex("by_niche_name", (q) => q.eq("nicheName", nicheName))
      .first();

    if (!niche) return null;

    // Get full details inline
    const category = niche.categoryId ? await ctx.db.get(niche.categoryId) : null;

    const caseStudies = await ctx.db
      .query("niche_case_studies")
      .withIndex("by_niche", (q) => q.eq("nicheId", niche._id))
      .collect();

    const contentIdeas = await ctx.db
      .query("niche_content_ideas")
      .withIndex("by_niche", (q) => q.eq("nicheId", niche._id))
      .collect();

    const analysis = await ctx.db
      .query("niche_analysis")
      .filter((q) => q.eq(q.field("nicheName"), niche.nicheName))
      .first();

    return {
      ...niche,
      category,
      caseStudies,
      contentIdeas,
      analysis,
    };
  },
});

/**
 * Compare multiple niches side-by-side.
 */
export const compareNiches = query({
  args: { nicheIds: v.array(v.id("niches")) },
  handler: async (ctx, { nicheIds }) => {
    const niches = await Promise.all(
      nicheIds.map(async (id) => {
        const niche = await ctx.db.get(id);
        if (!niche) return null;

        const category = niche.categoryId ? await ctx.db.get(niche.categoryId) : null;

        return {
          ...niche,
          category,
        };
      })
    );

    return niches.filter(Boolean);
  },
});

/**
 * Get niche by ID (simple version for routing).
 */
export const getNicheById = query({
  args: { nicheId: v.id("niches") },
  handler: async (ctx, { nicheId }) => {
    return await ctx.db.get(nicheId);
  },
});

/**
 * Get niche case studies.
 */
export const getCaseStudies = query({
  args: { nicheId: v.id("niches"), limit: v.optional(v.number()) },
  handler: async (ctx, { nicheId, limit }) => {
    let caseStudies = await ctx.db
      .query("niche_case_studies")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .collect();

    // Sort by estimated earnings (highest first)
    caseStudies.sort((a, b) => (b.estimatedEarnings ?? 0) - (a.estimatedEarnings ?? 0));

    if (limit) {
      caseStudies = caseStudies.slice(0, limit);
    }

    return caseStudies;
  },
});

/**
 * Get niche content ideas.
 */
export const getContentIdeas = query({
  args: { nicheId: v.id("niches"), limit: v.optional(v.number()) },
  handler: async (ctx, { nicheId, limit }) => {
    let ideas = await ctx.db
      .query("niche_content_ideas")
      .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
      .collect();

    // Sort by creation date (newest first)
    ideas.sort((a, b) => b.createdAt - a.createdAt);

    if (limit) {
      ideas = ideas.slice(0, limit);
    }

    return ideas;
  },
});
