import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List webinars (used as "events" in the app).
 */
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    let results = await ctx.db.query("webinars").collect();
    results.sort((a, b) => (b.scheduledAt ?? 0) - (a.scheduledAt ?? 0));
    if (limit) results = results.slice(0, limit);
    return results;
  },
});
