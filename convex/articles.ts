import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

const articleStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("archived")
);

/** Validator for a single article document (import / insert). */
const articleDocValidator = v.object({
  legacyId: v.optional(v.string()),
  title: v.string(),
  slug: v.string(),
  excerpt: v.optional(v.string()),
  content: v.string(),
  categoryId: v.optional(v.id("content_categories")),
  authorId: v.optional(v.id("profiles")),
  status: articleStatus,
  featuredImage: v.optional(v.string()),
  readTime: v.optional(v.float64()),
  wordCount: v.optional(v.float64()),
  seoTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  canonicalUrl: v.optional(v.string()),
  schemaMarkup: v.optional(v.any()),
  internalLinks: v.optional(v.any()),
  contentUpgrades: v.optional(v.any()),
  publishedAt: v.optional(v.float64()),
  createdAt: v.float64(),
  updatedAt: v.float64(),
  viewCount: v.optional(v.float64()),
  shareCount: v.optional(v.float64()),
  targetPlatforms: v.optional(v.array(v.string())),
});

/**
 * Insert one article (for CSV/JSON import).
 * Returns the new document _id.
 */
export const importArticle = mutation({
  args: { doc: articleDocValidator },
  handler: async (ctx, { doc }) => {
    return await ctx.db.insert("articles", doc);
  },
});

/**
 * Patch publishedAt to now() for articles that have null or future publishedAt.
 * Fixes visibility for newly imported articles.
 */
export const patchPublishedAt = mutation({
  args: { slug: v.optional(v.string()) },
  handler: async (ctx, { slug }) => {
    const ts = Date.now();
    let articles;
    if (slug) {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .collect();
    } else {
      articles = await ctx.db
        .query("articles")
        .withIndex("by_status", (q) => q.eq("status", "published"))
        .collect();
    }
    let patched = 0;
    for (const a of articles) {
      if (a.status !== "published") continue;
      const needsPatch = a.publishedAt == null || a.publishedAt > ts;
      if (needsPatch) {
        await ctx.db.patch(a._id, { publishedAt: ts, updatedAt: ts });
        patched++;
      }
    }
    return { patched };
  },
});

const now = () => Date.now();

/** Filter: only show published articles where publishedAt <= now (hide future-dated) */
function isVisible(article: { status: string; publishedAt?: number }) {
  if (article.status !== "published") return false;
  if (article.publishedAt != null && article.publishedAt > now()) return false;
  return true;
}

/**
 * List articles with optional filters.
 * Only shows published articles where publishedAt <= now.
 * Uses by_status to ensure ALL articles are included (by_published_at may exclude null publishedAt).
 */
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    categoryId: v.optional(v.union(v.id("content_categories"), v.literal("uncategorized"))),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(
      v.literal("publishedAt"),
      v.literal("viewCount"),
      v.literal("shareCount"),
      v.literal("title")
    )),
  },
  handler: async (ctx, { status = "published", categoryId, limit, sortBy = "publishedAt" }) => {
    // Use by_status to get ALL articles (by_published_at index excludes null/undefined publishedAt)
    const q = ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", status));
    let results = await q.collect();
    if (status === "published") results = results.filter(isVisible);
    if (categoryId === "uncategorized") {
      results = results.filter((a) => a.categoryId == null);
    } else if (categoryId) {
      results = results.filter((a) => a.categoryId === categoryId);
    }
    if (sortBy === "viewCount") {
      results.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    } else if (sortBy === "shareCount") {
      results.sort((a, b) => (b.shareCount ?? 0) - (a.shareCount ?? 0));
    } else if (sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      results.sort((a, b) => (b.publishedAt ?? b.createdAt ?? 0) - (a.publishedAt ?? a.createdAt ?? 0));
    }
    if (limit) {
      results = results.slice(0, limit);
    }
    
    // Resolve category and author
    const enriched = await Promise.all(
      results.map(async (article) => {
        const category = article.categoryId
          ? await ctx.db.get(article.categoryId)
          : null;
        const author = article.authorId
          ? await ctx.db.get(article.authorId)
          : null;
        
        // Get tags
        const tags = await ctx.db
          .query("article_tags")
          .withIndex("by_article", (q) => q.eq("articleId", article._id))
          .collect();
        
        return {
          ...article,
          category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : null,
          author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
          tags: tags.map((t) => t.tag),
        };
      })
    );
    
    return enriched;
  },
});

/**
 * Fetch articles sorted by most recent first, filtered by 'published' status.
 * Uses by_status to ensure ALL published articles are included.
 */
export const getLatestArticles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 24 }) => {
    let results = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    results = results.filter(isVisible);
    results.sort((a, b) => (b.publishedAt ?? b.createdAt ?? 0) - (a.publishedAt ?? a.createdAt ?? 0));
    results = results.slice(0, limit);

    const enriched = await Promise.all(
      results.map(async (article) => {
        const category = article.categoryId
          ? await ctx.db.get(article.categoryId)
          : null;
        const author = article.authorId
          ? await ctx.db.get(article.authorId)
          : null;
        const tags = await ctx.db
          .query("article_tags")
          .withIndex("by_article", (q) => q.eq("articleId", article._id))
          .collect();
        return {
          ...article,
          category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : null,
          author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
          tags: tags.map((t) => t.tag),
        };
      })
    );
    return enriched;
  },
});

/**
 * List all visible (published) articles, newest first.
 * Uses by_status to ensure ALL published articles are included.
 */
export const listAllVisible = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    let results = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    results = results.filter(isVisible);
    results.sort((a, b) => (b.publishedAt ?? b.createdAt ?? 0) - (a.publishedAt ?? a.createdAt ?? 0));
    results = results.slice(0, limit ?? 2000);

    const enriched = await Promise.all(
      results.map(async (article) => {
        const category = article.categoryId
          ? await ctx.db.get(article.categoryId)
          : null;
        const author = article.authorId
          ? await ctx.db.get(article.authorId)
          : null;
        const tags = await ctx.db
          .query("article_tags")
          .withIndex("by_article", (q) => q.eq("articleId", article._id))
          .collect();
        return {
          ...article,
          category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : null,
          author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
          tags: tags.map((t) => t.tag),
        };
      })
    );
    return enriched;
  },
});

/**
 * Paginated list of published articles (cursor-based).
 * Sort: publishedAt desc. Supports category filter.
 * Uses by_status/collect to ensure ALL articles are included (index may exclude null publishedAt).
 */
export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    categoryId: v.optional(v.union(v.id("content_categories"), v.literal("uncategorized"))),
  },
  handler: async (ctx, { paginationOpts, categoryId }) => {
    // Get ALL published articles (by_status ensures we don't miss any)
    let all = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    all = all.filter(isVisible);
    if (categoryId === "uncategorized") {
      all = all.filter((a) => a.categoryId == null);
    } else if (categoryId) {
      all = all.filter((a) => a.categoryId === categoryId);
    }
    all.sort((a, b) => (b.publishedAt ?? b.createdAt ?? 0) - (a.publishedAt ?? a.createdAt ?? 0));

    const { numItems, cursor } = paginationOpts;
    const start = cursor ? parseInt(cursor, 10) : 0;
    const page = all.slice(start, start + numItems);
    const enriched = await Promise.all(
      page.map(async (article) => {
        const category = article.categoryId ? await ctx.db.get(article.categoryId) : null;
        const author = article.authorId ? await ctx.db.get(article.authorId) : null;
        const tags = await ctx.db
          .query("article_tags")
          .withIndex("by_article", (q) => q.eq("articleId", article._id))
          .collect();
        return {
          ...article,
          category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : { id: null, name: "Uncategorized", slug: "uncategorized", description: "" },
          author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
          tags: tags.map((t) => t.tag),
        };
      })
    );
    return {
      page: enriched,
      isDone: start + page.length >= all.length,
      continueCursor: String(start + page.length),
    };
  },
});

/**
 * Get article by Convex _id. For direct ID access (e.g. /blog/jh77v6j67ckc0dg6vxwgxnpamh80k7rz).
 */
export const getById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, { id }) => {
    const article = await ctx.db.get(id);
    if (!article) return null;
    if (!isVisible(article)) return null;
    const category = article.categoryId ? await ctx.db.get(article.categoryId) : null;
    const author = article.authorId ? await ctx.db.get(article.authorId) : null;
    const tags = await ctx.db
      .query("article_tags")
      .withIndex("by_article", (q) => q.eq("articleId", article._id))
      .collect();
    return {
      ...article,
      category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : null,
      author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
      tags: tags.map((t) => t.tag),
    };
  },
});

/** Convex ID format: alphanumeric, ~32 chars */
const CONVEX_ID_REGEX = /^[a-z0-9]{20,}$/i;

/**
 * Get article by slug.
 * Uses collect() to handle duplicate slugs: prefers published+visible article.
 * Also tries legacyId fallback when slug looks like a UUID (for migrated URLs).
 * For slug param that looks like Convex ID, delegates to getById.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const trimmed = slug.trim();
    if (!trimmed) return null;

    // If param looks like Convex article ID (alphanumeric, no hyphens), fetch by id
    if (CONVEX_ID_REGEX.test(trimmed) && !trimmed.includes("-")) {
      try {
        const doc = await ctx.db.get(trimmed as Id<"articles">);
        if (doc && "status" in doc && "slug" in doc && doc.status === "published") {
          const article = doc;
          if (isVisible(article)) {
            const category = article.categoryId ? await ctx.db.get(article.categoryId) : null;
            const author = article.authorId ? await ctx.db.get(article.authorId) : null;
            const tags = await ctx.db
              .query("article_tags")
              .withIndex("by_article", (q) => q.eq("articleId", article._id))
              .collect();
            return {
              ...article,
              category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : null,
              author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
              tags: tags.map((t) => t.tag),
            };
          }
        }
      } catch {
        // Not a valid id, fall through to slug lookup
      }
    }

    // 1. Try by_slug index - get ALL matches (handles duplicate slugs)
    let candidates = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", trimmed))
      .collect();

    // 2. If no match, try legacyId (for URLs like /blog/uuid)
    if (candidates.length === 0 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) {
      candidates = await ctx.db
        .query("articles")
        .withIndex("by_legacyId", (q) => q.eq("legacyId", trimmed))
        .collect();
    }

    // 3. Fallback: full scan by slug (handles index propagation delay for newly inserted docs)
    if (candidates.length === 0) {
      const all = await ctx.db.query("articles").collect();
      candidates = all.filter((a) => a.slug === trimmed);
    }

    if (candidates.length === 0) return null;

    // Prefer published+visible; otherwise return first match
    const visible = candidates.filter(isVisible);
    const article = visible[0] ?? candidates[0];
    
    // Resolve category and author
    const category = article.categoryId
      ? await ctx.db.get(article.categoryId)
      : null;
    const author = article.authorId
      ? await ctx.db.get(article.authorId)
      : null;
    
    // Get tags
    const tags = await ctx.db
      .query("article_tags")
      .withIndex("by_article", (q) => q.eq("articleId", article._id))
      .collect();
    
    return {
      ...article,
      category: category ? { id: category._id, name: category.name, slug: category.slug, description: category.description } : null,
      author: author ? { id: author._id, user_id: author.userId, full_name: author.fullName, avatar_url: author.avatarUrl } : null,
      tags: tags.map((t) => t.tag),
    };
  },
});

/**
 * Increment article view count.
 */
export const incrementViews = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    
    if (!article) return;
    
    await ctx.db.patch(article._id, {
      viewCount: (article.viewCount ?? 0) + 1,
    });
  },
});

/**
 * Get related articles/tools for a given article (by tags, category). For RelatedContent component.
 */
export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    let deleted = 0;
    for (const article of articles) {
      await ctx.db.delete(article._id);
      deleted++;
    }
    return { deleted };
  },
});

export const listRelated = query({
  args: {
    slug: v.string(),
    tags: v.optional(v.array(v.string())),
    categoryId: v.optional(v.id("content_categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { slug, tags = [], categoryId, limit = 5 }) => {
    const published = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const _current = published.find((a) => a.slug === slug);
    let related = published.filter((a) => a.slug !== slug);
    if (categoryId) related = related.filter((a) => a.categoryId === categoryId);
    if (tags.length > 0) {
      const withTags = await Promise.all(
        related.slice(0, 20).map(async (a) => {
          const articleTags = await ctx.db
            .query("article_tags")
            .withIndex("by_article", (q) => q.eq("articleId", a._id))
            .collect();
          const tagSet = new Set(articleTags.map((t) => t.tag));
          const matchCount = tags.filter((t) => tagSet.has(t)).length;
          return { article: a, matchCount };
        })
      );
      withTags.sort((a, b) => b.matchCount - a.matchCount);
      related = withTags.map((x) => x.article).filter((_, i) => withTags[i].matchCount > 0);
    }
    const slice = related.slice(0, limit ?? 5);
    const categories = await ctx.db.query("content_categories").collect();
    const catMap = Object.fromEntries(categories.map((c) => [c._id, c]));
    return slice.map((a) => ({
      _id: a._id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      categoryId: a.categoryId,
      category: a.categoryId ? catMap[a.categoryId] : null,
    }));
  },
});
