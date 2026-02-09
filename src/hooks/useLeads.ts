import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { trackEmailCapture, trackFormSubmit } from "@/utils/analytics";
import type { Lead } from "@/types";

export function useLeads() {
  const createMutation = useMutation(api.leads.create);

  const createLead = async (email: string, source?: string): Promise<Lead | null> => {
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
