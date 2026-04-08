import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPlaybook = mutation({
  args: {
    authorId: v.id("profiles"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    niche: v.string(),
    targetPlatforms: v.array(v.string()),
    monetizationPaths: v.array(v.string()),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    content: v.any(),
    promptLibrary: v.optional(v.array(v.any())),
    toolStack: v.optional(v.array(v.string())),
    expectedIncomeRange: v.optional(v.string()),
    timeToResults: v.optional(v.string()),
    price: v.optional(v.float64()),
    isFree: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("playbooks", {
      ...args,
      downloadCount: 0,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const publishPlaybook = mutation({
  args: { id: v.id("playbooks"), aiQualityScore: v.optional(v.float64()) },
  handler: async (ctx, { id, aiQualityScore }) => {
    await ctx.db.patch(id, {
      status: "published",
      aiQualityScore,
      updatedAt: Date.now(),
    });
  },
});

export const listPublishedPlaybooks = query({
  args: {
    niche: v.optional(v.string()),
    difficulty: v.optional(
      v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))
    ),
    isFree: v.optional(v.boolean()),
  },
  handler: async (ctx, { niche, difficulty, isFree }) => {
    const all = await ctx.db
      .query("playbooks")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    return all
      .filter((p) => !niche || p.niche === niche)
      .filter((p) => !difficulty || p.difficulty === difficulty)
      .filter((p) => isFree === undefined || p.isFree === isFree)
      .sort((a, b) => (b.aiQualityScore ?? 0) - (a.aiQualityScore ?? 0));
  },
});

export const listUserPlaybooks = query({
  args: { authorId: v.id("profiles") },
  handler: async (ctx, { authorId }) => {
    return await ctx.db
      .query("playbooks")
      .withIndex("by_author", (q) => q.eq("authorId", authorId))
      .collect();
  },
});

export const getPlaybookBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("playbooks")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const purchasePlaybook = mutation({
  args: {
    userId: v.id("profiles"),
    playbookId: v.id("playbooks"),
    orderId: v.optional(v.id("orders")),
  },
  handler: async (ctx, args) => {
    // Increment download count
    const playbook = await ctx.db.get(args.playbookId);
    if (playbook) {
      await ctx.db.patch(args.playbookId, {
        downloadCount: (playbook.downloadCount ?? 0) + 1,
        updatedAt: Date.now(),
      });
    }
    return await ctx.db.insert("playbook_purchases", {
      ...args,
      purchasedAt: Date.now(),
      accessGranted: true,
    });
  },
});

export const checkPlaybookAccess = query({
  args: { userId: v.id("profiles"), playbookId: v.id("playbooks") },
  handler: async (ctx, { userId, playbookId }) => {
    // Free playbooks are always accessible
    const playbook = await ctx.db.get(playbookId);
    if (playbook?.isFree) return true;

    const purchase = await ctx.db
      .query("playbook_purchases")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("playbookId"), playbookId))
      .first();
    return purchase?.accessGranted ?? false;
  },
});

export const listUserPurchasedPlaybooks = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    const purchases = await ctx.db
      .query("playbook_purchases")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return Promise.all(
      purchases
        .filter((p) => p.accessGranted)
        .map(async (p) => ({
          ...p,
          playbook: await ctx.db.get(p.playbookId),
        }))
    );
  },
});

// ─── Agency / White-Label ─────────────────────────────────────────────────────

export const createAgency = mutation({
  args: {
    ownerId: v.id("profiles"),
    agencyName: v.string(),
    agencySlug: v.string(),
    planTier: v.union(v.literal("starter"), v.literal("growth"), v.literal("enterprise")),
    maxClients: v.float64(),
    maxCreators: v.float64(),
    whiteLabelDomain: v.optional(v.string()),
    brandConfig: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("agencies", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getAgencyByOwner = query({
  args: { ownerId: v.id("profiles") },
  handler: async (ctx, { ownerId }) => {
    return await ctx.db
      .query("agencies")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .first();
  },
});

export const addAgencyClient = mutation({
  args: {
    agencyId: v.id("agencies"),
    clientName: v.string(),
    clientEmail: v.optional(v.string()),
    assignedCreatorId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("agency_clients", {
      ...args,
      status: "active",
      joinedAt: now,
      updatedAt: now,
    });
  },
});

export const listAgencyClients = query({
  args: { agencyId: v.id("agencies") },
  handler: async (ctx, { agencyId }) => {
    return await ctx.db
      .query("agency_clients")
      .withIndex("by_agency", (q) => q.eq("agencyId", agencyId))
      .filter((q) => q.neq(q.field("status"), "churned"))
      .collect();
  },
});

export const createClientApproval = mutation({
  args: {
    agencyId: v.id("agencies"),
    clientId: v.id("agency_clients"),
    contentType: v.string(),
    contentRef: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("client_approvals", {
      ...args,
      status: "pending",
      submittedAt: Date.now(),
    });
  },
});

export const reviewClientApproval = mutation({
  args: {
    id: v.id("client_approvals"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("revision_requested")
    ),
    reviewerNote: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, reviewerNote }) => {
    await ctx.db.patch(id, { status, reviewerNote, reviewedAt: Date.now() });
  },
});

export const getPendingApprovals = query({
  args: { agencyId: v.id("agencies") },
  handler: async (ctx, { agencyId }) => {
    return await ctx.db
      .query("client_approvals")
      .withIndex("by_agency", (q) => q.eq("agencyId", agencyId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});
