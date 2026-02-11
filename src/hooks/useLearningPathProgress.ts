import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Id } from "../../convex/_generated/dataModel";

export function useLearningPathProgress(pathId: Id<"learning_paths"> | null) {
  const { user } = useAuth();
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const userId = user?.id;

  const progress = useQuery(
    api.learningPaths.getUserPathProgress,
    hasConvex && userId && pathId ? { userId, pathId } : "skip"
  );

  const enrollMutation = useMutation(api.learningPaths.enrollInPath);

  const loading = hasConvex && userId && pathId && progress === undefined;

  const enroll = async () => {
    if (!hasConvex || !userId || !pathId) {
      console.warn("Cannot enroll: Convex not configured or user not logged in");
      return;
    }

    try {
      await enrollMutation({ userId, pathId });
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
