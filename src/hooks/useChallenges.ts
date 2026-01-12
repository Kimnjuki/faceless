import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Challenge, ChallengeParticipation } from '@/lib/supabase';
import { toast } from 'sonner';

interface ChallengeFilters {
  challengeType?: string;
  status?: string;
  difficulty?: string;
  searchQuery?: string;
}

export function useChallenges(filters: ChallengeFilters = {}) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('challenges')
        .select(`
          *,
          creator:profiles(user_id, full_name, avatar_url, bio)
        `)
        .order('start_date', { ascending: true });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      } else {
        // Default: show upcoming and active challenges
        query = query.in('status', ['upcoming', 'active']);
      }

      if (filters.challengeType && filters.challengeType !== 'all') {
        query = query.eq('challenge_type', filters.challengeType);
      }

      if (filters.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty_level', filters.difficulty);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let filteredData = (data as Challenge[]) || [];

      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (challenge) =>
            challenge.name.toLowerCase().includes(searchLower) ||
            challenge.description?.toLowerCase().includes(searchLower)
        );
      }

      setChallenges(filteredData);
    } catch (err: any) {
      console.error('Error fetching challenges:', err);
      setError(err.message || 'Failed to fetch challenges');
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load challenges');
      }
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.challengeType, filters.difficulty, filters.searchQuery]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const joinChallenge = useCallback(async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to join challenges');
        throw new Error('Not authenticated');
      }

      // Check if already participating
      const { data: existing } = await supabase
        .from('challenge_participations')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        toast.info('You are already participating in this challenge');
        return;
      }

      // Join challenge
      const { data, error: joinError } = await supabase
        .from('challenge_participations')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          completion_status: 'registered',
          progress_percentage: 0,
          points: 0,
        })
        .select()
        .single();

      if (joinError) throw joinError;

      // Increment participant count
      await supabase.rpc('increment_challenge_participants', {
        challenge_id: challengeId,
      });

      toast.success('Successfully joined challenge!');
      return data as ChallengeParticipation;
    } catch (err: any) {
      toast.error(err.message || 'Failed to join challenge');
      throw err;
    }
  }, []);

  const getLeaderboard = useCallback(async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_participations')
        .select(`
          *,
          user:profiles(user_id, full_name, avatar_url, primary_niche)
        `)
        .eq('challenge_id', challengeId)
        .order('points', { ascending: false })
        .order('progress_percentage', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data as ChallengeParticipation[]) || [];
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  }, []);

  return { challenges, loading, error, refetch: fetchChallenges, joinChallenge, getLeaderboard };
}










