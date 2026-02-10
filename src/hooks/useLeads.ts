import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { trackEmailCapture, trackFormSubmit } from "@/utils/analytics";
import type { Lead } from "@/types";

export function useLeads() {
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);
  const createMutation = useMutation(api.leads.create);

  const createLead = async (email: string, source?: string): Promise<Lead | null> => {
    // If Convex is not configured, just track analytics but don't save to DB
    if (!hasConvex) {
      const sourceName = source ?? "unknown";
      trackEmailCapture(sourceName);
      trackFormSubmit('email_capture', sourceName);
      console.warn("Convex not configured. Lead not saved to database.");
      return { _id: "local", id: "local", email, source };
    }
    
    try {
      const id = await createMutation({ email, source: source ?? "website" });
      const sourceName = source ?? "unknown";
      trackEmailCapture(sourceName);
      trackFormSubmit('email_capture', sourceName);
      return { _id: id, id: String(id), email, source };
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to submit email");
      throw e;
    }
  };

  return { createLead, loading: false };
}
