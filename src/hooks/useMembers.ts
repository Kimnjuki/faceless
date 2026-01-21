import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/supabase';
import { toast } from 'sonner';

interface MemberFilters {
  skillLevel?: string;
  niche?: string;
  subscriptionTier?: string;
  searchQuery?: string;
}

export function useMembers(filters: MemberFilters = {}) {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.skillLevel && filters.skillLevel !== 'all') {
        query = query.eq('skill_level', filters.skillLevel);
      }

      if (filters.niche && filters.niche !== 'all') {
        query = query.eq('primary_niche', filters.niche);
      }

      if (filters.subscriptionTier && filters.subscriptionTier !== 'all') {
        query = query.eq('subscription_tier', filters.subscriptionTier);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let filteredData = (data as Profile[]) || [];

      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (member) =>
            member.full_name?.toLowerCase().includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower) ||
            member.primary_niche?.toLowerCase().includes(searchLower) ||
            member.bio?.toLowerCase().includes(searchLower)
        );
      }

      setMembers(filteredData);
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Failed to fetch members');
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load members');
      }
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [filters.skillLevel, filters.niche, filters.subscriptionTier, filters.searchQuery]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers };
}
















