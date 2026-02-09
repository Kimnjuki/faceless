import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Tool } from "@/types";

interface ToolFilters {
  category?: string;
  searchQuery?: string;
  sortBy?: "rating" | "name" | "created_at";
}

function toTool(t: any): Tool {
  return {
    ...t,
    id: t._id ?? t.id,
    category_id: t.categoryId,
    category: t.category ?? null,
    best_for: t.bestFor,
    rating_count: t.ratingCount,
    affiliate_url: t.affiliate_url ?? t.affiliate_link?.destination_url ?? null,
  };
}

export function useTools(filters: ToolFilters = {}) {
  const toolsRaw = useQuery(api.tools.list, {
    categoryName: filters.category && filters.category !== "all" ? filters.category : undefined,
  });

  const tools: Tool[] = useMemo(() => {
    let list = (toolsRaw ?? []).map(toTool);
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          (t.name ?? "").toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q) ||
          (t.category?.name ?? "").toLowerCase().includes(q) ||
          (t.bestFor ?? t.best_for ?? "").toLowerCase().includes(q)
      );
    }
    if (filters.sortBy === "rating") {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (filters.sortBy === "name") {
      list = [...list].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    } else {
      list = [...list].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    }
    return list;
  }, [toolsRaw, filters.searchQuery, filters.sortBy]);

  const loading = toolsRaw === undefined;
  const error: string | null = null;

  const trackClick = async (_toolId: string) => {
    // Optional: track in Convex later
  };

  return { tools, loading, error, refetch: () => {}, trackClick };
}
