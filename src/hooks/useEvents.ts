import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, EventRegistration } from '@/lib/supabase';
import { toast } from 'sonner';

interface EventFilters {
  eventType?: string;
  status?: string;
  searchQuery?: string;
}

export function useEvents(filters: EventFilters = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          host:profiles(user_id, full_name, avatar_url, bio)
        `)
        .order('start_date', { ascending: true });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      } else {
        // Default: show upcoming and live events
        query = query.in('status', ['upcoming', 'live']);
      }

      if (filters.eventType && filters.eventType !== 'all') {
        query = query.eq('event_type', filters.eventType);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      let filteredData = (data as Event[]) || [];

      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (event) =>
            event.title.toLowerCase().includes(searchLower) ||
            event.description?.toLowerCase().includes(searchLower) ||
            event.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      setEvents(filteredData);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
      if (err.code !== 'PGRST116') {
        toast.error('Failed to load events');
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.eventType, filters.searchQuery]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const registerForEvent = useCallback(async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to register for events');
        throw new Error('Not authenticated');
      }

      // Check if already registered
      const { data: existing } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        toast.info('You are already registered for this event');
        return;
      }

      // Register for event
      const { data, error: regError } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          attendance_status: 'registered',
        })
        .select()
        .single();

      if (regError) throw regError;

      // Increment participant count
      await supabase.rpc('increment_event_participants', {
        event_id: eventId,
      });

      toast.success('Successfully registered for event!');
      return data as EventRegistration;
    } catch (err: any) {
      toast.error(err.message || 'Failed to register for event');
      throw err;
    }
  }, []);

  return { events, loading, error, refetch: fetchEvents, registerForEvent };
}













