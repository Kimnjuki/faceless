import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Niche } from "@/types";

interface NicheFilters {
  category?: string;
  difficulty?: string;
  searchQuery?: string;
  sortBy?: "profitability" | "difficulty";
}

function toNiche(n: any): Niche {
  return {
    ...n,
    id: n._id ?? n.id,
    niche_name: n.nicheName,
    category_id: n.categoryId,
    created_at: n.createdAt != null ? new Date(n.createdAt).toISOString() : undefined,
    updated_at: n.updatedAt != null ? new Date(n.updatedAt).toISOString() : undefined,
  };
}

export function useNiches(filters: NicheFilters = {}) {
  const raw = useQuery(api.niches.list, {
    categoryName: filters.category && filters.category !== "all" ? filters.category : undefined,
    difficultyLevel: filters.difficulty && filters.difficulty !== "all" ? filters.difficulty : undefined,
    sortBy: filters.sortBy,
  });

  const niches: Niche[] = useMemo(() => (raw ?? []).map(toNiche), [raw]);
  const loading = raw === undefined;
  const error: string | null = null;

  return { niches, loading, error, refetch: () => {} };
}
