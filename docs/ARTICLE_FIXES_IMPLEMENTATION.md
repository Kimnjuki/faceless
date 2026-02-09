# Article Fixes Implementation (Phase 1 Critical)

Implementation of the article display and data quality fixes from the 2026-02-04 spec.

---

## 1. Image Fallback for Broken URLs

**Issue:** Featured images may have broken URLs.

**Fix:**
- Created `ArticleImage` component (`src/components/ArticleImage.tsx`) with `onError` fallback to `/images/default-article-placeholder.svg`
- Added `public/images/default-article-placeholder.svg` (simple gray placeholder)
- Integrated `ArticleImage` in: `BlogIndex`, `ArticleGrid`, `ArticleDetail`

---

## 2. Default "Uncategorized" Category

**Issue:** Articles without `categoryId` had no display label.

**Fix:**
- `contentCategories.list` returns a virtual "Uncategorized" when no such category exists in DB
- Added `contentCategories.ensureUncategorized` mutation to create the category (run once for migration)
- Articles with `categoryId: null` display "Uncategorized" in badges and hero
- BlogIndex has an "Uncategorized" filter button

---

## 3. publishedAt Filter (Hide Future-Dated)

**Issue:** Articles may show drafts and future-dated content.

**Fix:**
- Added `isVisible()` filter: only show when `status === "published"` AND `(publishedAt == null || publishedAt <= Date.now())`
- Applied in: `list`, `getLatestArticles`, `listAllVisible`, `listPaginated`

---

## 4. Cursor-Based Pagination

**Issue:** All articles loading at once causes performance issues.

**Fix:**
- Added `articles.listPaginated` query with `paginationOptsValidator`
- Uses `by_published_at` and `by_category_status_published` indexes
- `useArticles` uses `usePaginatedQuery` when `usePagination: true` and `sortBy === "publishedAt"`
- BlogIndex: "Load More Articles" button, 12 items per page
- Supports category filter (including "uncategorized")

---

## 5. Sorting Options

**Issue:** No default or user-selectable sorting.

**Fix:**
- Default sort: `publishedAt` desc (newest first)
- Added `sortBy` to `articles.list`: `publishedAt`, `viewCount`, `shareCount`, `title`
- BlogIndex sort UI: Latest First, Most Popular, Most Shared, Alphabetical
- When sortBy ≠ publishedAt, uses non-paginated list

---

## 6. Database Indexes

**Added:**
- `article_tags.by_tag` – tag-based queries
- `articles.by_category_status` – category + status
- `articles.by_category_status_published` – category + status + publishedAt (for paginated category pages)

---

## 7. Schema / Convex Changes

| File | Change |
|------|--------|
| `convex/schema.ts` | `by_tag` on article_tags; `by_category_status`, `by_category_status_published` on articles |
| `convex/articles.ts` | `isVisible`, `listPaginated`, `sortBy` in list, publishedAt filter |
| `convex/contentCategories.ts` | Virtual Uncategorized in list; `ensureUncategorized` mutation |

---

## Migration Steps

1. **Deploy Convex:** `npx convex dev` or `npx convex deploy`
2. **Create Uncategorized category (optional):** Run `api.contentCategories.ensureUncategorized` from Convex dashboard or a one-off script
3. **Assign uncategorized articles (optional):** Migration script to set `categoryId` to Uncategorized for articles with null

---

## Testing Checklist

- [ ] Published articles show; drafts/archived hidden
- [ ] Future-dated articles (publishedAt > now) are hidden
- [ ] Pagination "Load More" works
- [ ] Sort options (Latest, Popular, Shared, Alphabetical) work
- [ ] Uncategorized filter shows articles with null categoryId
- [ ] Broken image URLs show placeholder
- [ ] Category badges show "Uncategorized" when applicable
