import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List tools with optional category filter.
 */
export const list = query({
  args: {
    categoryId: v.optional(v.id("tool_categories")),
    categoryName: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { categoryId, categoryName, limit }) => {
    let results;
    if (categoryName) {
      const cat = await ctx.db
        .query("tool_categories")
        .filter((q) => q.eq(q.field("name"), categoryName))
        .first();
      if (cat) {
        results = await ctx.db
          .query("tools")
          .withIndex("by_category", (q) => q.eq("categoryId", cat._id))
          .collect();
      } else {
        results = await ctx.db.query("tools").collect();
      }
    } else if (categoryId) {
      results = await ctx.db
        .query("tools")
        .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
        .collect();
    } else {
      results = await ctx.db.query("tools").collect();
    }
    results.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    if (limit) results = results.slice(0, limit);
    const categories = await ctx.db.query("tool_categories").collect();
    const catMap = Object.fromEntries(categories.map((c) => [c._id, c]));
    const links = await ctx.db.query("affiliate_links").collect();
    return results.map((t) => {
      const category = t.categoryId ? catMap[t.categoryId] : null;
      const link = links.find(
        (l) => l.slug?.toLowerCase().includes(t.name.toLowerCase().split(" ")[0])
      );
      return {
        ...t,
        category: category
          ? { id: category._id, name: category.name, description: category.description }
          : null,
        affiliate_link: link
          ? { id: link._id, destination_url: link.destinationUrl, slug: link.slug, cta_text: link.ctaText }
          : null,
        affiliate_url: link?.destinationUrl ?? null,
      };
    });
  },
});

/**
 * Get all tool categories.
 */
export const listCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("tool_categories").collect();
  },
});
