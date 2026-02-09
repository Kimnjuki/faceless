import { useMemo, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "@/lib/convex-ids";
import type { PlatformGuide } from "@/types";

interface PlatformGuideFilters {
  platform?: string;
  category?: string;
  difficulty?: string;
  searchQuery?: string;
}

function toGuide(g: any): PlatformGuide {
  return {
    ...g,
    id: g._id ?? g.id,
    author_id: g.authorId,
    featured_image: g.featuredImage,
    read_time: g.readTime,
    view_count: g.viewCount,
    published_at: g.publishedAt,
    tool_tags: g.toolTags,
    example_applications: g.exampleApplications,
    created_at: g.createdAt != null ? new Date(g.createdAt).toISOString() : undefined,
    updated_at: g.updatedAt != null ? new Date(g.updatedAt).toISOString() : undefined,
  };
}

export function usePlatformGuides(filters: PlatformGuideFilters = {}) {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Convex is configured
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const raw = useQuery(
    api.platformGuides.list,
    hasConvex ? {
      platform: filters.platform && filters.platform !== "all" ? filters.platform : undefined,
      category: filters.category && filters.category !== "all" ? filters.category : undefined,
      difficultyLevel: filters.difficulty && filters.difficulty !== "all" ? filters.difficulty : undefined,
    } : "skip"
  );

  const incrementViews = useMutation(api.platformGuides.incrementViews);

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

  const guides: PlatformGuide[] = useMemo(() => {
    if (!hasConvex || raw === undefined) return [];
    try {
      let list = (raw ?? []).map(toGuide);
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          (g) =>
            (g.title ?? "").toLowerCase().includes(q) ||
            (g.excerpt ?? "").toLowerCase().includes(q) ||
            (g.content ?? "").toLowerCase().includes(q)
        );
      }
      return list;
    } catch (error) {
      console.error("Error processing platform guides:", error);
      return [];
    }
  }, [raw, filters.searchQuery, hasConvex]);

  const loading = hasConvex && raw === undefined;
  const error = connectionError || (hasConvex && raw === null ? "Failed to load platform guides" : null);

  const incrementViewCount = async (guideId: string) => {
    if (!hasConvex) return;
    try {
      await incrementViews({ guideId: guideId as Id<"platform_guides"> });
    } catch (e) {
      console.warn("Could not increment view count:", e);
    }
  };

  const refetch = () => {
    setRetryCount(0);
    setConnectionError(null);
    // Convex queries automatically refetch, but we can trigger a re-render
    window.location.reload();
  };

  return { guides, loading, error, refetch, incrementViewCount };
}
