import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get profile by external user id (e.g. Auth0 sub).
 */
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
  },
});

/**
 * Get profile by Convex id (for joins).
 */
export const get = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * List all profiles (e.g. for member directory).
 */
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    let results = await ctx.db.query("profiles").collect();
    if (limit) results = results.slice(0, limit);
    return results;
  },
});

/**
 * Create or update profile. Call from frontend after auth (e.g. Auth0) with user id and email.
 */
export const upsertFromAuth = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, { userId, email, fullName, avatarUrl }) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        email,
        fullName: fullName ?? existing.fullName,
        avatarUrl: avatarUrl ?? existing.avatarUrl,
        updatedAt: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("profiles", {
      userId,
      email,
      fullName: fullName ?? "",
      subscriptionTier: "free",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update profile fields (name, niche, etc.).
 */
export const update = mutation({
  args: {
    userId: v.string(),
    fullName: v.optional(v.string()),
    primaryNiche: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, { userId, ...updates }) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
    if (!existing) throw new Error("Profile not found");
    const toPatch: Record<string, any> = { updatedAt: Date.now() };
    if (updates.fullName !== undefined) toPatch.fullName = updates.fullName;
    if (updates.primaryNiche !== undefined) toPatch.primaryNiche = updates.primaryNiche;
    if (updates.bio !== undefined) toPatch.bio = updates.bio;
    if (updates.avatarUrl !== undefined) toPatch.avatarUrl = updates.avatarUrl;
    if (updates.websiteUrl !== undefined) toPatch.websiteUrl = updates.websiteUrl;
    await ctx.db.patch(existing._id, toPatch);
    return existing._id;
  },
});
