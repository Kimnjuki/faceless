import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { trackEvent } from "@/utils/analytics";

/**
 * Single analytics entry point for CTAs (phase_5). Persists a first-party
 * event to the `user_events` table (queryable funnel) and mirrors it to GA4.
 * Never throws — analytics must not break the user experience.
 */
export function useTrackEvent() {
  const logEvent = useMutation(api.userEvents.log);
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  return useCallback(
    async (eventType: string, eventData?: Record<string, unknown>) => {
      if (hasConvex) {
        try {
          await logEvent({
            eventType,
            eventData: eventData ?? null,
            sessionId: sessionStorage.getItem("ga_session_id") ?? undefined,
          });
        } catch (e) {
          console.warn("userEvents.log failed", e);
        }
      }
      trackEvent(eventType, "cta", eventType, undefined, eventData as Record<string, any>);
    },
    [logEvent, hasConvex]
  );
}
