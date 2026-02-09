import { useMemo } from "react";
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
  const raw = useQuery(api.platformGuides.list, {
    platform: filters.platform && filters.platform !== "all" ? filters.platform : undefined,
    category: filters.category && filters.category !== "all" ? filters.category : undefined,
    difficultyLevel: filters.difficulty && filters.difficulty !== "all" ? filters.difficulty : undefined,
  });

  const incrementViews = useMutation(api.platformGuides.incrementViews);

  const guides: PlatformGuide[] = useMemo(() => {
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
  }, [raw, filters.searchQuery]);

  const loading = raw === undefined;
  const error: string | null = null;

  const incrementViewCount = async (guideId: string) => {
    try {
      await incrementViews({ guideId: guideId as Id<"platform_guides"> });
    } catch (e) {
      console.warn("Could not increment view count:", e);
    }
  };

  return { guides, loading, error, refetch: () => {}, incrementViewCount };
}
