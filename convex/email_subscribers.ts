import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Newsletter / lead magnet opt-in (AdSense engagement signal).
 */
export const create = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    leadMagnetId: v.optional(v.id("lead_magnets")),
  },
  handler: async (ctx, { email, source, leadMagnetId }) => {
    const normalized = email.trim().toLowerCase();
    const existing = await ctx.db
      .query("email_subscribers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        source: source ?? existing.source,
        leadMagnetId: leadMagnetId ?? existing.leadMagnetId,
        status: "active",
        lastEngaged: now,
      });
      return existing._id;
    }
    return await ctx.db.insert("email_subscribers", {
      email: normalized,
      source: source ?? "website",
      leadMagnetId,
      status: "active",
      subscribedAt: now,
    });
  },
});

export const checkExists = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    const row = await ctx.db
      .query("email_subscribers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    return Boolean(row);
  },
});
