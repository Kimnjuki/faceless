import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Submit a lead (email capture). No table named "leads" in schema; use email_subscribers or a generic storage.
 * Schema has email_subscribers - we can add a simple leads table or use email_subscribers.
 * For minimal migration we'll use a mutation that stores in a table. Checking schema...
 * Schema has email_subscribers, not "leads". Frontend Lead type: id, email, source, created_at.
 * We don't have a "leads" table in Convex schema. Add one or use email_subscribers.
 * Adding a simple leads table would require schema change. Use email_subscribers with status 'active' and source as the "source" for lead.
 */

// Store in email_subscribers with a "lead" source for backward compatibility, or we need a leads table.
// Schema doesn't have "leads" - so either add it to schema or use email_subscribers. 
// Adding leads table to schema and convex/leads.ts that inserts into it would require schema update.
// Quick path: create a mutation that inserts into email_subscribers with source = args.source, and no profileId/leadMagnetId.
// But email_subscribers has required field "status" (emailSubscriberStatus). So we can do:
// email_subscribers: email, profileId optional, source, leadMagnetId optional, status: 'active', subscribedAt: now.
export const create = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, { email, source }) => {
    const now = Date.now();
    return await ctx.db.insert("email_subscribers", {
      email,
      source: source ?? "website",
      status: "active",
      subscribedAt: now,
    });
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    let results = await ctx.db.query("email_subscribers").collect();
    results.sort((a, b) => b.subscribedAt - a.subscribedAt);
    if (limit) results = results.slice(0, limit);
    return results;
  },
});
