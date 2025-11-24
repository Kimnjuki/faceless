import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { CommunityPost } from '@/lib/supabase';
import { toast } from 'sonner';

export function useCommunityPosts(category?: string) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts((data as CommunityPost[]) || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      // Use mock data if table doesn't exist yet
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const createPost = useCallback(async (title: string, content: string, category: string, authorName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          author_id: user.id,
          author_name: authorName,
          title,
          content,
          category,
          likes: 0,
          replies: 0,
        })
        .select()
        .single();

      if (error) throw error;
      
      setPosts((prev) => [data as CommunityPost, ...prev]);
      toast.success('Post created successfully!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
      throw error;
    }
  }, []);

  return { posts, loading, createPost, refetch: fetchPosts };
}

