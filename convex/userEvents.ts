import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Append a first-party analytics event (P0-5 / phase_5 event taxonomy).
 * Mirrors the GA4 events already emitted client-side, but persisted to the
 * `user_events` table so funnels (quiz_started -> quiz_completed -> email_signup
 * -> trial_started) are queryable without exporting from GA4.
 */
export const log = mutation({
  args: {
    eventType: v.string(),
    eventData: v.optional(v.any()),
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, { eventType, eventData, sessionId, userId }) => {
    return await ctx.db.insert("user_events", {
      eventType,
      eventData,
      sessionId,
      userId,
      createdAt: Date.now(),
    });
  },
});

/** Revenue-attributed events also land in `conversions` for attribution. */
export const logConversion = mutation({
  args: {
    conversionType: v.string(),
    source: v.optional(v.string()),
    revenue: v.optional(v.float64()),
    userId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, { conversionType, source, revenue, userId }) => {
    await ctx.db.insert("conversions", {
      conversionType,
      source,
      revenue,
      userId,
      convertedAt: Date.now(),
    });
  },
});
