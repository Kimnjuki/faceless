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
