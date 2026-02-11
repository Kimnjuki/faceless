import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

/**
 * Get user's enrolled courses with progress.
 * Returns courses the user has progress records for or active subscriptions to.
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
    const courseIds = [...new Set(progressRecords.map((p) => p.courseId).filter(Boolean))];

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
        return course;
      })
    );

    const allCourseIds = [
      ...courseIds,
      ...coursesFromProducts.map((c) => c?._id).filter(Boolean),
    ];

    // Get unique courses
    const uniqueCourseIds = [...new Set(allCourseIds)];

    // Fetch full course data with product info
    const courses = await Promise.all(
      uniqueCourseIds.map(async (courseId) => {
        const course = await ctx.db.get(courseId as any);
        if (!course) return null;

        // Get product info - course is typed as any, so we need to access productId safely
        const courseWithProduct = course as any;
        const product = courseWithProduct.productId
          ? await ctx.db.get(courseWithProduct.productId)
          : null;

        // Get progress for this course
        const courseProgress = progressRecords.find(
          (p) => p.courseId === courseId
        );

        // Get modules and lessons
        const modules = await ctx.db
          .query("course_modules")
          .withIndex("by_course", (q) => q.eq("courseId", courseId))
          .collect();

        const totalLessons = await Promise.all(
          modules.map(async (module) => {
            const lessons = await ctx.db
              .query("course_lessons")
              .withIndex("by_module", (q) => q.eq("moduleId", module._id))
              .collect();
            return lessons.length;
          })
        );

        const completedLessons = progressRecords.filter(
          (p) => p.courseId === courseId && p.completed
        ).length;

        const progressPercentage = courseProgress?.progressPercentage ?? 0;

        return {
          ...course,
          product,
          progress: courseProgress,
          progressPercentage,
          totalModules: modules.length,
          totalLessons: totalLessons.reduce((a, b) => a + b, 0),
          completedLessons,
          lastAccessed: courseProgress?.lastAccessed ?? course._creationTime,
        };
      })
    );

    return courses.filter(Boolean);
  },
});

/**
 * Get user's overall learning progress statistics.
 */
export const getUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return {
        enrolledCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalLessonsCompleted: 0,
        averageProgress: 0,
        totalTimeSpent: 0,
      };
    }

    // Get all progress records
    const progressRecords = await ctx.db
      .query("student_progress")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .collect();

    // Get unique courses
    const courseIds = [...new Set(progressRecords.map((p) => p.courseId).filter(Boolean))];
    const enrolledCourses = courseIds.length;

    // Calculate completion stats
    const courseProgressMap = new Map();
    progressRecords.forEach((p) => {
      if (!p.courseId) return;
      const existing = courseProgressMap.get(p.courseId) || {
        total: 0,
        completed: 0,
        progressPercentage: 0,
      };
      existing.total++;
      if (p.completed) existing.completed++;
      if (p.progressPercentage) {
        existing.progressPercentage = Math.max(
          existing.progressPercentage,
          p.progressPercentage
        );
      }
      courseProgressMap.set(p.courseId, existing);
    });

    const completedCourses = Array.from(courseProgressMap.values()).filter(
      (c) => c.progressPercentage >= 100
    ).length;

    const inProgressCourses = enrolledCourses - completedCourses;
    const totalLessonsCompleted = progressRecords.filter((p) => p.completed).length;

    const progressValues = Array.from(courseProgressMap.values()).map(
      (c) => c.progressPercentage
    );
    const averageProgress =
      progressValues.length > 0
        ? progressValues.reduce((a, b) => a + b, 0) / progressValues.length
        : 0;

    const totalTimeSpent = progressRecords.reduce(
      (sum, p) => sum + (p.timeSpent ?? 0),
      0
    );

    return {
      enrolledCourses,
      completedCourses,
      inProgressCourses,
      totalLessonsCompleted,
      averageProgress: Math.round(averageProgress),
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
    };
  },
});

/**
 * Get user's recent community activity (forum posts and replies).
 */
export const getCommunityActivity = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit = 5 }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return [];

    // Get user's forum posts
    const posts = await ctx.db
      .query("forum_posts")
      .withIndex("by_author", (q) => q.eq("authorId", profile._id))
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .take(limit);

    // Get user's replies
    const replies = await ctx.db
      .query("post_replies")
      .withIndex("by_author", (q) => q.eq("authorId", profile._id))
      .order("desc")
      .take(limit);

    // Combine and sort by date
    const activities = [
      ...posts.map((p) => ({
        type: "post" as const,
        id: p._id,
        title: p.title,
        createdAt: p.createdAt,
        categoryId: p.categoryId,
      })),
      ...replies.map((r) => ({
        type: "reply" as const,
        id: r._id,
        title: `Replied to post`,
        createdAt: r.createdAt,
        postId: r.postId,
      })),
    ]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    return activities;
  },
});

/**
 * Get user's active subscriptions.
 */
export const getUserSubscriptions = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return [];

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Enrich with product info
    const enriched = await Promise.all(
      subscriptions.map(async (sub) => {
        const product = sub.productId ? await ctx.db.get(sub.productId) : null;
        return {
          ...sub,
          product,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get dashboard summary statistics for a user.
 */
export const getDashboardStats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return {
        coursesEnrolled: 0,
        completionRate: 0,
        communityPosts: 0,
        achievements: 0,
      };
    }

    // Get courses enrolled
    const progressRecords = await ctx.db
      .query("student_progress")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .collect();

    const courseIds = [...new Set(progressRecords.map((p) => p.courseId).filter(Boolean))];
    const coursesEnrolled = courseIds.length;

    // Calculate completion rate
    const courseProgressMap = new Map();
    progressRecords.forEach((p) => {
      if (!p.courseId) return;
      const existing = courseProgressMap.get(p.courseId) || { progressPercentage: 0 };
      if (p.progressPercentage) {
        existing.progressPercentage = Math.max(
          existing.progressPercentage,
          p.progressPercentage
        );
      }
      courseProgressMap.set(p.courseId, existing);
    });

    const completedCourses = Array.from(courseProgressMap.values()).filter(
      (c) => c.progressPercentage >= 100
    ).length;

    const completionRate =
      coursesEnrolled > 0 ? Math.round((completedCourses / coursesEnrolled) * 100) : 0;

    // Get community posts count
    const posts = await ctx.db
      .query("forum_posts")
      .withIndex("by_author", (q) => q.eq("authorId", profile._id))
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    const replies = await ctx.db
      .query("post_replies")
      .withIndex("by_author", (q) => q.eq("authorId", profile._id))
      .collect();

    const communityPosts = posts.length + replies.length;

    // Achievements (placeholder - can be enhanced with actual achievement system)
    const achievements = 0;

    return {
      coursesEnrolled,
      completionRate,
      communityPosts,
      achievements,
    };
  },
});
