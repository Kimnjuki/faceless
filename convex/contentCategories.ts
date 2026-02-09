import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const UNCATEGORIZED_SLUG = "uncategorized";

/**
 * List all content categories, ordered by sortOrder.
 * Always includes virtual "Uncategorized" for display when article.categoryId is null.
 */
export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("content_categories")
      .order("asc")
      .collect();
    const hasUncategorized = categories.some((c) => c.slug === UNCATEGORIZED_SLUG);
    if (!hasUncategorized) {
      return [
        { _id: null as any, name: "Uncategorized", slug: UNCATEGORIZED_SLUG, description: "Articles not yet assigned to a category", sortOrder: -1 },
        ...categories,
      ];
    }
    return categories;
  },
});

/**
 * Ensure the default "Uncategorized" category exists.
 * Run once during migration to create it in the database.
 */
export const ensureUncategorized = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("content_categories")
      .withIndex("by_slug", (q) => q.eq("slug", UNCATEGORIZED_SLUG))
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("content_categories", {
      name: "Uncategorized",
      slug: UNCATEGORIZED_SLUG,
      description: "Articles not yet assigned to a category",
      sortOrder: -1,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get category by slug.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("content_categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});
