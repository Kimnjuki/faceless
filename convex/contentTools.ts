import { query } from "./_generated/server";
import { v } from "convex/values";

/** Studio / dashboard: ordered list of AI content tool definitions. */
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 100 }) => {
    let rows = await ctx.db.query("content_tools").collect();
    rows.sort((a, b) => a.orderIndex - b.orderIndex);
    if (limit) rows = rows.slice(0, limit);
    return rows;
  },
});
