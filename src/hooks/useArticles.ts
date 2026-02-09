import { useMemo } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import type { Article, ContentCategory } from "@/types";

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
  const categoriesRaw = useQuery(api.contentCategories.list);
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
    usePagination ? "skip" : {
      status: filters.status ?? "published",
      categoryId: listCategoryId,
      limit: filters.limit,
      sortBy: filters.sortBy ?? "publishedAt",
    }
  );

  const paginatedArgs = {
    categoryId: listCategoryId,
  };
  const paginated = usePaginatedQuery(
    api.articles.listPaginated,
    usePagination ? paginatedArgs : "skip",
    { initialNumItems: 24 }
  );

  const incrementViews = useMutation(api.articles.incrementViews);

  const categories: ContentCategory[] = useMemo(
    () => (categoriesRaw ?? []).filter((c: any) => c._id).map(toContentCategory),
    [categoriesRaw]
  );

  const rawList = usePagination ? (paginated.results ?? []) : (articlesRaw ?? []);
  const articles: Article[] = useMemo(() => {
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
  }, [rawList, filters.searchQuery]);

  const loading = usePagination
    ? paginated.status === "LoadingFirstPage" || paginated.status === "LoadingMore"
    : articlesRaw === undefined || categoriesRaw === undefined;
  const error: string | null = null;

  const incrementViewCount = async (slug: string) => {
    try {
      await incrementViews({ slug });
    } catch (e) {
      console.warn("Could not increment view count:", e);
    }
  };

  return {
    articles,
    categories,
    loading,
    error,
    refetch: () => {},
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
