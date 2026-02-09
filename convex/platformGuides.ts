import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List platform guides (published only).
 */
export const list = query({
  args: {
    platform: v.optional(v.string()),
    category: v.optional(v.string()),
    difficultyLevel: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { platform, category, difficultyLevel, limit }) => {
    // Include guides where published is true or undefined (not explicitly false)
    let results = await ctx.db.query("platform_guides").collect();
    results = results.filter((g) => g.published !== false);
    if (platform && platform !== "all")
      results = results.filter((r) => r.platform === platform);
    if (category && category !== "all")
      results = results.filter((r) => r.category === category);
    if (difficultyLevel && difficultyLevel !== "all")
      results = results.filter((r) => r.difficultyLevel === difficultyLevel);
    results.sort((a, b) => (b.publishedAt ?? b.createdAt ?? 0) - (a.publishedAt ?? a.createdAt ?? 0));
    if (limit) results = results.slice(0, limit);
    const authorIds = [...new Set(results.map((r) => r.authorId).filter(Boolean))] as any[];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = Object.fromEntries(
      authorIds.map((id, i) => [id, authors[i]])
    );
    return results.map((g) => ({
      ...g,
      author: g.authorId ? authorMap[g.authorId] : null,
    }));
  },
});

/**
 * Get platform guide by slug.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const guide = await ctx.db
      .query("platform_guides")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!guide) return null;
    const author = guide.authorId ? await ctx.db.get(guide.authorId) : null;
    return { ...guide, author };
  },
});

/**
 * Increment guide view count.
 */
export const incrementViews = mutation({
  args: { guideId: v.id("platform_guides") },
  handler: async (ctx, { guideId }) => {
    const g = await ctx.db.get(guideId);
    if (!g) return;
    await ctx.db.patch(guideId, {
      viewCount: (g.viewCount ?? 0) + 1,
    });
  },
});
