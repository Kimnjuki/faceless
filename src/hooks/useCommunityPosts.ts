import { useMemo, useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "@/lib/convex-ids";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { CommunityPost } from "@/types";

function toPost(p: any): CommunityPost {
  return {
    ...p,
    id: p._id ?? p.id,
    category_id: p.categoryId,
    author_id: p.authorId,
    post_type: p.postType,
    view_count: p.viewCount,
    reply_count: p.replyCount,
    created_at: p.createdAt != null ? new Date(p.createdAt).toISOString() : undefined,
    updated_at: p.updatedAt != null ? new Date(p.updatedAt).toISOString() : undefined,
  };
}

export function useCommunityPosts(category?: string) {
  const { user } = useAuth();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Convex is configured
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const raw = useQuery(
    api.community.listPosts,
    hasConvex ? {
      categoryName: category && category !== "All" ? category : undefined,
    } : "skip"
  );
  const categoriesRaw = useQuery(
    api.community.listCategories,
    hasConvex ? {} : "skip"
  );
  const createPostMutation = useMutation(api.community.createPost);

  // Handle connection errors
  useEffect(() => {
    if (!hasConvex) {
      setConnectionError("Convex backend not configured. Set VITE_CONVEX_URL environment variable.");
      return;
    }

    // Reset error on successful connection
    if (raw !== undefined && categoriesRaw !== undefined) {
      setConnectionError(null);
      setRetryCount(0);
    }

    // Detect if query is stuck in loading state (potential connection issue)
    if ((raw === undefined || categoriesRaw === undefined) && retryCount < 3) {
      const timeout = setTimeout(() => {
        if (raw === undefined || categoriesRaw === undefined) {
          setRetryCount(prev => prev + 1);
          setConnectionError("Connection timeout. Please check your internet connection and try again.");
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [raw, categoriesRaw, hasConvex, retryCount]);

  const posts: CommunityPost[] = useMemo(() => {
    if (!hasConvex || raw === undefined) return [];
    try {
      return (raw ?? []).map(toPost);
    } catch (error) {
      console.error("Error processing community posts:", error);
      return [];
    }
  }, [raw, hasConvex]);

  const loading = hasConvex && (raw === undefined || categoriesRaw === undefined);
  const error = connectionError || (hasConvex && raw === null ? "Failed to load community posts" : null);

  const createPost = useCallback(
    async (title: string, content: string, categoryName: string) => {
      if (!user) throw new Error("Not authenticated");
      if (!hasConvex) throw new Error("Convex backend not configured");
      let categoryId: string | undefined;
      if (categoryName && categoryName !== "All" && categoriesRaw) {
        const cat = categoriesRaw.find((c: any) => c.name === categoryName);
        categoryId = cat?._id;
      }
      await createPostMutation({
        authorUserId: user.id,
        title,
        content,
        categoryId: categoryId as Id<"community_categories"> | undefined,
      });
      toast.success("Post created successfully!");
    },
    [user, categoriesRaw, createPostMutation, hasConvex]
  );

  const refetch = () => {
    setRetryCount(0);
    setConnectionError(null);
    // Convex queries automatically refetch, but we can trigger a re-render
    window.location.reload();
  };

  return { posts, loading, error, createPost, refetch };
}
