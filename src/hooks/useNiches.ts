import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Niche } from '@/lib/supabase';
import { toast } from 'sonner';

interface NicheFilters {
  category?: string;
  difficulty?: string;
  searchQuery?: string;
  sortBy?: 'profitability' | 'difficulty';
}

export function useNiches(filters: NicheFilters = {}) {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNiches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch niches with joined category
      let query = supabase
        .from('niches')
        .select(`
          *,
          category:niche_categories(id, name, description)
        `);

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        // First, get category ID from category name
        const { data: categoryData } = await supabase
          .from('niche_categories')
          .select('id')
          .eq('name', filters.category)
          .single();
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty_level', filters.difficulty);
      }

      // Apply sorting
      if (filters.sortBy === 'profitability') {
        query = query.order('profitability_score', { ascending: false });
      } else {
        query = query.order('niche_name', { ascending: true });
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let rawData = (data as any[]) || [];

      // Transform data to include category name
      const transformedData: Niche[] = rawData.map((niche: any) => ({
        ...niche,
        category: niche.category || null,
      }));

      // Client-side search filtering
      let finalData = transformedData;
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        finalData = transformedData.filter(
          (niche) =>
            niche.niche_name.toLowerCase().includes(searchLower) ||
            niche.description?.toLowerCase().includes(searchLower) ||
            (niche.category && typeof niche.category === 'object' 
              ? niche.category.name?.toLowerCase().includes(searchLower)
              : false)
        );
      }

      setNiches(finalData);
    } catch (err: any) {
      console.error('Error fetching niches:', err);
      setError(err.message || 'Failed to fetch niches');
      // Don't show toast for missing table - it's expected during initial setup
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load niches');
      }
      setNiches([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.difficulty, filters.searchQuery, filters.sortBy]);

  useEffect(() => {
    fetchNiches();
  }, [fetchNiches]);

  return { niches, loading, error, refetch: fetchNiches };
}

