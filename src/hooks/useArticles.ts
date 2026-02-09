import { useMemo, useEffect, useState } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import type { Article, ContentCategory } from "@/types/index";

interface ArticleFilters {
  category?: string;
  searchQuery?: string;
  status?: "published" | "draft" | "archived";
  limit?: number;
  sortBy?: "publishedAt" | "viewCount" | "shareCount" | "title";
  usePagination?: boolean;
}

function toArticle(a: any): Article {
  return {
    ...a,
    id: a._id ?? a.id,
    category_id: a.categoryId,
    author_id: a.author?.id ?? a.authorId,
    featured_image: a.featuredImage,
    published_at: a.publishedAt != null ? new Date(a.publishedAt).toISOString() : undefined,
    created_at: a.createdAt != null ? new Date(a.createdAt).toISOString() : undefined,
    updated_at: a.updatedAt != null ? new Date(a.updatedAt).toISOString() : undefined,
    view_count: a.viewCount,
    read_time: a.readTime,
  };
}

function toContentCategory(c: any): ContentCategory {
  return {
    ...c,
    id: c._id ?? c.id,
  };
}

export function useArticles(filters: ArticleFilters = {}) {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Convex is configured
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const categoriesRaw = useQuery(
    api.contentCategories.list,
    hasConvex ? {} : "skip"
  );

  const categoryIdFromSlug = useMemo((): string | undefined => {
    if (!filters.category || filters.category === "all" || !categoriesRaw) return undefined;
    if (filters.category === "uncategorized") return "uncategorized";
    const cat = categoriesRaw.find(
      (c: any) => (c._id && (c.slug === filters.category || c.name === filters.category))
    );
    return cat?._id as string | undefined;
  }, [categoriesRaw, filters.category]);

  const usePagination = filters.usePagination && filters.sortBy === "publishedAt" && (filters.limit == null || filters.limit >= 12);

  const listCategoryId: Id<"content_categories"> | "uncategorized" | undefined =
    categoryIdFromSlug === "uncategorized"
      ? "uncategorized"
      : (categoryIdFromSlug as Id<"content_categories"> | undefined);

  const articlesRaw = useQuery(
    api.articles.list,
    hasConvex && !usePagination ? {
      status: filters.status ?? "published",
      categoryId: listCategoryId,
      limit: filters.limit,
      sortBy: filters.sortBy ?? "publishedAt",
    } : "skip"
  );

  const paginatedArgs = {
    categoryId: listCategoryId,
  };
  const paginated = usePaginatedQuery(
    api.articles.listPaginated,
    hasConvex && usePagination ? paginatedArgs : "skip",
    { initialNumItems: 24 }
  );

  const incrementViews = useMutation(api.articles.incrementViews);

  // Handle connection errors
  useEffect(() => {
    if (!hasConvex) {
      setConnectionError("Convex backend not configured. Set VITE_CONVEX_URL environment variable.");
      return;
    }

    // Reset error on successful connection
    if ((articlesRaw !== undefined || paginated.results !== undefined) && categoriesRaw !== undefined) {
      setConnectionError(null);
      setRetryCount(0);
    }

    // Detect if query is stuck in loading state (potential connection issue)
    if ((articlesRaw === undefined || categoriesRaw === undefined) && retryCount < 3) {
      const timeout = setTimeout(() => {
        if (articlesRaw === undefined || categoriesRaw === undefined) {
          setRetryCount(prev => prev + 1);
          setConnectionError("Connection timeout. Please check your internet connection and try again.");
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [articlesRaw, categoriesRaw, paginated.results, hasConvex, retryCount]);

  const categories: ContentCategory[] = useMemo(
    () => {
      if (!hasConvex || !categoriesRaw) return [];
      try {
        return (categoriesRaw ?? []).filter((c: any) => c._id).map(toContentCategory);
      } catch (error) {
        console.error("Error processing categories:", error);
        return [];
      }
    },
    [categoriesRaw, hasConvex]
  );

  const rawList = usePagination ? (paginated.results ?? []) : (articlesRaw ?? []);
  const articles: Article[] = useMemo(() => {
    if (!hasConvex) return [];
    try {
      let list = rawList.map(toArticle);
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          (a) =>
            (a.title ?? "").toLowerCase().includes(q) ||
            (a.excerpt ?? "").toLowerCase().includes(q) ||
            (typeof a.content === "string" && a.content.toLowerCase().includes(q)) ||
            (a.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
        );
      }
      return list;
    } catch (error) {
      console.error("Error processing articles:", error);
      return [];
    }
  }, [rawList, filters.searchQuery, hasConvex]);

  const loading = usePagination
    ? paginated.status === "LoadingFirstPage" || paginated.status === "LoadingMore"
    : hasConvex && (articlesRaw === undefined || categoriesRaw === undefined);
  
  const error = connectionError || (hasConvex && articlesRaw === null ? "Failed to load articles" : null);

  const incrementViewCount = async (slug: string) => {
    if (!hasConvex) return;
    try {
      await incrementViews({ slug });
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

  return {
    articles,
    categories,
    loading,
    error,
    refetch,
    incrementViewCount,
    pagination: usePagination
      ? {
          status: paginated.status,
          loadMore: paginated.loadMore,
          canLoadMore: paginated.status === "CanLoadMore",
        }
      : undefined,
  };
}
