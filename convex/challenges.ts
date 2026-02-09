import { query } from "./_generated/server";

/**
 * List challenges. No challenges table in schema yet; returns empty array.
 */
export const list = query({
  handler: async () => {
    return [];
  },
});
