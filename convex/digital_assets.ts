import { query } from "./_generated/server";
import { v } from "convex/values";

/** Public downloadable assets (no auth). */
export const listPublic = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 100 }) => {
    const rows = await ctx.db.query("digital_assets").collect();
    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows.slice(0, limit);
  },
});
