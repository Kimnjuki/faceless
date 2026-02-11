import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

/**
 * Get course by ID with full details (modules, lessons, product info).
 */
export const getCourseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const course = await ctx.db.get(courseId);
    if (!course) return null;

    // Get product info
    const product = course.productId ? await ctx.db.get(course.productId) : null;

    // Get instructor info
    const instructor = course.instructorId ? await ctx.db.get(course.instructorId) : null;

    // Get modules
    const modules = await ctx.db
      .query("course_modules")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();

    // Sort modules by sortOrder
    modules.sort((a, b) => a.sortOrder - b.sortOrder);

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await ctx.db
          .query("course_lessons")
          .withIndex("by_module", (q) => q.eq("moduleId", module._id))
          .collect();

        // Sort lessons by sortOrder
        lessons.sort((a, b) => a.sortOrder - b.sortOrder);

        return {
          ...module,
          lessons,
        };
      })
    );

    // Get digital assets (downloadable resources)
    const digitalAssets = course.productId
      ? await ctx.db
          .query("digital_assets")
          .withIndex("by_product", (q) => q.eq("productId", course.productId!))
          .collect()
      : [];

    return {
      ...course,
      product,
      instructor: instructor
        ? {
            id: instructor._id,
            name: instructor.fullName,
            bio: instructor.bio,
            avatarUrl: instructor.avatarUrl,
          }
        : null,
      modules: modulesWithLessons,
      digitalAssets,
    };
  },
});

/**
 * Get course by product ID (for linking products to courses).
 */
export const getCourseByProductId = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const course = await ctx.db
      .query("courses")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .first();

    if (!course) return null;

    // Get full course details inline (can't call other queries)
    const product = await ctx.db.get(productId);
    const instructor = course.instructorId ? await ctx.db.get(course.instructorId) : null;

    const modules = await ctx.db
      .query("course_modules")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect();
    modules.sort((a, b) => a.sortOrder - b.sortOrder);

    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await ctx.db
          .query("course_lessons")
          .withIndex("by_module", (q) => q.eq("moduleId", module._id))
          .collect();
        lessons.sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...module, lessons };
      })
    );

    const digitalAssets = await ctx.db
      .query("digital_assets")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .collect();

    return {
      ...course,
      product,
      instructor: instructor
        ? {
            id: instructor._id,
            name: instructor.fullName,
            bio: instructor.bio,
            avatarUrl: instructor.avatarUrl,
          }
        : null,
      modules: modulesWithLessons,
      digitalAssets,
    };
  },
});

/**
 * Get user's enrolled courses with progress.
 */
export const getUserCourses = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get user's profile ID
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return [];

    // Get user's progress records
    const progressRecords = await ctx.db
      .query("student_progress")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .collect();

    // Get unique course IDs from progress
    const courseIds = [
      ...new Set(progressRecords.map((p) => p.courseId).filter(Boolean)),
    ] as Id<"courses">[];

    // Also get courses from active subscriptions
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const productIds = subscriptions
      .map((s) => s.productId)
      .filter(Boolean) as Id<"products">[];

    // Get courses linked to subscribed products
    const coursesFromProducts = await Promise.all(
      productIds.map(async (productId) => {
        const course = await ctx.db
          .query("courses")
          .withIndex("by_product", (q) => q.eq("productId", productId))
          .first();
        return course?._id;
      })
    );

    const allCourseIds = [
      ...courseIds,
      ...coursesFromProducts.filter(Boolean),
    ] as Id<"courses">[];

    // Get unique courses
    const uniqueCourseIds = [...new Set(allCourseIds)];

    // Fetch full course data with progress
    const courses = await Promise.all(
      uniqueCourseIds.map(async (courseId) => {
        const course = await ctx.db.get(courseId);
        if (!course) return null;

        const product = course.productId ? await ctx.db.get(course.productId) : null;
        const instructor = course.instructorId ? await ctx.db.get(course.instructorId) : null;

        const modules = await ctx.db
          .query("course_modules")
          .withIndex("by_course", (q) => q.eq("courseId", courseId))
          .collect();
        modules.sort((a, b) => a.sortOrder - b.sortOrder);

        const modulesWithLessons = await Promise.all(
          modules.map(async (module) => {
            const lessons = await ctx.db
              .query("course_lessons")
              .withIndex("by_module", (q) => q.eq("moduleId", module._id))
              .collect();
            lessons.sort((a, b) => a.sortOrder - b.sortOrder);
            return { ...module, lessons };
          })
        );

        const courseData = {
          ...course,
          product,
          instructor: instructor
            ? {
                id: instructor._id,
                name: instructor.fullName,
                bio: instructor.bio,
                avatarUrl: instructor.avatarUrl,
              }
            : null,
          modules: modulesWithLessons,
        };

        // Get progress for this course
        const courseProgress = progressRecords.find(
          (p) => p.courseId === courseId
        );

        // Calculate overall progress
        const totalLessons = courseData.modules.reduce(
          (sum: number, m: any) => sum + (m.lessons?.length || 0),
          0
        );
        const completedLessons = progressRecords.filter(
          (p) => p.courseId === courseId && p.completed
        ).length;

        const progressPercentage =
          totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return {
          ...courseData,
          progress: courseProgress,
          progressPercentage: Math.round(progressPercentage),
          totalLessons,
          completedLessons,
          lastAccessed: courseProgress?.lastAccessed ?? courseData.createdAt,
        };
      })
    );

    return courses.filter(Boolean);
  },
});

/**
 * Get course progress for a specific user and course.
 */
export const getCourseProgress = query({
  args: { userId: v.string(), courseId: v.id("courses") },
  handler: async (ctx, { userId, courseId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    // Get all progress records for this course
    const progressRecords = await ctx.db
      .query("student_progress")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .collect();

    const courseProgress = progressRecords.filter(
      (p) => p.courseId === courseId
    );

    // Get course structure
    const course = await ctx.db.get(courseId);
    if (!course) return null;

    const modules = await ctx.db
      .query("course_modules")
      .withIndex("by_course", (q) => q.eq("courseId", courseId))
      .collect();
    modules.sort((a, b) => a.sortOrder - b.sortOrder);

    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await ctx.db
          .query("course_lessons")
          .withIndex("by_module", (q) => q.eq("moduleId", module._id))
          .collect();
        lessons.sort((a, b) => a.sortOrder - b.sortOrder);
        return { ...module, lessons };
      })
    );

    const courseWithModules = {
      ...course,
      modules: modulesWithLessons,
    };

    // Calculate progress by module and lesson
    const moduleProgress = courseWithModules.modules.map((module: any) => {
      const moduleLessons = module.lessons || [];
      const completedLessons = moduleLessons.filter((lesson: any) =>
        courseProgress.some(
          (p) => p.lessonId === lesson._id && p.completed
        )
      ).length;

      const moduleProgressPercentage =
        moduleLessons.length > 0
          ? (completedLessons / moduleLessons.length) * 100
          : 0;

      const lessonProgress = moduleLessons.map((lesson: any) => {
        const lessonProgressRecord = courseProgress.find(
          (p) => p.lessonId === lesson._id
        );
        return {
          lessonId: lesson._id,
          completed: lessonProgressRecord?.completed ?? false,
          progressPercentage: lessonProgressRecord?.progressPercentage ?? 0,
          lastAccessed: lessonProgressRecord?.lastAccessed,
          timeSpent: lessonProgressRecord?.timeSpent ?? 0,
        };
      });

      return {
        moduleId: module._id,
        title: module.title,
        progressPercentage: Math.round(moduleProgressPercentage),
        completedLessons,
        totalLessons: moduleLessons.length,
        lessons: lessonProgress,
      };
    });

    const totalLessons = courseWithModules.modules.reduce(
      (sum: number, m: any) => sum + (m.lessons?.length || 0),
      0
    );
    const completedLessons = courseProgress.filter((p) => p.completed).length;
    const overallProgress =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      courseId,
      overallProgress: Math.round(overallProgress),
      totalLessons,
      completedLessons,
      modules: moduleProgress,
      lastAccessed:
        courseProgress.length > 0
          ? Math.max(...courseProgress.map((p) => p.lastAccessed))
          : null,
      totalTimeSpent: courseProgress.reduce(
        (sum, p) => sum + (p.timeSpent ?? 0),
        0
      ),
    };
  },
});

/**
 * Mark a lesson as complete and update progress.
 */
export const markLessonComplete = mutation({
  args: {
    userId: v.string(),
    courseId: v.id("courses"),
    lessonId: v.id("course_lessons"),
    completed: v.boolean(),
    progressPercentage: v.optional(v.number()),
    timeSpent: v.optional(v.number()),
  },
  handler: async (ctx, { userId, courseId, lessonId, completed, progressPercentage, timeSpent }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    // Find existing progress record
    const existing = await ctx.db
      .query("student_progress")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("courseId"), courseId),
          q.eq(q.field("lessonId"), lessonId)
        )
      )
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        completed,
        progressPercentage: progressPercentage ?? (completed ? 100 : existing.progressPercentage),
        lastAccessed: now,
        timeSpent: timeSpent ? (existing.timeSpent ?? 0) + timeSpent : existing.timeSpent,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new progress record
      return await ctx.db.insert("student_progress", {
        userId: profile._id,
        courseId,
        lessonId,
        completed,
        progressPercentage: progressPercentage ?? (completed ? 100 : 0),
        lastAccessed: now,
        timeSpent: timeSpent ?? 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Get course reviews/ratings (placeholder for future implementation).
 */
export const getCourseReviews = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    // TODO: Implement reviews system
    // For now, return empty array
    return [];
  },
});

/**
 * List all available courses (for catalog).
 */
export const listCourses = query({
  args: {
    limit: v.optional(v.number()),
    level: v.optional(v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    )),
  },
  handler: async (ctx, { limit, level }) => {
    let courses = await ctx.db.query("courses").collect();

    // Filter by level if provided
    if (level) {
      courses = courses.filter((c) => c.level === level);
    }

    // Sort by creation date (newest first)
    courses.sort((a, b) => b.createdAt - a.createdAt);

    // Limit results
    if (limit) {
      courses = courses.slice(0, limit);
    }

    // Enrich with product info
    const enriched = await Promise.all(
      courses.map(async (course) => {
        const product = course.productId ? await ctx.db.get(course.productId) : null;
        const instructor = course.instructorId ? await ctx.db.get(course.instructorId) : null;

        // Get module count
        const modules = await ctx.db
          .query("course_modules")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();

        return {
          ...course,
          product,
          instructor: instructor
            ? {
                id: instructor._id,
                name: instructor.fullName,
                avatarUrl: instructor.avatarUrl,
              }
            : null,
          moduleCount: modules.length,
        };
      })
    );

    return enriched;
  },
});
