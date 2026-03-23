import { useMemo, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "@/lib/convex-ids";
import type { Template } from "@/types";
import { TEMPLATES_LIBRARY_FALLBACK } from "@/config/templatesLibrary/templatesLibraryFallback";

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
    slug: t.slug,
    content: t.content,
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

  // Handle connection errors (static fallback still works without Convex)
  useEffect(() => {
    if (!hasConvex) {
      setConnectionError(null);
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
    const mergeWithFallback = (convexList: Template[]): Template[] => {
      const byKey = new Map<string, Template>();
      TEMPLATES_LIBRARY_FALLBACK.forEach((fb) => {
        byKey.set(fb.slug, { ...fb, download_url: fb.download_url ?? fb.downloadUrl });
      });
      convexList.forEach((t) => {
        const mapped = toTemplate(t);
        const slug = (mapped as Template & { slug?: string }).slug;
        if (slug && byKey.has(slug)) {
          const base = byKey.get(slug)!;
          byKey.set(slug, {
            ...base,
            ...mapped,
            content: mapped.content ?? base.content,
            id: mapped.id ?? base.id,
          });
        } else {
          const key = String(mapped.id ?? mapped._id ?? "");
          if (key) byKey.set(key, mapped);
        }
      });
      return Array.from(byKey.values());
    };

    const filterClient = (list: Template[]): Template[] => {
      let result = list;
      if (filters.platform && filters.platform !== "all") {
        result = result.filter((t) => t.platform === filters.platform);
      }
      if (filters.type && filters.type !== "all") {
        result = result.filter((t) => t.type === filters.type);
      }
      if (filters.niche && filters.niche !== "all") {
        result = result.filter((t) => t.niche === filters.niche);
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        result = result.filter(
          (t) =>
            (t.title ?? "").toLowerCase().includes(q) ||
            (t.description ?? "").toLowerCase().includes(q) ||
            (t.tags ?? []).some((tag: string) => tag.toLowerCase().includes(q)) ||
            (t.content ?? "").toLowerCase().includes(q)
        );
      }
      return result;
    };

    if (!hasConvex || raw === undefined) {
      return filterClient(
        TEMPLATES_LIBRARY_FALLBACK.map((fb) => ({
          ...fb,
          download_url: fb.download_url ?? fb.downloadUrl,
        })) as Template[]
      );
    }
    try {
      const list = mergeWithFallback((raw ?? []).map(toTemplate));
      return filterClient(list);
    } catch (error) {
      console.error("Error processing templates:", error);
      return filterClient(TEMPLATES_LIBRARY_FALLBACK.map((fb) => ({ ...fb })) as Template[]);
    }
  }, [raw, filters.searchQuery, filters.platform, filters.type, filters.niche, hasConvex]);

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
