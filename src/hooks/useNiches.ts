import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Niche } from "@/types";
import {
  ALL_FALLBACK_NICHES,
  fallbackToListNiche,
} from "@/config/niches/nicheDatabaseFallback";

/**
 * Public Niche Database always uses the bundled slug-based dataset so:
 * - "View Details" links are SEO-friendly (/niches/your-slug), not opaque Convex IDs
 * - The 20+ flagship niches stay consistent with long-form guides and categories
 * Convex can still be used elsewhere; list view is the canonical bundled DB.
 */
const USE_PUBLIC_NICHE_LIST_FROM_BUNDLE = true;

interface NicheFilters {
  category?: string;
  difficulty?: string;
  searchQuery?: string;
  sortBy?: "profitability" | "difficulty";
}

function toNiche(n: Record<string, unknown>): Niche {
  const o = n as {
    _id?: string;
    id?: string;
    nicheName?: string;
    category?: { name?: string };
    profitabilityScore?: number;
    difficultyLevel?: string;
    trendStatus?: string;
    estimatedEarningsRange?: string;
    avgRpm?: number;
    startupCost?: string;
    competitionLevel?: string;
    bestAiTools?: string[];
    description?: string;
  };
  const cat = o.category?.name
    ? ({ name: o.category.name } as import("@/types").NicheCategory)
    : undefined;
  return {
    ...n,
    id: o._id ?? o.id,
    niche_name: o.nicheName,
    category_id: undefined,
    category: cat,
    profitability_score: o.profitabilityScore,
    difficulty_level: o.difficultyLevel,
    trend_status: o.trendStatus,
    estimated_earnings_range: o.estimatedEarningsRange,
    avg_rpm: o.avgRpm,
    startup_cost: o.startupCost,
    competition_level: o.competitionLevel,
    best_ai_tools: o.bestAiTools,
    description: o.description,
  };
}

function categoryNameOf(n: Niche): string {
  const c = n.category;
  if (typeof c === "string") return c;
  return c?.name ?? "";
}

function difficultyRank(level: string | undefined): number {
  const l = (level ?? "").toLowerCase();
  if (l === "easy") return 1;
  if (l === "medium") return 2;
  if (l === "hard") return 3;
  return 0;
}

export function useNiches(filters: NicheFilters = {}) {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const raw = useQuery(
    api.niches.list,
    hasConvex && !USE_PUBLIC_NICHE_LIST_FROM_BUNDLE ? { sortBy: "profitability" } : "skip"
  );

  const loading =
    hasConvex && !USE_PUBLIC_NICHE_LIST_FROM_BUNDLE && raw === undefined;

  const sourceList: Niche[] = useMemo(() => {
    if (USE_PUBLIC_NICHE_LIST_FROM_BUNDLE) {
      return ALL_FALLBACK_NICHES.map(fallbackToListNiche);
    }
    if (!hasConvex || !raw?.length) {
      return ALL_FALLBACK_NICHES.map(fallbackToListNiche);
    }
    return raw.map((row) => toNiche(row as unknown as Record<string, unknown>));
  }, [hasConvex, raw]);

  const niches = useMemo(() => {
    let list = [...sourceList];

    const q = filters.searchQuery?.trim().toLowerCase();
    if (q) {
      list = list.filter((n) => {
        const name = (n.niche_name ?? "").toLowerCase();
        const desc = (n.description ?? "").toLowerCase();
        const cat = categoryNameOf(n).toLowerCase();
        const tools = (n.best_ai_tools ?? []).join(" ").toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q) || tools.includes(q);
      });
    }

    if (filters.category && filters.category !== "all") {
      list = list.filter((n) => categoryNameOf(n) === filters.category);
    }

    if (filters.difficulty && filters.difficulty !== "all") {
      list = list.filter(
        (n) => (n.difficulty_level ?? "").toLowerCase() === filters.difficulty
      );
    }

    if (filters.sortBy === "profitability") {
      list.sort(
        (a, b) => (b.profitability_score ?? 0) - (a.profitability_score ?? 0)
      );
    } else {
      list.sort(
        (a, b) =>
          difficultyRank(a.difficulty_level) - difficultyRank(b.difficulty_level)
      );
    }

    return list;
  }, [sourceList, filters.searchQuery, filters.category, filters.difficulty, filters.sortBy]);

  return {
    niches,
    loading,
    error: null as string | null,
    refetch: () => {},
    totalCount: ALL_FALLBACK_NICHES.length,
    usingFallback: USE_PUBLIC_NICHE_LIST_FROM_BUNDLE || !hasConvex || !raw?.length,
  };
}
