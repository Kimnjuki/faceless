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
      // Fetch posts with joined category
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          category:community_categories(id, name, description, access_tier)
        `)
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        // First, get category ID from category name
        const { data: categoryData } = await supabase
          .from('community_categories')
          .select('id')
          .eq('name', category)
          .single();
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
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

  const createPost = useCallback(async (title: string, content: string, category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get category ID from category name
      let categoryId: string | undefined;
      if (category && category !== 'All') {
        const { data: categoryData } = await supabase
          .from('community_categories')
          .select('id')
          .eq('name', category)
          .single();
        
        if (categoryData) {
          categoryId = categoryData.id;
        }
      }

      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          author_id: user.id,
          title,
          content,
          category_id: categoryId,
          post_type: 'discussion',
          status: 'published',
        })
        .select(`
          *,
          category:community_categories(id, name, description, access_tier)
        `)
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

