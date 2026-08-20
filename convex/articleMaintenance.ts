import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/** Slugs containing these chars (or >200 chars) are invalid for URLs. */
const SLUG_INVALID = /[\s,?#%&'"<>{}|\\^~`]/;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/**
 * Find articles whose slug is malformed (e.g. a CSV row leaked into the slug
 * during import). Returns enough to review before repairing.
 */
export const diagnoseMalformedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    return articles
      .filter((a) => SLUG_INVALID.test(a.slug) || a.slug.length > 200)
      .map((a) => ({ _id: a._id, title: a.title, slug: a.slug }));
  },
});

/**
 * Regenerate valid slugs from each article's title and record a 301 from the
 * old (broken) path to the new one so existing links/crawls don't 404.
 * Safe to re-run: only touches malformed slugs, preserves uniqueness.
 */
export const repairCorruptedSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    const taken = new Set(articles.map((a) => a.slug));
    const repaired: { _id: string; oldSlug: string; newSlug: string }[] = [];

    for (const a of articles) {
      const bad = SLUG_INVALID.test(a.slug) || a.slug.length > 200;
      if (!bad) continue;

      let base = slugify(a.title);
      let newSlug = base;
      let i = 2;
      while (taken.has(newSlug)) {
        newSlug = `${base}-${i}`;
        i++;
      }
      taken.add(newSlug);

      // 301 from the broken URL to the clean one (P0-4).
      await ctx.db.insert("redirects", {
        fromPath: `/blog/${a.slug}`,
        toPath: `/blog/${newSlug}`,
        statusCode: 301,
        reason: "repair malformed imported slug",
        createdAt: Date.now(),
      });

      await ctx.db.patch(a._id, { slug: newSlug });
      repaired.push({ _id: a._id, oldSlug: a.slug, newSlug });
    }
    return repaired;
  },
});
