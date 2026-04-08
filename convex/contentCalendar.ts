import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Content Calendars ────────────────────────────────────────────────────────

export const createContentCalendar = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    calendarName: v.string(),
    niche: v.string(),
    targetPlatforms: v.array(v.string()),
    durationDays: v.float64(),
    startDate: v.float64(),
    aiModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content_calendars", {
      ...args,
      generatedAt: Date.now(),
      status: "active",
    });
  },
});

export const listContentCalendars = query({
  args: { userId: v.id("profiles"), personaId: v.optional(v.id("creator_personas")) },
  handler: async (ctx, { userId, personaId }) => {
    const calendars = await ctx.db
      .query("content_calendars")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return calendars.filter((c) => !personaId || c.personaId === personaId);
  },
});

export const archiveContentCalendar = mutation({
  args: { id: v.id("content_calendars") },
  handler: async (ctx, { id }) => ctx.db.patch(id, { status: "archived" }),
});

// ─── Calendar Items ───────────────────────────────────────────────────────────

export const bulkCreateCalendarItems = mutation({
  args: {
    items: v.array(
      v.object({
        calendarId: v.id("content_calendars"),
        scheduledDate: v.float64(),
        platform: v.string(),
        contentTitle: v.string(),
        hook: v.optional(v.string()),
        contentType: v.union(
          v.literal("short"),
          v.literal("long"),
          v.literal("reel"),
          v.literal("post"),
          v.literal("newsletter")
        ),
        monetizationPath: v.optional(v.string()),
        estimatedReach: v.optional(v.float64()),
        estimatedRevenue: v.optional(v.float64()),
      })
    ),
  },
  handler: async (ctx, { items }) => {
    const ids: string[] = [];
    for (const item of items) {
      const id = await ctx.db.insert("calendar_items", { ...item, status: "planned" });
      ids.push(id);
    }
    return ids;
  },
});

export const getCalendarItems = query({
  args: { calendarId: v.id("content_calendars") },
  handler: async (ctx, { calendarId }) => {
    const items = await ctx.db
      .query("calendar_items")
      .withIndex("by_calendar", (q) => q.eq("calendarId", calendarId))
      .collect();
    return items.sort((a, b) => a.scheduledDate - b.scheduledDate);
  },
});

export const updateCalendarItemStatus = mutation({
  args: {
    id: v.id("calendar_items"),
    status: v.union(
      v.literal("planned"),
      v.literal("scripted"),
      v.literal("produced"),
      v.literal("published"),
      v.literal("skipped")
    ),
    scriptProjectId: v.optional(v.id("script_projects")),
    publishedAt: v.optional(v.float64()),
    actualPerformance: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

// ─── Storyboards ──────────────────────────────────────────────────────────────

export const createStoryboard = mutation({
  args: {
    userId: v.id("profiles"),
    scriptProjectId: v.id("script_projects"),
    title: v.string(),
    platform: v.string(),
    totalScenes: v.float64(),
    estimatedDuration: v.float64(),
    scenes: v.array(
      v.object({
        sceneOrder: v.float64(),
        timestampStart: v.float64(),
        timestampEnd: v.float64(),
        sceneType: v.union(
          v.literal("hook"),
          v.literal("problem"),
          v.literal("solution"),
          v.literal("cta"),
          v.literal("broll"),
          v.literal("outro")
        ),
        narrationText: v.string(),
        visualDescription: v.string(),
        brollSuggestions: v.array(v.string()),
        stockSearchQuery: v.optional(v.string()),
        textOverlay: v.optional(v.string()),
        overlayPosition: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { scenes, ...args }) => {
    const now = Date.now();
    const storyboardId = await ctx.db.insert("storyboards", {
      ...args,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    for (const scene of scenes) {
      await ctx.db.insert("storyboard_scenes", { storyboardId, ...scene });
    }
    return storyboardId;
  },
});

export const getStoryboardWithScenes = query({
  args: { storyboardId: v.id("storyboards") },
  handler: async (ctx, { storyboardId }) => {
    const storyboard = await ctx.db.get(storyboardId);
    if (!storyboard) return null;
    const scenes = await ctx.db
      .query("storyboard_scenes")
      .withIndex("by_storyboard", (q) => q.eq("storyboardId", storyboardId))
      .collect();
    return { storyboard, scenes: scenes.sort((a, b) => a.sceneOrder - b.sceneOrder) };
  },
});

export const listUserStoryboards = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("storyboards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const finalizeStoryboard = mutation({
  args: { id: v.id("storyboards"), exportUrl: v.optional(v.string()) },
  handler: async (ctx, { id, exportUrl }) => {
    await ctx.db.patch(id, { status: "finalized", exportUrl, updatedAt: Date.now() });
  },
});

// ─── Publishing Queue ─────────────────────────────────────────────────────────

export const addToPublishingQueue = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    calendarItemId: v.optional(v.id("calendar_items")),
    platform: v.string(),
    contentTitle: v.string(),
    adaptedCaption: v.optional(v.string()),
    hashtags: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    scheduledFor: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("publishing_queue", {
      ...args,
      status: "queued",
      createdAt: Date.now(),
    });
  },
});

export const updatePublishStatus = mutation({
  args: {
    id: v.id("publishing_queue"),
    status: v.union(
      v.literal("queued"),
      v.literal("published"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    platformPostId: v.optional(v.string()),
    publishedAt: v.optional(v.float64()),
    errorDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
  },
});

export const getPublishingQueue = query({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { userId, personaId, status }) => {
    const items = await ctx.db
      .query("publishing_queue")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return items
      .filter((i) => !personaId || i.personaId === personaId)
      .filter((i) => !status || i.status === status)
      .sort((a, b) => a.scheduledFor - b.scheduledFor);
  },
});
