import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List forum posts (community) with optional category.
 */
export const listPosts = query({
  args: {
    categoryId: v.optional(v.id("community_categories")),
    categoryName: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { categoryId, categoryName, limit }) => {
    let results = await ctx.db
      .query("forum_posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    if (categoryName) {
      const cat = await ctx.db
        .query("community_categories")
        .filter((q) => q.eq(q.field("name"), categoryName))
        .first();
      if (cat) results = results.filter((r) => r.categoryId === cat._id);
    } else if (categoryId) {
      results = results.filter((r) => r.categoryId === categoryId);
    }
    results.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    if (limit) results = results.slice(0, limit);
    const categories = await ctx.db.query("community_categories").collect();
    const catMap = Object.fromEntries(categories.map((c) => [c._id, c]));
    const authorIds = [...new Set(results.map((r) => r.authorId).filter(Boolean))] as any[];
    const authors = await Promise.all(authorIds.map((id) => ctx.db.get(id)));
    const authorMap = Object.fromEntries(authorIds.map((id, i) => [id, authors[i]]));
    return results.map((p) => ({
      ...p,
      category: p.categoryId ? catMap[p.categoryId] : null,
      author: p.authorId ? authorMap[p.authorId] : null,
    }));
  },
});

/**
 * List community categories.
 */
export const listCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("community_categories").collect();
  },
});

/**
 * Create a new forum post. Requires auth identity to be passed (e.g. from Auth0 sub).
 */
export const createPost = mutation({
  args: {
    authorUserId: v.string(),
    title: v.string(),
    content: v.string(),
    categoryId: v.optional(v.id("community_categories")),
    postType: v.optional(v.union(
      v.literal("discussion"),
      v.literal("question"),
      v.literal("success_story"),
      v.literal("resource")
    )),
  },
  handler: async (ctx, { authorUserId, title, content, categoryId, postType }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", authorUserId))
      .first();
    const authorId = profile?._id;
    const now = Date.now();
    return await ctx.db.insert("forum_posts", {
      authorId,
      title,
      content,
      categoryId,
      postType: postType ?? "discussion",
      pinned: false,
      status: "published",
      viewCount: 0,
      replyCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});
