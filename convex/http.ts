import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const SITE_URL = "https://contentanonymity.com";

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
      out.articles = (articles as any[]).map((a) => ({
        path: `${SITE_URL}/blog/${a.slug}`,
        lastmod: toDate(a.updatedAt ?? a.publishedAt ?? a.createdAt ?? 0),
      }));
      out.paths = (paths as any[]).map((p) => ({
        path: `${SITE_URL}/learning-paths/${p._id}`,
        lastmod: toDate(p.createdAt ?? 0),
      }));
      out.guides = (guides as any[]).map((g) => ({
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
