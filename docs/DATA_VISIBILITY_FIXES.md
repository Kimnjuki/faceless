# Data Visibility Fixes – Convex Pipeline Restructure

This document summarizes changes made to ensure **all content and data** in the Convex database are visible on the platform.

## Problem

- Large amounts of data were hidden from the platform
- Articles with `publishedAt: null` were excluded by `by_published_at` index
- Hard limits (e.g., 50, 500) capped visible content
- Platform guides with `published: undefined` were filtered out
- Pagination used indices that could exclude valid records

## Fixes Applied

### 1. Articles (`convex/articles.ts`)

| Query | Change |
|-------|--------|
| `list` | Uses `by_status` + `collect()` instead of `by_published_at`; filters by `isVisible` in memory; no hard limit (only when `limit` arg passed) |
| `getLatestArticles` | Uses `by_status` + `collect()`, filters `isVisible`, sorts in memory |
| `listAllVisible` | Same approach; cap increased from 500 to 2000 |
| `listPaginated` | Fetches ALL published via `by_status`, filters/sorts in memory, then slices for pagination; returns `{ page, isDone, continueCursor }` |
| `listRelated` | Already uses `by_status` + `collect()` |

**Visibility rule:** Only `status === "published"` and `publishedAt <= now` (or null) are shown.

### 2. Content / News (`convex/content.ts`)

| Query | Change |
|-------|--------|
| `list` | Default limit increased from 50 to 500 |

### 3. Platform Guides (`convex/platformGuides.ts`)

| Query | Change |
|-------|--------|
| `list` | Now includes guides where `published !== false` (i.e., `true` or `undefined`) instead of only `published === true` |

### 4. Frontend Hooks & Components

| File | Change |
|------|--------|
| `src/hooks/useArticles.ts` | `initialNumItems` for pagination increased from 12 to 24 |
| `src/components/ArticleGrid.tsx` | `getLatestArticles` limit increased from 12 to 24 |
| `src/components/NewsFeed.tsx` | Content list limit increased from 30 to 100 |

## Tables & Exposure

| Table | Convex File | Exposed Via | Notes |
|-------|-------------|-------------|-------|
| `articles` | `articles.ts` | `list`, `listPaginated`, `getLatestArticles`, `getBySlug`, `listRelated` | All published articles visible |
| `content` | `content.ts` | `list` | News feed; limit 500 default |
| `platform_guides` | `platformGuides.ts` | `list`, `getBySlug` | Includes `published !== false` |
| `learning_paths` | `learningPaths.ts` | `list`, `getById` | No limit; all paths |
| `niches` | `niches.ts` | `list`, `listCategories` | No limit; all niches |
| `tools` | `tools.ts` | `list`, `listCategories` | No limit; all tools |
| `templates` | `templates.ts` | `list` | No limit; all templates |
| `forum_posts` | `community.ts` | `listPosts`, `listCategories` | Published only |
| `webinars` | `webinars.ts` | `list` | All webinars |
| `content_categories` | `contentCategories.ts` | `list`, `getBySlug` | All categories |
| `profiles` | `profiles.ts` | `list` | Member directory |

## Verification

1. **Build:** `npm run build` succeeds
2. **Deploy Convex:** `npm run deploy:convex` to push changes
3. **Test:** Visit `/blog`, `/news`, `/learning/platform-guides`, `/tools`, `/resources/niche-database` and confirm all expected data appears

## Pagination Format

`listPaginated` returns a custom format compatible with `usePaginatedQuery`:

```ts
{
  page: Article[],
  isDone: boolean,
  continueCursor: string
}
```

The cursor is the numeric offset as a string; the hook passes it back for the next page.
