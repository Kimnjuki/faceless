/**
 * Filters junk/placeholder rows from Convex `platform_guides` so the UI is not
 * flooded with repeated "Untitled Guide" cards. Real guides with titles and body stay.
 */
export function isDisplayableConvexPlatformGuide(g: {
  title?: string | null;
  content?: string | null;
  excerpt?: string | null;
}): boolean {
  const title = (g.title ?? "").trim();
  if (!title) return false;
  if (/^untitled(\s+guide)?$/i.test(title)) return false;
  const content = (g.content ?? "").trim();
  const excerpt = (g.excerpt ?? "").trim();
  if (content.length === 0 && excerpt.length === 0) return false;
  return true;
}
