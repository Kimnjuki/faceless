import { useMemo, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "@/lib/convex-ids";
import type { Template } from "@/types";

interface TemplateFilters {
  platform?: string;
  niche?: string;
  type?: string;
  searchQuery?: string;
}

function toTemplate(t: any): Template {
  return {
    ...t,
    id: t._id ?? t.id,
    download_url: t.downloadUrl,
    download_count: t.downloadCount ?? 0,
    rating_count: t.ratingCount ?? 0,
    created_at: t.createdAt != null ? new Date(t.createdAt).toISOString() : undefined,
    updated_at: t.updatedAt != null ? new Date(t.updatedAt).toISOString() : undefined,
  };
}

export function useTemplates(filters: TemplateFilters = {}) {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Convex is configured
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const raw = useQuery(
    api.templates.list,
    hasConvex ? {
      platform: filters.platform && filters.platform !== "all" ? filters.platform : undefined,
      niche: filters.niche && filters.niche !== "all" ? filters.niche : undefined,
      type: filters.type && filters.type !== "all" ? filters.type : undefined,
    } : "skip"
  );

  const incrementDownload = useMutation(api.templates.incrementDownload);

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

  const templates: Template[] = useMemo(() => {
    if (!hasConvex || raw === undefined) return [];
    try {
      let list = (raw ?? []).map(toTemplate);
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          (t) =>
            (t.title ?? "").toLowerCase().includes(q) ||
            (t.description ?? "").toLowerCase().includes(q) ||
            (t.tags ?? []).some((tag: string) => tag.toLowerCase().includes(q))
        );
      }
      return list;
    } catch (error) {
      console.error("Error processing templates:", error);
      return [];
    }
  }, [raw, filters.searchQuery, hasConvex]);

  const loading = hasConvex && raw === undefined;
  const error = connectionError || (hasConvex && raw === null ? "Failed to load templates" : null);

  const handleIncrementDownload = async (templateId: string) => {
    if (!hasConvex) return;
    try {
      await incrementDownload({ templateId: templateId as Id<"templates"> });
    } catch (e) {
      console.warn("Could not increment download:", e);
    }
  };

  const refetch = () => {
    setRetryCount(0);
    setConnectionError(null);
    // Convex queries automatically refetch, but we can trigger a re-render
    window.location.reload();
  };

  return {
    templates,
    loading,
    error,
    refetch,
    incrementDownload: handleIncrementDownload,
  };
}
