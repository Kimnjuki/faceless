import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Event } from "@/types";

interface EventFilters {
  eventType?: string;
  status?: string;
  searchQuery?: string;
}

function toEvent(w: any): Event {
  return {
    ...w,
    id: w._id ?? w.id,
    start_date: w.scheduledAt != null ? new Date(w.scheduledAt).toISOString().split("T")[0] : undefined,
    scheduledAt: w.scheduledAt,
    host_id: w.hostId,
    status: w.status ?? "upcoming",
    current_participants: 0,
    maxAttendees: w.maxAttendees,
    created_at: w.createdAt != null ? new Date(w.createdAt).toISOString() : undefined,
    updated_at: w.updatedAt != null ? new Date(w.updatedAt).toISOString() : undefined,
  };
}

export function useEvents(filters: EventFilters = {}) {
  const raw = useQuery(api.webinars.list, {});

  const events: Event[] = useMemo(() => {
    let list = (raw ?? []).map(toEvent);
    if (filters.status && filters.status !== "all")
      list = list.filter((e) => (e.status ?? "").toLowerCase() === filters.status?.toLowerCase());
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          (e.title ?? "").toLowerCase().includes(q) ||
          (e.description ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [raw, filters.status, filters.searchQuery]);

  const loading = raw === undefined;
  const error: string | null = null;

  const registerForEvent = async (_eventId: string) => {
    // TODO: webinar_registrations when needed
    return null;
  };

  return { events, loading, error, refetch: () => {}, registerForEvent };
}
