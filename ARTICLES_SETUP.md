# Articles (Blog) Setup for Supabase

This guide describes the database schema used by the blog to load articles from Supabase. Use it to create or align your `articles` table and optional related tables.

## Required: `articles` Table

Minimum columns the app expects:

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | uuid | ✅ | Primary key, `gen_random_uuid()` |
| `title` | text | ✅ | |
| `slug` | text | ✅ | Unique, used in URLs (e.g. `/blog/my-article`) |
| `content` | text | ✅ | Markdown or plain text (rendered as Markdown) |
| `status` | text | ✅ | `'published'` \| `'draft'` \| `'archived'` — only `published` is shown |
| `created_at` | timestamptz | ✅ | |
| `updated_at` | timestamptz | ✅ | |

### Optional Columns (with fallbacks)

| Column | Type | Fallback / alias |
|--------|------|------------------|
| `excerpt` | text | `description`, `meta_description` |
| `body` | text | Used as `content` if `content` is empty |
| `description` | text | Used as `excerpt` |
| `meta_description` | text | Used as `excerpt` |
| `featured_image` | text | `image`, `image_url` |
| `image` | text | Used as `featured_image` |
| `image_url` | text | Used as `featured_image` |
| `published_at` | timestamptz | `created_at`, `updated_at` (for ordering and display) |
| `read_time` | int | Displayed as “X min read” |
| `view_count` | int | Default 0, can be incremented |
| `category_id` | uuid | FK to `content_categories.id` (if you use categories) |
| `category` | text | If no `content_categories`, used as category name |
| `author_id` | uuid | FK to `profiles.user_id` (if you use profiles) |
| `author` | text | If no `profiles` join, used as author name |
| `seo_title` | text | Overrides `title` in meta tags |
| `canonical_url` | text | Overrides default canonical |

### Example: Minimal `articles` Table

```sql
create table articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  excerpt text,
  featured_image text,
  published_at timestamptz,
  read_time int,
  view_count int default 0,
  category_id uuid,
  author_id uuid,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index articles_slug_idx on articles(slug);
create index articles_status_published_at_idx on articles(status, published_at desc);
alter table articles enable row level security;

create policy "Anyone can read published articles"
  on articles for select
  using (status = 'published');
```

---

## Optional: `content_categories`

Used for category filters on the blog index and for `category: { name }` on articles.

```sql
create table content_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  sort_order int default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table content_categories enable row level security;
create policy "Anyone can read content_categories" on content_categories for select using (true);
```

Then add FK on `articles`:

```sql
alter table articles add constraint articles_category_fk
  foreign key (category_id) references content_categories(id);
```

---

## Optional: `article_tags`

Used for tags on articles. The app expects a relation `article_tags(article_id, tag)`.

```sql
create table article_tags (
  id uuid default gen_random_uuid() primary key,
  article_id uuid not null references articles(id) on delete cascade,
  tag text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index article_tags_article_id_idx on article_tags(article_id);
alter table article_tags enable row level security;
create policy "Anyone can read article_tags" on article_tags for select using (true);
```

---

## Optional: `profiles` (for author)

If `articles.author_id` references `profiles.user_id`, the app can show author name and avatar. `profiles` should have at least:

- `user_id` (uuid, references `auth.users`)
- `full_name` (text)
- `avatar_url` (text, optional)

---

## Optional: RPC to increment `view_count`

```sql
create or replace function increment_article_views(article_id uuid)
returns void language plpgsql security definer as $$
begin
  update articles set view_count = coalesce(view_count, 0) + 1 where id = article_id;
end;
$$;
```

If this RPC is missing, the app will try a direct `update` on `articles.view_count` when possible.

---

## Behavior Without Optional Tables

- **No `content_categories`:** Category filter on `/blog` shows only “All”. Articles can still use a `category` text column for `category: { name }` when using the simple select fallback.
- **No `article_tags`:** Tags will be empty unless `articles` has a `tags` column (array or comma‑separated string).
- **No `profiles` / `author_id`:** Author is “Anonymous” unless `articles.author` (text) is set.

---

## URL and Routing

- Blog index: `/blog`
- Article by slug: `/blog/<slug>` (e.g. `/blog/how-to-start-faceless-youtube-channel-2026`)
- The app first tries a query with joins to `content_categories`, `profiles`, and `article_tags`. If that fails (e.g. missing tables or relations), it falls back to `select * from articles` and maps alternate column names as in the tables above.

---

## Sitemap

Add important blog URLs to `public/sitemap.xml`, e.g.:

- `https://yoursite.com/blog`
- `https://yoursite.com/blog/how-to-start-faceless-youtube-channel-2026`

For a full list of article URLs from Supabase, you’d need a build‑time or server‑side step that reads `articles` and appends each `https://yoursite.com/blog/{slug}`.

