/** URL slug from niche display name (must match Convex `niches.getBySlug`). */
export function nicheNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
