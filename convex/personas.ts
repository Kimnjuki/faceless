import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPersona = mutation({
  args: {
    userId: v.id("profiles"),
    personaName: v.string(),
    personaSlug: v.string(),
    targetPlatforms: v.array(v.string()),
    primaryNiche: v.optional(v.string()),
    voiceProfileId: v.optional(v.id("voice_profiles")),
    anonymityLevel: v.union(
      v.literal("standard"),
      v.literal("enhanced"),
      v.literal("maximum")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("creator_personas", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePersona = mutation({
  args: {
    id: v.id("creator_personas"),
    personaName: v.optional(v.string()),
    targetPlatforms: v.optional(v.array(v.string())),
    primaryNiche: v.optional(v.string()),
    voiceProfileId: v.optional(v.id("voice_profiles")),
    contentStrategyId: v.optional(v.id("content_calendars")),
    anonymityLevel: v.optional(
      v.union(v.literal("standard"), v.literal("enhanced"), v.literal("maximum"))
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

export const listPersonas = query({
  args: { userId: v.id("profiles"), activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, { userId, activeOnly }) => {
    const personas = await ctx.db
      .query("creator_personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return activeOnly ? personas.filter((p) => p.isActive) : personas;
  },
});

export const getPersona = query({
  args: { id: v.id("creator_personas") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const getPersonaBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("creator_personas")
      .withIndex("by_slug", (q) => q.eq("personaSlug", slug))
      .first();
  },
});

export const deletePersona = mutation({
  args: { id: v.id("creator_personas") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: false, updatedAt: Date.now() });
  },
});
