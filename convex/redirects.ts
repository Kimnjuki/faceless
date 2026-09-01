import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

function normalize(path: string): string {
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

/**
 * Lookup a single-hop redirect for a given path (P0-4 / T0-4).
 * Returns the redirect doc or null. The SPA/edge checks this before rendering.
 */
export const getByPath = query({
  args: { path: v.string() },
  handler: async (ctx, { path }) => {
    return await ctx.db
      .query("redirects")
      .withIndex("by_from_path", (q) => q.eq("fromPath", normalize(path)))
      .unique();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("redirects").collect();
  },
});

/** Idempotent insert/update keyed by fromPath. */
export const upsert = mutation({
  args: {
    fromPath: v.string(),
    toPath: v.string(),
    statusCode: v.union(v.literal(301), v.literal(302), v.literal(410)),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const from = normalize(args.fromPath);
    const existing = await ctx.db
      .query("redirects")
      .withIndex("by_from_path", (q) => q.eq("fromPath", from))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        toPath: args.toPath,
        statusCode: args.statusCode,
        reason: args.reason,
      });
      return existing._id;
    }
    return await ctx.db.insert("redirects", {
      fromPath: from,
      toPath: args.toPath,
      statusCode: args.statusCode,
      reason: args.reason,
      createdAt: Date.now(),
    });
  },
});

/**
 * Convert all 302 temporary redirects to 301 permanent redirects.
 * Safe to re-run; only touches records currently at 302.
 */
export const convert302to301 = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("redirects").collect();
    let converted = 0;
    for (const r of all) {
      if (r.statusCode === 302) {
        await ctx.db.patch(r._id, { statusCode: 301, reason: r.reason ? `${r.reason} (converted from 302)` : "converted from 302" });
        converted++;
      }
    }
    return { converted };
  },
});
