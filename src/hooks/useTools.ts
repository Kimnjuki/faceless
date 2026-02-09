import { useMemo, useEffect, useState } from "react";
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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Convex is configured
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const toolsRaw = useQuery(
    api.tools.list,
    hasConvex ? {
      categoryName: filters.category && filters.category !== "all" ? filters.category : undefined,
    } : "skip"
  );

  // Handle connection errors
  useEffect(() => {
    if (!hasConvex) {
      setConnectionError("Convex backend not configured. Set VITE_CONVEX_URL environment variable.");
      return;
    }

    // Reset error on successful connection
    if (toolsRaw !== undefined) {
      setConnectionError(null);
      setRetryCount(0);
    }

    // Detect if query is stuck in loading state (potential connection issue)
    if (toolsRaw === undefined && retryCount < 3) {
      const timeout = setTimeout(() => {
        if (toolsRaw === undefined) {
          setRetryCount(prev => prev + 1);
          setConnectionError("Connection timeout. Please check your internet connection and try again.");
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [toolsRaw, hasConvex, retryCount]);

  const tools: Tool[] = useMemo(() => {
    if (!hasConvex || toolsRaw === undefined) return [];
    try {
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
    } catch (error) {
      console.error("Error processing tools:", error);
      return [];
    }
  }, [toolsRaw, filters.searchQuery, filters.sortBy, hasConvex]);

  const loading = hasConvex && toolsRaw === undefined;
  const error = connectionError || (hasConvex && toolsRaw === null ? "Failed to load tools" : null);

  const trackClick = async (_toolId: string) => {
    // Optional: track in Convex later
  };

  const refetch = () => {
    setRetryCount(0);
    setConnectionError(null);
    // Convex queries automatically refetch, but we can trigger a re-render
    window.location.reload();
  };

  return { tools, loading, error, refetch, trackClick };
}
