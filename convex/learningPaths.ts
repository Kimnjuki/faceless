import { query } from "./_generated/server";
import { v } from "convex/values";

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
