import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

/**
 * List learning paths with modules.
 */
export const list = query({
  args: {
    trackType: v.optional(v.string()),
    difficultyLevel: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { trackType, difficultyLevel, limit }) => {
    let paths = await ctx.db.query("learning_paths").collect();
    if (trackType && trackType !== "all")
      paths = paths.filter((p) => p.trackType === trackType);
    if (difficultyLevel && difficultyLevel !== "all")
      paths = paths.filter((p) => p.difficultyLevel === difficultyLevel);
    paths.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    if (limit) paths = paths.slice(0, limit);
    const pathIds = paths.map((p) => p._id);
    const modulesByPath: Record<string, any[]> = {};
    for (const path of paths) {
      const modules = await ctx.db
        .query("learning_modules")
        .withIndex("by_learning_path", (q) => q.eq("learningPathId", path._id))
        .collect();
      modules.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      modulesByPath[path._id] = modules;
    }
    const levelModules = await ctx.db.query("learning_path_modules").collect();
    levelModules.sort((a, b) => a.levelOrder - b.levelOrder);
    return paths.map((path) => ({
      ...path,
      modules: modulesByPath[path._id] ?? [],
      levels:
        levelModules.length > 0
          ? levelModules.reduce((acc: any[], m) => {
              let level = acc.find((l) => l.level_order === m.levelOrder);
              if (!level) {
                level = { level_order: m.levelOrder, level_title: m.levelTitle, modules: [] };
                acc.push(level);
              }
              level.modules.push(m);
              return acc;
            }, [])
          : undefined,
    }));
  },
});

/**
 * Get single learning path by id.
 */
export const getById = query({
  args: { pathId: v.id("learning_paths") },
  handler: async (ctx, { pathId }) => {
    const path = await ctx.db.get(pathId);
    if (!path) return null;
    const modules = await ctx.db
      .query("learning_modules")
      .withIndex("by_learning_path", (q) => q.eq("learningPathId", pathId))
      .collect();
    modules.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    return { ...path, modules };
  },
});

/**
 * Get user's progress for a specific learning path.
 */
export const getUserPathProgress = query({
  args: { userId: v.string(), pathId: v.id("learning_paths") },
  handler: async (ctx, { userId, pathId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    // Get user's learning progress for this path
    const progressRecords = await ctx.db
      .query("user_learning_progress")
      .withIndex("by_learning_path", (q) => q.eq("learningPathId", pathId))
      .collect();

    const userProgress = progressRecords.filter(
      (p) => p.userId === profile._id
    );

    // Get path modules
    const modules = await ctx.db
      .query("learning_modules")
      .withIndex("by_learning_path", (q) => q.eq("learningPathId", pathId))
      .collect();
    modules.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    // Calculate progress by module
    const moduleProgress = modules.map((module) => {
      const moduleProgressRecord = userProgress.find(
        (p) => p.moduleId === module._id
      );
      return {
        moduleId: module._id,
        title: module.title,
        completed: moduleProgressRecord?.completed ?? false,
        progressPercentage: moduleProgressRecord?.progressPercentage ?? 0,
        lastAccessed: moduleProgressRecord?.lastAccessed ?? null,
        timeSpent: moduleProgressRecord?.timeSpent ?? 0,
      };
    });

    const completedModules = moduleProgress.filter((m) => m.completed).length;
    const overallProgress =
      modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

    return {
      pathId,
      overallProgress: Math.round(overallProgress),
      totalModules: modules.length,
      completedModules,
      modules: moduleProgress,
      lastAccessed:
        userProgress.length > 0
          ? Math.max(...userProgress.map((p) => p.lastAccessed))
          : null,
      totalTimeSpent: userProgress.reduce(
        (sum, p) => sum + (p.timeSpent ?? 0),
        0
      ),
    };
  },
});

/**
 * Enroll user in a learning path (create initial progress record).
 */
export const enrollInPath = mutation({
  args: { userId: v.string(), pathId: v.id("learning_paths") },
  handler: async (ctx, { userId, pathId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    // Check if already enrolled
    const existing = await ctx.db
      .query("user_learning_progress")
      .withIndex("by_learning_path", (q) => q.eq("learningPathId", pathId))
      .filter((q) => q.eq(q.field("userId"), profile._id))
      .first();

    if (existing) {
      return existing._id; // Already enrolled
    }

    // Get first module to start with
    const firstModule = await ctx.db
      .query("learning_modules")
      .withIndex("by_learning_path", (q) => q.eq("learningPathId", pathId))
      .filter((q) => q.eq(q.field("orderIndex"), 0))
      .first();

    const now = Date.now();

    // Create initial progress record
    return await ctx.db.insert("user_learning_progress", {
      userId: profile._id,
      learningPathId: pathId,
      moduleId: firstModule?._id,
      completed: false,
      progressPercentage: 0,
      lastAccessed: now,
      timeSpent: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Get recommended learning paths based on user's profile (niche, skill level).
 */
export const getRecommendedPaths = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit = 5 }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return [];

    // Get all paths
    let paths = await ctx.db.query("learning_paths").collect();

    // Filter by user's skill level if available
    if (profile.skillLevel) {
      const skillLevelMap: Record<string, string[]> = {
        beginner: ["beginner"],
        intermediate: ["beginner", "intermediate"],
        advanced: ["beginner", "intermediate", "advanced"],
        expert: ["beginner", "intermediate", "advanced"],
      };

      const allowedLevels = skillLevelMap[profile.skillLevel] || [];
      paths = paths.filter(
        (p) => !p.difficultyLevel || allowedLevels.includes(p.difficultyLevel)
      );
    }

    // Sort by orderIndex (recommended order)
    paths.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    // Limit results
    if (limit) {
      paths = paths.slice(0, limit);
    }

    // Get modules for each path
    const pathsWithModules = await Promise.all(
      paths.map(async (path) => {
        const modules = await ctx.db
          .query("learning_modules")
          .withIndex("by_learning_path", (q) => q.eq("learningPathId", path._id))
          .collect();
        modules.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        return { ...path, modules };
      })
    );

    return pathsWithModules;
  },
});
