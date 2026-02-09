import { query } from "./_generated/server";

/**
 * Lightweight ping for connection status and health checks.
 * Returns quickly so the UI can show "Live" when Convex is reachable.
 */
export const ping = query({
  args: {},
  handler: async () => {
    return { ok: true as const, ts: Date.now() };
  },
});
