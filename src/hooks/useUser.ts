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
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (error) throw error;
        // Map profile to User interface for backward compatibility
        const userData = data as any;
        setUser({
          ...userData,
          id: userData.user_id, // Map user_id to id for compatibility
          name: userData.full_name, // Map full_name to name
          niche: userData.primary_niche, // Map primary_niche to niche
        } as User);
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
      // Map User fields to Profile fields
      const profileData: any = {};
      if (data.name !== undefined) profileData.full_name = data.name;
      if (data.niche !== undefined) profileData.primary_niche = data.niche;
      if (data.email !== undefined) profileData.email = data.email;
      // Add other fields as needed

      const { data: updated, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', authUser.id)
        .select()
        .single();

      if (error) throw error;
      // Map back to User interface
      const userData = updated as any;
      setUser({
        ...userData,
        id: userData.user_id,
        name: userData.full_name,
        niche: userData.primary_niche,
      } as User);
      return updated;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [authUser]);

  return { user, loading, updateUser };
}

