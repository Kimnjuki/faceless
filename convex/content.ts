import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Map NewsAPI/agency category to Nexus niche (display label). */
const AGENCY_CATEGORY_TO_NICHE: Record<string, string> = {
  business: "Business & Finance",
  entertainment: "Entertainment",
  general: "General",
  health: "Health & Wellness",
  science: "Science & Research",
  sports: "Sports",
  technology: "Tech & Software",
};

const upsertItemValidator = v.object({
  externalId: v.string(),
  source: v.string(),
  isAutomated: v.boolean(),
  originalUrl: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  publishedAt: v.number(),
  agencyCategory: v.optional(v.string()),
});

/**
 * List ingested content for NewsFeed. Ordered by publishedAt descending.
 * Called from frontend via useQuery(api.content.list).
 */
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 500 }) => {
    const results = await ctx.db
      .query("content")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(limit);
    return results;
  },
});

/**
 * Upsert a single item from the news ingestor. Validates externalId to prevent duplicates.
 * Maps agency category to Nexus niche. Only callable from backend (action/cron).
 */
export const upsertFromIngestion = internalMutation({
  args: { item: upsertItemValidator },
  handler: async (ctx, { item }) => {
    const existing = await ctx.db
      .query("content")
      .withIndex("by_externalId", (q) => q.eq("externalId", item.externalId))
      .first();

    const now = Date.now();
    const niche = item.agencyCategory
      ? AGENCY_CATEGORY_TO_NICHE[item.agencyCategory.toLowerCase()] ?? item.agencyCategory
      : undefined;

    const doc = {
      externalId: item.externalId,
      source: item.source,
      isAutomated: item.isAutomated,
      originalUrl: item.originalUrl,
      title: item.title,
      description: item.description,
      url: item.url,
      publishedAt: item.publishedAt,
      niche,
      agencyCategory: item.agencyCategory,
      updatedAt: now,
      ...(existing ? {} : { createdAt: now }),
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("content", { ...doc, createdAt: now });
  },
});
