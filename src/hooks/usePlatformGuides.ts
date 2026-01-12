import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PlatformGuide } from '@/lib/supabase';
import { toast } from 'sonner';

interface PlatformGuideFilters {
  platform?: string;
  category?: string;
  difficulty?: string;
  searchQuery?: string;
}

export function usePlatformGuides(filters: PlatformGuideFilters = {}) {
  const [guides, setGuides] = useState<PlatformGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('platform_guides')
        .select(`
          *,
          author:profiles(user_id, full_name, avatar_url)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (filters.platform && filters.platform !== 'all') {
        query = query.eq('platform', filters.platform);
      }
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty_level', filters.difficulty);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let guidesData = (data as PlatformGuide[]) || [];

      // Client-side search filtering
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        guidesData = guidesData.filter(
          (guide) =>
            guide.title.toLowerCase().includes(searchLower) ||
            guide.excerpt?.toLowerCase().includes(searchLower) ||
            guide.content.toLowerCase().includes(searchLower)
        );
      }

      setGuides(guidesData);
    } catch (err: any) {
      console.error('Error fetching platform guides:', err);
      setError(err.message || 'Failed to fetch platform guides');
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load platform guides');
      }
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, [filters.platform, filters.category, filters.difficulty, filters.searchQuery]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const incrementViewCount = useCallback(async (guideId: string) => {
    try {
      const { error } = await supabase.rpc('increment_guide_views', {
        guide_id: guideId,
      });

      if (error) {
        // If RPC doesn't exist, manually update
        const { data: current } = await supabase
          .from('platform_guides')
          .select('view_count')
          .eq('id', guideId)
          .single();

        if (current) {
          await supabase
            .from('platform_guides')
            .update({ view_count: (current.view_count || 0) + 1 })
            .eq('id', guideId);
        }
      }
    } catch (err) {
      console.warn('Could not increment view count:', err);
    }
  }, []);

  return { guides, loading, error, refetch: fetchGuides, incrementViewCount };
}










