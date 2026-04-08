import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const anonymizationLevel = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("maximum")
);

// ─── Voice Profiles ───────────────────────────────────────────────────────────

export const createVoiceProfile = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    profileName: v.string(),
    voiceProvider: v.string(),
    voiceConfig: v.any(),
    anonymizationLevel: anonymizationLevel,
    antiMatchingEnabled: v.boolean(),
    jitterConfig: v.optional(v.any()),
    pitchEnvelopeConfig: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("voice_profiles", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateVoiceProfile = mutation({
  args: {
    id: v.id("voice_profiles"),
    profileName: v.optional(v.string()),
    voiceConfig: v.optional(v.any()),
    anonymizationLevel: v.optional(anonymizationLevel),
    antiMatchingEnabled: v.optional(v.boolean()),
    jitterConfig: v.optional(v.any()),
    pitchEnvelopeConfig: v.optional(v.any()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() });
  },
});

export const listVoiceProfiles = query({
  args: { userId: v.id("profiles"), personaId: v.optional(v.id("creator_personas")) },
  handler: async (ctx, { userId, personaId }) => {
    const profiles = await ctx.db
      .query("voice_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return profiles
      .filter((p) => !personaId || p.personaId === personaId)
      .filter((p) => p.isActive);
  },
});

export const deleteVoiceProfile = mutation({
  args: { id: v.id("voice_profiles") },
  handler: async (ctx, { id }) => ctx.db.patch(id, { isActive: false, updatedAt: Date.now() }),
});

// ─── Voice Projects ───────────────────────────────────────────────────────────

export const createVoiceProject = mutation({
  args: {
    userId: v.id("profiles"),
    voiceProfileId: v.id("voice_profiles"),
    inputAudioUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("voice_projects", {
      ...args,
      status: "queued",
      createdAt: Date.now(),
    });
  },
});

export const updateVoiceProject = mutation({
  args: {
    id: v.id("voice_projects"),
    status: v.union(
      v.literal("queued"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    outputAudioUrl: v.optional(v.string()),
    anonymityScore: v.optional(v.float64()),
    processingMetadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    const completedAt = patch.status === "completed" ? Date.now() : undefined;
    await ctx.db.patch(id, { ...patch, ...(completedAt ? { completedAt } : {}) });
  },
});

export const listVoiceProjects = query({
  args: { userId: v.id("profiles"), status: v.optional(v.string()) },
  handler: async (ctx, { userId, status }) => {
    const projects = await ctx.db
      .query("voice_projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return projects
      .filter((p) => !status || p.status === status)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ─── Anonymity Audits ─────────────────────────────────────────────────────────

export const createAnonymityAudit = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    exportJobId: v.optional(v.id("export_jobs")),
    voiceScore: v.float64(),
    metadataScore: v.float64(),
    ipExposureScore: v.float64(),
    traceabilityScore: v.float64(),
    compositeAnonymityScore: v.float64(),
    riskFlags: v.array(v.string()),
    recommendations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("anonymity_audits", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getLatestAnonymityAudit = query({
  args: { userId: v.id("profiles"), personaId: v.optional(v.id("creator_personas")) },
  handler: async (ctx, { userId, personaId }) => {
    const audits = await ctx.db
      .query("anonymity_audits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const filtered = audits.filter((a) => !personaId || a.personaId === personaId);
    return filtered.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null;
  },
});

export const listAnonymityAudits = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("anonymity_audits")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// ─── Export Jobs ──────────────────────────────────────────────────────────────

export const createExportJob = mutation({
  args: {
    userId: v.id("profiles"),
    personaId: v.optional(v.id("creator_personas")),
    projectType: v.union(
      v.literal("script"),
      v.literal("audio"),
      v.literal("video"),
      v.literal("image"),
      v.literal("bundle")
    ),
    exportMode: v.union(
      v.literal("standard"),
      v.literal("zero_metadata"),
      v.literal("maximum_anonymity")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("export_jobs", {
      ...args,
      metadataStripped: false,
      voiceAnonymized: false,
      status: "queued",
      createdAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  },
});

export const updateExportJob = mutation({
  args: {
    id: v.id("export_jobs"),
    status: v.union(
      v.literal("queued"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("expired")
    ),
    fileUrl: v.optional(v.string()),
    metadataStripped: v.optional(v.boolean()),
    voiceAnonymized: v.optional(v.boolean()),
    anonymityScore: v.optional(v.float64()),
    auditLog: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    const completedAt = patch.status === "ready" ? Date.now() : undefined;
    await ctx.db.patch(id, { ...patch, ...(completedAt ? { completedAt } : {}) });
  },
});

export const listExportJobs = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, { userId }) => {
    const jobs = await ctx.db
      .query("export_jobs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return jobs.sort((a, b) => b.createdAt - a.createdAt);
  },
});
