import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Public contact form → support_tickets (no login required).
 */
export const create = mutation({
  args: {
    subject: v.string(),
    description: v.string(),
    contactEmail: v.string(),
    contactName: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("normal"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("support_tickets", {
      subject: args.subject.slice(0, 500),
      description: args.description.slice(0, 20000),
      contactEmail: args.contactEmail.trim().toLowerCase().slice(0, 320),
      contactName: args.contactName?.slice(0, 200),
      priority: args.priority ?? "normal",
      status: "open",
      createdAt: now,
      updatedAt: now,
    });
  },
});
