import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List templates with optional filters.
 */
export const list = query({
  args: {
    platform: v.optional(v.string()),
    niche: v.optional(v.string()),
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { platform, niche, type, limit }) => {
    let results = await ctx.db.query("templates").collect();
    if (platform && platform !== "all")
      results = results.filter((t) => t.platform === platform);
    if (niche && niche !== "all") results = results.filter((t) => t.niche === niche);
    if (type && type !== "all") results = results.filter((t) => t.type === type);
    results.sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0));
    if (limit) results = results.slice(0, limit);
    return results;
  },
});

/**
 * Increment template download count.
 */
export const incrementDownload = mutation({
  args: { templateId: v.id("templates") },
  handler: async (ctx, { templateId }) => {
    const t = await ctx.db.get(templateId);
    if (!t) return;
    await ctx.db.patch(templateId, {
      downloadCount: (t.downloadCount ?? 0) + 1,
    });
  },
});
