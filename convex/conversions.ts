import { mutation } from "./_generated/server";
import { v } from "convex/values";

/** Track tool usage, calculator runs, etc. */
export const track = mutation({
  args: {
    conversionType: v.string(),
    source: v.optional(v.string()),
    campaign: v.optional(v.string()),
    medium: v.optional(v.string()),
    revenue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("conversions", {
      conversionType: args.conversionType,
      source: args.source,
      campaign: args.campaign,
      medium: args.medium,
      revenue: args.revenue,
      convertedAt: now,
    });
  },
});
