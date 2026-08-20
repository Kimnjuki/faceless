import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Persist a single route-health result. Backs the CI route checker
 * (scripts/check-routes.mjs) so 5xx/404 regressions are recorded and can be
 * queried, not just discovered weeks later in Search Console (P0-3 / T0-3).
 */
export const record = mutation({
  args: {
    path: v.string(),
    statusCode: v.float64(),
  },
  handler: async (ctx, { path, statusCode }) => {
    const normalized = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
    const existing = await ctx.db
      .query("route_health_checks")
      .withIndex("by_path", (q) => q.eq("path", normalized))
      .unique();

    const isFailure = statusCode >= 400;
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastStatusCode: statusCode,
        lastCheckedAt: Date.now(),
        consecutiveFailures: isFailure ? existing.consecutiveFailures + 1 : 0,
      });
      return existing._id;
    }
    return await ctx.db.insert("route_health_checks", {
      path: normalized,
      lastStatusCode: statusCode,
      lastCheckedAt: Date.now(),
      consecutiveFailures: isFailure ? 1 : 0,
    });
  },
});

/** List routes currently failing health checks (consecutiveFailures > 0). */
export const failing = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("route_health_checks").collect();
    return all.filter((r) => r.consecutiveFailures > 0);
  },
});
