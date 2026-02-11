import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Id } from "../../convex/_generated/dataModel";

export function useCourses() {
  const { user } = useAuth();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const userId = user?.id;

  const courses = useQuery(
    api.courses.getUserCourses,
    hasConvex && userId ? { userId } : "skip"
  );

  const loading = hasConvex && userId && courses === undefined;

  return {
    courses: courses ?? [],
    loading,
  };
}

export function useCourse(courseId: Id<"courses"> | null) {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const course = useQuery(
    api.courses.getCourseById,
    hasConvex && courseId ? { courseId } : "skip"
  );

  const loading = hasConvex && courseId && course === undefined;

  return {
    course: course ?? null,
    loading,
  };
}

export function useCourseProgress(courseId: Id<"courses"> | null) {
  const { user } = useAuth();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const userId = user?.id;

  const progress = useQuery(
    api.courses.getCourseProgress,
    hasConvex && userId && courseId ? { userId, courseId } : "skip"
  );

  const markComplete = useMutation(api.courses.markLessonComplete);

  const loading = hasConvex && userId && courseId && progress === undefined;

  const completeLesson = async (
    lessonId: Id<"course_lessons">,
    completed: boolean = true,
    progressPercentage?: number,
    timeSpent?: number
  ) => {
    if (!hasConvex || !userId || !courseId) {
      console.warn("Cannot mark lesson complete: Convex not configured or user not logged in");
      return;
    }

    try {
      await markComplete({
        userId,
        courseId,
        lessonId,
        completed,
        progressPercentage,
        timeSpent,
      });
    } catch (error) {
      console.error("Failed to mark lesson complete:", error);
      throw error;
    }
  };

  return {
    progress: progress ?? null,
    loading,
    completeLesson,
  };
}
