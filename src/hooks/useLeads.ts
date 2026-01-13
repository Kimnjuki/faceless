import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead } from '@/lib/supabase';
import { toast } from 'sonner';
import { trackEmailCapture } from '@/utils/analytics';

export function useLeads() {
  const [loading, setLoading] = useState(false);

  const createLead = useCallback(async (email: string, source?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({ email, source })
        .select()
        .single();

      if (error) throw error;
      
      // Track email capture for analytics
      trackEmailCapture(source || 'unknown');
      
      return data as Lead;
    } catch (error: any) {
      // Handle unique constraint violation (email already exists)
      if (error.code === '23505') {
        toast.success('You\'re already subscribed!');
        return null;
      }
      toast.error(error.message || 'Failed to submit email');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createLead, loading };
}

