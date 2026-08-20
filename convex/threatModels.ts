import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("threat_models").collect();
  },
});

export const getByProfile = query({
  args: { creatorProfile: v.string() },
  handler: async (ctx, { creatorProfile }) => {
    return await ctx.db
      .query("threat_models")
      .withIndex("by_profile", (q) => q.eq("creatorProfile", creatorProfile))
      .unique();
  },
});
