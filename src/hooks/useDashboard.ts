import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

export function useDashboard() {
  const { user } = useAuth();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const userId = user?.id;

  // Get dashboard stats
  const stats = useQuery(
    api.dashboard.getDashboardStats,
    hasConvex && userId ? { userId } : "skip"
  );

  // Get user courses
  const courses = useQuery(
    api.dashboard.getUserCourses,
    hasConvex && userId ? { userId } : "skip"
  );

  // Get user progress
  const progress = useQuery(
    api.dashboard.getUserProgress,
    hasConvex && userId ? { userId } : "skip"
  );

  // Get community activity
  const communityActivity = useQuery(
    api.dashboard.getCommunityActivity,
    hasConvex && userId ? { userId, limit: 5 } : "skip"
  );

  // Get subscriptions
  const subscriptions = useQuery(
    api.dashboard.getUserSubscriptions,
    hasConvex && userId ? { userId } : "skip"
  );

  const loading =
    hasConvex &&
    userId &&
    (stats === undefined ||
      courses === undefined ||
      progress === undefined ||
      communityActivity === undefined ||
      subscriptions === undefined);

  return {
    stats: stats ?? {
      coursesEnrolled: 0,
      completionRate: 0,
      communityPosts: 0,
      achievements: 0,
    },
    courses: courses ?? [],
    progress: progress ?? {
      enrolledCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalLessonsCompleted: 0,
      averageProgress: 0,
      totalTimeSpent: 0,
    },
    communityActivity: communityActivity ?? [],
    subscriptions: subscriptions ?? [],
    loading,
  };
}
