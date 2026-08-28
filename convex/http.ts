import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const SITE_URL = "https://contentanonymity.com";

/**
 * A sitemap must only publish URLs that are indexable, return HTTP 200, and
 * self-canonicalize. The platform_guides/articles tables historically contain
 * CSV-import rows whose slugs are auto-generated placeholders (guide-<ts>-<rand>),
 * malformed raw text ("hold down and click Not Interested."), or near-duplicate
 * rows of real guides. Drop all of them here so downstream sitemap generation
 * emits canonical URLs only.
 */
const VALID_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTO_GUIDE_SLUG_RE = /^guide-\d+-[a-z0-9]+$/;
/** Placeholder / category-mislabeled article slugs that canonicalize elsewhere. */
const EXCLUDED_ARTICLE_SLUGS = new Set(["workflows", "anonymity"]);

function isCanonicalPlatformGuide(g: { slug?: string | null; title?: string | null; content?: string | null; excerpt?: string | null }): boolean {
  const slug = (g.slug ?? "").trim();
  if (!VALID_SLUG_RE.test(slug)) return false; // malformed / URL-unsafe slug
  if (AUTO_GUIDE_SLUG_RE.test(slug)) return false; // CSV-import placeholder
  const title = (g.title ?? "").trim();
  if (!title) return false; // mirror UI isDisplayableConvexPlatformGuide
  if (/^untitled(\s+guide)?$/i.test(title)) return false;
  const content = (g.content ?? "").trim();
  const excerpt = (g.excerpt ?? "").trim();
  if (!content && !excerpt) return false;
  return true;
}

function isCanonicalArticleSlug(slug: string): boolean {
  if (!VALID_SLUG_RE.test(slug)) return false;
  if (EXCLUDED_ARTICLE_SLUGS.has(slug)) return false;
  return true;
}

const http = httpRouter();

/**
 * GET /api/health - returns 200 JSON for load balancers and monitoring.
 */
http.route({
  path: "/api/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ status: "ok", backend: "convex", ts: Date.now() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

/**
 * GET /api/sitemap-data - returns JSON of dynamic URLs for sitemap generation.
 * Used by scripts/generate-sitemap.js when Convex is configured.
 */
http.route({
  path: "/api/sitemap-data",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const out: { articles: { path: string; lastmod: string }[]; products: { path: string; lastmod: string }[]; paths: { path: string; lastmod: string }[]; guides: { path: string; lastmod: string }[] } = {
      articles: [],
      products: [],
      paths: [],
      guides: [],
    };
    try {
      const [articles, paths, guides] = await Promise.all([
        ctx.runQuery(api.articles.list, { status: "published", limit: 2000 }),
        ctx.runQuery(api.learningPaths.list, { limit: 500 }),
        ctx.runQuery(api.platformGuides.list, { limit: 500 }),
      ]);
      const toDate = (n: number) => new Date(n).toISOString().split("T")[0];
      // Articles — canonical slugs only (no placeholder/category-mislabeled slugs).
      out.articles = (articles as any[])
        .filter((a) => isCanonicalArticleSlug((a.slug ?? "") as string))
        .map((a) => ({
          path: `${SITE_URL}/blog/${a.slug}`,
          lastmod: toDate(a.updatedAt ?? a.publishedAt ?? a.createdAt ?? 0),
        }));
      out.paths = (paths as any[]).map((p) => ({
        path: `${SITE_URL}/learning-paths/${p._id}`,
        lastmod: toDate(p.createdAt ?? 0),
      }));
      // Guides — displayable + canonical slug, de-duplicated by slug so each
      // repeated CSV row does not produce a duplicate URL in the sitemap.
      const seenGuideSlugs = new Set<string>();
      out.guides = (guides as any[])
        .filter(isCanonicalPlatformGuide)
        .filter((g) => {
          const slug = (g.slug ?? "") as string;
          if (seenGuideSlugs.has(slug)) return false;
          seenGuideSlugs.add(slug);
          return true;
        })
        .map((g) => ({
          path: `${SITE_URL}/platform-guides/${g.slug}`,
          lastmod: toDate(g.updatedAt ?? g.createdAt ?? 0),
        }));
    } catch (e) {
      console.error("Sitemap data error:", e);
    }
    return new Response(JSON.stringify(out), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
