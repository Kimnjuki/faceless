import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 500 }) => {
    let rows = await ctx.db.query("niche_analysis").collect();
    rows.sort((a, b) => (a.nicheName ?? "").localeCompare(b.nicheName ?? ""));
    if (limit) rows = rows.slice(0, limit);
    return rows;
  },
});

export const getByNicheName = query({
  args: { nicheName: v.string() },
  handler: async (ctx, { nicheName }) => {
    return await ctx.db
      .query("niche_analysis")
      .filter((q) => q.eq(q.field("nicheName"), nicheName))
      .first();
  },
});
