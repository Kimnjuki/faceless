import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Id } from "../../convex/_generated/dataModel";
import { isLearningPathConvexId } from "./useLearningPaths";

export function useLearningPathProgress(pathId: Id<"learning_paths"> | string | null | undefined) {
  const { user } = useAuth();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const userId = user?.id;
  const validPathId =
    pathId && isLearningPathConvexId(String(pathId))
      ? (String(pathId) as Id<"learning_paths">)
      : null;

  const progress = useQuery(
    api.learningPaths.getUserPathProgress,
    hasConvex && userId && validPathId ? { userId, pathId: validPathId } : "skip"
  );

  const enrollMutation = useMutation(api.learningPaths.enrollInPath);

  const loading = hasConvex && userId && validPathId && progress === undefined;

  const enroll = async () => {
    if (!hasConvex || !userId || !validPathId) {
      console.warn("Cannot enroll: Convex not configured or user not logged in");
      return;
    }

    try {
      await enrollMutation({ userId, pathId: validPathId });
    } catch (error) {
      console.error("Failed to enroll in path:", error);
      throw error;
    }
  };

  return {
    progress: progress ?? null,
    loading,
    enroll,
  };
}
