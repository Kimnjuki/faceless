# Supabase Articles – Setup & Schema

This app loads **blog articles from the `articles` table** in Supabase. The following describes the expected schema and how to align your data.

## Tables

- **`articles`** – main blog posts (required)
- **`content_categories`** – categories for filtering (optional; used for join and category filter)
- **`article_tags`** – tags per article (optional; used for join)
- **`profiles`** – author info (optional; used for `author` in joins)

## Required: `articles` table

Minimum columns the app expects:

| Column          | Type      | Notes                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------|
| `id`            | uuid      | Primary key                                                           |
| `title`         | text      |                                                                       |
| `slug`          | text      | Unique; used in URLs, e.g. `/blog/{slug}`                             |
| `content`       | text      | Body (Markdown). **Use `text`, not `varchar(n)`**, so 800+ word articles are not truncated. Aliases: `body`, `full_content`, `body_html`, `article_text` |
| `status`        | text      | `'published'` | `'draft'` | `'archived'`. Or use `published` (boolean).      |
| `created_at`    | timestamptz | For ordering when `published_at` is missing                        |
| `updated_at`    | timestamptz | Optional                                                           |

Optional but recommended:

| Column            | Type    | Notes                                  |
|------------------|---------|----------------------------------------|
| `excerpt`        | text    | Aliases: `description`, `meta_description` |
| `featured_image` | text    | Aliases: `image`, `image_url`          |
| `published_at`   | timestamptz | For ordering; fallback: `created_at` |
| `category_id`    | uuid    | FK to `content_categories.id`          |
| `author_id`      | uuid    | FK to `profiles.user_id`               |
| `read_time`      | int     | Minutes                                |
| `view_count`     | int     | Default 0                              |
| `seo_title`      | text    |                                        |
| `meta_description` | text  |                                        |
| `canonical_url`  | text   |                                        |

## Optional: `content_categories`

| Column        | Type | Notes        |
|---------------|------|-------------|
| `id`          | uuid | PK          |
| `name`        | text |             |
| `slug`        | text | Unique      |
| `description` | text |             |
| `sort_order`  | int  |             |

## Optional: `article_tags`

| Column      | Type   |
|------------|--------|
| `id`       | uuid   |
| `article_id` | uuid | FK to `articles.id` |
| `tag`      | text   |

## Row Level Security (RLS)

- **articles**: allow `SELECT` where `status = 'published'` (or equivalent if you use a `published` boolean).
- **content_categories**, **article_tags**: allow public `SELECT` if you use them.

If `articles` has no `status` column, the app can still work with a fallback that does not filter by `status` in the query; ensure RLS does not rely on a missing column.

## Full DDL

For the full `articles`, `content_categories`, and `article_tags` schema plus RLS and indexes, run:

**`MISSING_TABLES_SETUP.sql`** (in this repo)

It creates:

- `content_categories`
- `articles` (with `status` CHECK and `category_id` FK)
- `article_tags`
- Indexes and RLS policies

## App behavior

1. **Blog index (`/blog`)**  
   - Uses `useArticles` with `status: 'published'` and optional `category`, `searchQuery`, `limit`.  
   - Tries: `articles` with joins to `content_categories`, `profiles`, `article_tags`.  
   - Fallback: `articles` only, ordered by `created_at`, with in-memory filter for published (excludes `status = 'draft'|'archived'` and `published = false`).

2. **Article detail (`/blog/:slug`)**  
   - Loads by `slug`.  
   - Tries: (1) with joins + `status = 'published'`, (2) simple select + `status = 'published'`, (3) simple select without `status`, then excludes draft/archived/`published = false` in memory.

3. **Homepage**  
   - `LatestArticles` uses `useArticles({ status: 'published', limit: 3 })` and links to `/blog/{slug}`.

## Column aliases

The app normalizes common names:

- `content` ← `body`
- `excerpt` ← `description` | `meta_description`
- `featured_image` ← `image` | `image_url`
- `published_at` ← `created_at` | `updated_at` (when missing)

## Routing

- `/blog` → `BlogIndex` (list from Supabase)
- `/blog/:slug` → `ArticleDetail` (single article from Supabase by `slug`)

All blog posts are served from Supabase; there is no static blog route.

