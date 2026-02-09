import { useMemo } from "react";
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
  const raw = useQuery(api.templates.list, {
    platform: filters.platform && filters.platform !== "all" ? filters.platform : undefined,
    niche: filters.niche && filters.niche !== "all" ? filters.niche : undefined,
    type: filters.type && filters.type !== "all" ? filters.type : undefined,
  });

  const incrementDownload = useMutation(api.templates.incrementDownload);

  const templates: Template[] = useMemo(() => {
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
  }, [raw, filters.searchQuery]);

  const loading = raw === undefined;
  const error: string | null = null;

  const handleIncrementDownload = async (templateId: string) => {
    try {
      await incrementDownload({ templateId: templateId as Id<"templates"> });
    } catch (e) {
      console.warn("Could not increment download:", e);
    }
  };

  return {
    templates,
    loading,
    error,
    refetch: () => {},
    incrementDownload: handleIncrementDownload,
  };
}
