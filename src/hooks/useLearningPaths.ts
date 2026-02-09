import { useMemo, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import type { LearningPath, LearningModule, UserLearningProgress } from "@/types/index";

interface LearningPathFilters {
  trackType?: string;
  difficulty?: string;
  featured?: boolean;
}

function toModule(m: any): LearningModule {
  return {
    ...m,
    id: m._id ?? m.id,
    learning_path_id: m.learningPathId,
    content_type: m.contentType,
    duration_minutes: m.durationMinutes,
    order_index: m.orderIndex ?? m.order_index,
    created_at: m.createdAt != null ? new Date(m.createdAt).toISOString() : undefined,
    updated_at: m.updatedAt != null ? new Date(m.updatedAt).toISOString() : undefined,
    key_concepts: m.learningObjectives ?? m.keyConcepts,
  };
}

function toPath(p: any): LearningPath {
  return {
    ...p,
    id: p._id ?? p.id,
    track_type: p.trackType ?? p.track_type,
    estimated_duration: p.estimatedDuration ?? p.estimated_duration,
    difficulty_level: p.difficultyLevel ?? p.difficulty_level,
    order_index: p.orderIndex ?? p.order_index,
    created_at: p.createdAt != null ? new Date(p.createdAt).toISOString() : undefined,
    updated_at: p.updatedAt != null ? new Date(p.updatedAt).toISOString() : undefined,
    modules: (p.modules ?? []).map(toModule),
    levels: p.levels,
  };
}

export function useLearningPaths(filters: LearningPathFilters = {}) {
  const { user } = useAuth();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Convex is configured
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const raw = useQuery(
    api.learningPaths.list,
    hasConvex ? {
      trackType: filters.trackType && filters.trackType !== "all" ? filters.trackType : undefined,
      difficultyLevel: filters.difficulty && filters.difficulty !== "all" ? filters.difficulty : undefined,
    } : "skip"
  );

  // Handle connection errors
  useEffect(() => {
    if (!hasConvex) {
      setConnectionError("Convex backend not configured. Set VITE_CONVEX_URL environment variable.");
      return;
    }

    // Reset error on successful connection
    if (raw !== undefined) {
      setConnectionError(null);
      setRetryCount(0);
    }

    // Detect if query is stuck in loading state (potential connection issue)
    if (raw === undefined && retryCount < 3) {
      const timeout = setTimeout(() => {
        if (raw === undefined) {
          setRetryCount(prev => prev + 1);
          setConnectionError("Connection timeout. Please check your internet connection and try again.");
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [raw, hasConvex, retryCount]);

  const paths: LearningPath[] = useMemo(() => {
    if (!hasConvex || raw === undefined) return [];
    try {
      let list = (raw ?? []).map(toPath);
      if (filters.featured) list = list.filter((p) => (p as LearningPath & { featured?: boolean }).featured);
      return list;
    } catch (error) {
      console.error("Error processing learning paths:", error);
      return [];
    }
  }, [raw, filters.featured, hasConvex]);

  const loading = hasConvex && raw === undefined;
  const error = connectionError || (hasConvex && raw === null ? "Failed to load learning paths" : null);

  const updateProgress = async (
    _moduleId: string,
    _progress: Partial<UserLearningProgress>
  ): Promise<void> => {
    if (!user || !hasConvex) return;
    // TODO: Convex mutation for user_learning_progress when needed
  };

  const refetch = () => {
    setRetryCount(0);
    setConnectionError(null);
    // Convex queries automatically refetch, but we can trigger a re-render
    window.location.reload();
  };

  return { paths, loading, error, refetch, updateProgress };
}
