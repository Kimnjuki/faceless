import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import type { LearningPath, LearningModule, UserLearningProgress } from "@/types";

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
    order_index: m.orderIndex,
    created_at: m.createdAt != null ? new Date(m.createdAt).toISOString() : undefined,
    updated_at: m.updatedAt != null ? new Date(m.updatedAt).toISOString() : undefined,
    key_concepts: m.learningObjectives ?? m.keyConcepts,
  };
}

function toPath(p: any): LearningPath {
  return {
    ...p,
    id: p._id ?? p.id,
    track_type: p.trackType,
    estimated_duration: p.estimatedDuration,
    difficulty_level: p.difficultyLevel,
    order_index: p.orderIndex,
    created_at: p.createdAt != null ? new Date(p.createdAt).toISOString() : undefined,
    updated_at: p.updatedAt != null ? new Date(p.updatedAt).toISOString() : undefined,
    modules: (p.modules ?? []).map(toModule),
    levels: p.levels,
  };
}

export function useLearningPaths(filters: LearningPathFilters = {}) {
  const { user } = useAuth();
  const raw = useQuery(api.learningPaths.list, {
    trackType: filters.trackType && filters.trackType !== "all" ? filters.trackType : undefined,
    difficultyLevel: filters.difficulty && filters.difficulty !== "all" ? filters.difficulty : undefined,
  });

  const paths: LearningPath[] = useMemo(() => {
    let list = (raw ?? []).map(toPath);
    if (filters.featured) list = list.filter((p) => (p as LearningPath & { featured?: boolean }).featured);
    return list;
  }, [raw, filters.featured]);

  const loading = raw === undefined;
  const error: string | null = null;

  const updateProgress = async (
    _moduleId: string,
    _progress: Partial<UserLearningProgress>
  ): Promise<void> => {
    if (!user) return;
    // TODO: Convex mutation for user_learning_progress when needed
  };

  return { paths, loading, error, refetch: () => {}, updateProgress };
}
