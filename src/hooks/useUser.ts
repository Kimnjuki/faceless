import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useUser() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;
        setUser(data as User);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!authUser) return;

    try {
      const { data: updated, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', authUser.id)
        .select()
        .single();

      if (error) throw error;
      setUser(updated as User);
      return updated;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [authUser]);

  return { user, loading, updateUser };
}

