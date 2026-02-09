import { useMemo, useCallback } from "react";
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
  const raw = useQuery(api.community.listPosts, {
    categoryName: category && category !== "All" ? category : undefined,
  });
  const categoriesRaw = useQuery(api.community.listCategories);
  const createPostMutation = useMutation(api.community.createPost);

  const posts: CommunityPost[] = useMemo(() => (raw ?? []).map(toPost), [raw]);
  const loading = raw === undefined;

  const createPost = useCallback(
    async (title: string, content: string, categoryName: string) => {
      if (!user) throw new Error("Not authenticated");
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
    [user, categoriesRaw, createPostMutation]
  );

  return { posts, loading, createPost, refetch: () => {} };
}
