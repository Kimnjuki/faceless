# Supabase → Convex Migration Guide

**Purpose:** Migrate contentanonymity.com from Supabase (PostgreSQL + Auth) to Convex (document DB + serverless functions) **without affecting the live site** until cutover.

**Reference:** Your full Supabase schema (50+ tables) is mirrored in Convex schema at `convex/schema.ts`. This guide walks through preparation, data migration, code changes, auth migration, testing, and go-live.

---

## Table of Contents

1. [Prerequisites & Decisions](#1-prerequisites--decisions)
2. [Phase 0: Audit & Backup](#2-phase-0-audit--backup)
3. [Phase 1: Convex Project & Schema](#3-phase-1-convex-project--schema)
4. [Phase 2: Data Export from Supabase](#4-phase-2-data-export-from-supabase)
5. [Phase 3: Data Import into Convex](#5-phase-3-data-import-into-convex)
6. [Phase 4: Auth Migration](#6-phase-4-auth-migration)
7. [Phase 5: Replace Supabase with Convex in Code](#7-phase-5-replace-supabase-with-convex-in-code)
8. [Phase 6: RPCs → Convex Mutations](#8-phase-6-rpcs--convex-mutations)
9. [Phase 7: Testing & Parity Checklist](#9-phase-7-testing--parity-checklist)
10. [Phase 8: Cutover & Post-Migration](#10-phase-8-cutover--post-migration)
11. [Rollback Plan](#11-rollback-plan)
12. [File Mapping: Supabase → Convex](#12-file-mapping-supabase--convex)

---

## 1. Prerequisites & Decisions

### 1.1 Convex concepts vs Supabase

| Supabase | Convex |
|----------|--------|
| PostgreSQL tables | Convex tables (documents) |
| Row `id` (UUID) | Document `_id` (Convex `Id<"tableName">`) |
| Foreign keys | Store `v.id("otherTable")` in schema |
| RPC / Edge Functions | Convex mutations / actions / queries |
| Realtime subscriptions | Convex reactive queries (`useQuery`) |
| Auth (Supabase Auth) | Convex Auth or **Clerk** / **Auth0** (recommended) |

### 1.2 Auth strategy (critical)

- **Option A (recommended):** Use **Clerk** or **Auth0** with Convex. Convex has first-class Clerk integration; Auth0 can store `userId` and you pass it to Convex.
- **Option B:** Convex Auth (custom auth with tokens). More work; you must migrate user accounts and passwords or force reset.
- **Decision:** Choose before Phase 4. For minimal disruption, Clerk + Convex is the smoothest; migrate users via Clerk’s API or invite flow.

### 1.3 ID strategy for migration

- **Convex** assigns `_id` (e.g. `Id<"articles">`) to every document. Your current data uses **UUID** primary keys and foreign keys.
- **Approach:**
  1. Export all Supabase rows (with UUIDs).
  2. Insert into Convex in **dependency order** (no FKs in Convex, but we need to resolve references). Build a map: `oldUuid → Convex _id` per table.
  3. When inserting a row that “references” another (e.g. `articles.author_id` → profiles), look up the Convex `_id` from the map using the old UUID, and store that `_id` in the new document.
  4. Optional: keep a field `legacyId: string` (old UUID) on important tables for debugging or one-time lookups.

### 1.4 What stays the same

- **Domain / hosting:** contentanonymity.com unchanged until cutover.
- **Frontend:** Same React app; only data layer and auth provider change.
- **Public URLs:** Same routes (e.g. `/blog/:slug`). Convex will serve the same content keyed by `slug` where applicable.

---

## 2. Phase 0: Audit & Backup

### 2.1 Tables and features in use (from codebase)

Your app currently uses at least:

- **Auth:** `supabase.auth` (session, signIn, signUp, signInWithOAuth, signOut, onAuthStateChange).
- **Tables:** `profiles`, `content_categories`, `articles`, `article_tags`, `learning_paths`, `learning_modules`, `learning_path_modules`, `templates`, `tools`, `tool_categories`, `community_categories`, `forum_posts` (community), `platform_guides`, `niches`, `niche_categories`, plus events/challenges if used.
- **RPCs:** `increment_article_views`, `increment_template_download`, `increment_guide_views`, `increment_event_participants`, `increment_challenge_participants`.

### 2.2 Full table list (from your schema)

Ensure each is either migrated or explicitly deprecated:

- `profiles` (depends on: `auth.users` – handled by new auth)
- `content_categories`, `articles`, `article_tags`, `article_related`
- `learning_paths`, `learning_modules`, `learning_path_modules`
- `templates`, `content_tools`, `tools`, `tool_categories`, `template_tools`
- `platform_guides`, `platform_content_templates`
- `community_categories`, `forum_posts`, `post_replies`, `post_upvotes`
- `niches`, `niche_categories`, `niche_analysis`, `niche_case_studies`, `niche_content_ideas`
- `products`, `product_categories`, `product_variants`, `orders`, `order_items`
- `courses`, `course_modules`, `course_lessons`, `student_progress`, `user_learning_progress`
- `affiliate_programs`, `affiliate_links`, `affiliate_clicks`, `affiliate_commissions`, `user_affiliate_clicks`
- `email_sequences`, `email_campaigns`, `email_subscribers`, `lead_magnets`
- `webinars`, `webinar_registrations`
- `conversions`, `page_views`, `user_events`, `support_tickets`, `ticket_replies`
- `subscriptions`, `digital_assets`
- `profiles` E-E-A-T fields: `job_title`, `company_name`, `social_links`, `credentials`, `knows_about`, `verified_expert`

### 2.3 Backup Supabase

1. **Database:** Supabase Dashboard → Database → Backups, or run `pg_dump` if you have DB access. Keep a full dump before any migration run.
2. **Storage:** If you use Supabase Storage for avatars/files, download all buckets to a safe location.
3. **Auth:** Export user list (Dashboard → Authentication → Users) or use Admin API to get emails and metadata for Clerk/Auth0 import if needed.

---

## 3. Phase 1: Convex Project & Schema

### 3.1 Create Convex project (separate from production)

```bash
# In your repo root (e.g. faceless)
npm install convex
npx convex dev
```

- Sign in / create Convex account when prompted.
- This creates `convex/` and `.env.local` with `VITE_CONVEX_URL` (or `CONVEX_URL`). Use a **new** Convex project for migration (e.g. “contentanonymity-migration”) so production Supabase is untouched.

### 3.2 Add Convex schema

- The Convex schema is in **`convex/schema.ts`**. It mirrors your full PostgreSQL schema.
- Convex uses `defineSchema` / `defineTable` (from `convex/server`) and validators from `convex/values`. All tables are defined; relations use `v.id("tableName")` or `v.optional(v.id("tableName"))`.
- **Field names** are camelCase (e.g. `authorId`, `createdAt`). During import, map Supabase snake_case to these.
- **Optional:** Each table supports `legacyId: v.optional(v.string())` to store the original UUID for mapping and debugging.
- **Profiles:** `userId` is a string (external auth id, e.g. Clerk). No `auth.users` table in Convex.
- **Timestamps:** All timestamp fields are `v.number()` (ms since epoch). Convert ISO strings when importing.
- Run `npx convex dev`; Convex will apply the schema. Fix any type errors before proceeding.

### 3.3 Dependency order for data import

Insert data in this order (so referenced tables exist when you resolve FKs):

1. **No dependencies:** `content_categories`, `tool_categories`, `niche_categories`, `community_categories`, `product_categories`, `lead_magnets`, `email_sequences`, `affiliate_programs`, `learning_paths`, `learning_path_modules`, `platform_content_templates`, `niche_analysis`, `niches`.
2. **Profiles:** After users exist in Clerk/Auth0, create `profiles` (or seed from Supabase export with a temporary “legacy user id” and map later).
3. **Depends on profiles + categories:** `articles`, `article_tags`, `article_related`, `forum_posts`, `platform_guides`, `products`, `courses`, `webinars`, `support_tickets`, `templates`, `tools`, `template_tools`, `content_tools`, `affiliate_links`, `email_campaigns`, `email_subscribers`.
4. **Depends on courses/products/events:** `course_modules`, `course_lessons`, `learning_modules`, `order_items`, `digital_assets`, `webinar_registrations`, `subscriptions`, `student_progress`, `user_learning_progress`, `post_replies`, `post_upvotes`, `affiliate_clicks`, `affiliate_commissions`, `user_affiliate_clicks`, `conversions`, `page_views`, `user_events`, `ticket_replies`, `orders`, `niche_case_studies`, `niche_content_ideas`.

(Order can be refined; the rule is: **parent table before child table**, and any table that references `profiles` comes after profiles.)

---

## 4. Phase 2: Data Export from Supabase

### 4.1 Export scripts (Node or Supabase SQL)

- Use Supabase **anon** or **service_role** client in a one-off script (not in the frontend). For each table:

```ts
const { data, error } = await supabase.from('articles').select('*');
// Write data to JSON/NDJSON: e.g. articles.json
```

- Export **every** table you care about. For large tables, paginate with `.range()`.
- Store outputs in a folder, e.g. `migration-data/2026-01-28/articles.json`, and keep a manifest (list of tables + row counts).

### 4.2 Normalize data for Convex

- **Timestamps:** Convex typically uses **numbers** (ms since epoch). Convert `created_at` / `updated_at` / `published_at` from ISO strings to `Date.parse(x)` (or keep as string in schema if you use `v.string()` for now; schema in this guide uses numbers where it matters).
- **UUIDs:** Keep them in the export; you’ll use them only to build `oldUuid → _id` maps during import.
- **Arrays:** PostgreSQL arrays become JSON arrays; Convex `v.array(v.string())` etc. match.
- **JSONB:** Becomes plain objects; Convex `v.any()` or specific object validators.

### 4.3 Verify export

- Row counts per table (e.g. from Supabase Dashboard or `SELECT count(*)`) vs line counts in your JSON files.
- Spot-check a few rows (articles, profiles, learning_paths) to ensure no truncation or encoding issues.

---

## 5. Phase 3: Data Import into Convex

### 5.1 Approach

- Use Convex **mutations** or **actions** that insert one or many documents. Prefer a **Node script** that uses Convex client (or HTTP API) so you can run it once with the exported JSON.
- Maintain a **mapping** per table: `Map<oldUuid, Id<"tableName">>`.

### 5.2 Example: insert categories then articles

1. Read `content_categories.json`.
2. For each row, call a Convex mutation that inserts a document and returns `_id`. Store `row.id (uuid) → _id`.
3. Read `articles.json`. For each row, resolve `category_id` and `author_id` via the maps (category_id → content_categories._id, author_id → profiles._id). Insert article and store `row.id → _id`.

### 5.3 Handling optional / missing references

- If `author_id` or `category_id` is null, store `undefined` or omit the field in Convex (schema uses `v.optional(v.id("…"))` where appropriate).
- If a referenced row was not exported (e.g. missing profile), either skip the row, insert with null reference, or create a “placeholder” profile and map that UUID.

### 5.4 Uniqueness

- Convex does not enforce unique constraints like PostgreSQL. Preserve uniqueness in your import logic (e.g. one insert per `slug` for articles, one per `email` for profiles) and add **indexes** in the schema (e.g. `.index("by_slug", ["slug"])`) so queries are fast and you can enforce “unique slug” in application code or a mutation.

### 5.5 Post-import checks

- Compare document counts per table in Convex Dashboard vs Supabase.
- For critical entities (articles, profiles, learning paths), spot-check a few by slug or email and confirm relations (e.g. article → category, article → author) look correct.

---

## 6. Phase 4: Auth Migration

### 6.1 Recommended: Clerk + Convex

1. Create a Clerk application (dashboard.clerk.com).
2. In your React app: `npm install @clerk/clerk-react`. Wrap the app with `<ClerkProvider>` and use `VITE_CLERK_PUBLISHABLE_KEY` (and backend key for Convex).
3. Convex: `npm install convex-helpers` (optional) and use Convex’s Clerk integration so that Convex queries/mutations receive the authenticated user id.
4. **User migration:**  
   - **Option A:** Let users re-sign-up; old Supabase users use “forgot password” on the new flow (Clerk).  
   - **Option B:** Use Clerk’s API or Bulk User Import to create users from your Supabase export; send invite emails or set temporary passwords.  
   - In both cases, ensure `profiles` in Convex is keyed by Clerk `userId` (or your chosen stable id) and that existing `profiles` data is attached to that id (e.g. during import you create profiles with a `legacySupabaseUserId` and then run a one-off script that sets Clerk user id from a mapping file).

### 6.2 Convex auth usage

- In Convex, read the authenticated identity (e.g. from Clerk) in queries/mutations and enforce “user can only edit their profile” etc. Same rules as today with Supabase RLS, but implemented in Convex functions.

### 6.3 Remove Supabase Auth

- Only after cutover: remove `supabase.auth.*` and Supabase provider from the app; delete or archive Supabase project when you are fully off.

---

## 7. Phase 5: Replace Supabase with Convex in Code

### 7.1 Convex provider in the app

- Install Convex React: `npm install convex`.
- In your entry (e.g. `main.tsx`):

```tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

<ConvexProvider client={convex}>
  <App />
</ConvexProvider>
```

- Use a **feature flag** or env (e.g. `VITE_USE_CONVEX=true`) so you can switch between Supabase and Convex until cutover.

### 7.2 Data access pattern change

- **Before (Supabase):** `supabase.from('articles').select('*').eq('status','published')`.
- **After (Convex):** Convex **queries** (e.g. `api.articles.list`) and **useQuery(api.articles.list)** in components. No direct table access from the client.

### 7.3 Per-hook migration

- **useArticles:** Replace Supabase fetch with `useQuery(api.articles.list, { status: 'published', ... })` and optional `usePaginatedQuery` if you had pagination. Move filters (category, search) into the Convex query or pass as args.
- **useLearningPaths:** Same idea; `useQuery(api.learningPaths.list, { ... })` and join modules in the Convex query.
- **useTools,** **useTemplates,** **usePlatformGuides,** **useNiches,** **useCommunityPosts,** **useEvents,** **useChallenges,** **useMembers,** **useUser:** Same pattern: define Convex queries (and mutations where you write data), then replace Supabase calls with `useQuery` / `useMutation`.

### 7.4 Detail pages (e.g. article by slug)

- **Before:** `supabase.from('articles').select(...).eq('slug', slug).single()`.  
- **After:** `useQuery(api.articles.getBySlug, { slug })`. Implement `getBySlug` in Convex that returns the document (and optionally category/author if you denormalize or do a second query).

### 7.5 File mapping (summary)

- `src/lib/supabase.ts` → Keep for a while behind a feature flag, or replace with a thin “data layer” that calls Convex when `VITE_USE_CONVEX=true`. Eventually remove.
- `src/contexts/AuthContext.tsx` → Use Clerk’s `useUser`, `useAuth` (or Convex auth) instead of Supabase auth.
- `src/hooks/useArticles.ts` → Use Convex `api.articles.*` and `useQuery`/`useMutation`.
- Same for other hooks under `src/hooks/`.
- `src/pages/ArticleDetail.tsx` → Use Convex query for article + Convex mutation for view increment.
- `src/components/RelatedContent.tsx`, `ContributorCard.tsx` → Use Convex queries for related articles and profile.
- Any component that reads from `supabase` → Switch to Convex queries/mutations.

---

## 8. Phase 6: RPCs → Convex Mutations

Replace each Supabase RPC with a Convex mutation:

| Supabase RPC | Convex mutation (example name) | Behavior |
|--------------|-------------------------------|----------|
| `increment_article_views` | `articles.incrementViews` | Receive `articleId` (or slug), increment view count. |
| `increment_template_download` | `templates.incrementDownloads` | Same for template. |
| `increment_guide_views` | `platformGuides.incrementViews` | Same for guide. |
| `increment_event_participants` | `events.incrementParticipants` | Same for event. |
| `increment_challenge_participants` | `challenges.incrementParticipants` | Same for challenge. |

Implement these in `convex/articles.ts`, `convex/templates.ts`, etc., and call them with `useMutation` from the frontend so the live site behavior (view counts, download counts) stays the same.

---

## 9. Phase 7: Testing & Parity Checklist

### 9.1 Staging / preview URL

- Deploy the app (e.g. Vercel/Netlify) with `VITE_USE_CONVEX=true` and Convex + Clerk env vars. Use a **staging** Convex project and Clerk instance so production Supabase is untouched.
- Point a subdomain (e.g. `staging.contentanonymity.com`) or preview URL to this build.

### 9.2 Parity checklist (countercheck with original)

- [ ] **Homepage** loads; featured/content sections come from Convex.
- [ ] **Blog index** lists articles (same count and order as production, or acceptable difference).
- [ ] **Article detail** by slug: same article, category, author, tags; view count increments.
- [ ] **Learning paths** list and detail: paths and modules match.
- [ ] **Tools** list and comparison: tools and categories match.
- [ ] **Templates** list and download: download count increments.
- [ ] **Platform guides** list and detail: guide content and view count.
- [ ] **Niches** (if used): list and data match.
- [ ] **Community** (forum): categories, posts, replies if used.
- [ ] **Events / Challenges:** list and registration/participation increments.
- [ ] **Auth:** Sign up, sign in, OAuth (if applicable), sign out; profile creation/update.
- [ ] **Dashboard** (logged-in): user-specific data (progress, posts, etc.) from Convex.
- [ ] **SEO:** Same slugs and URLs; meta and structured data still correct (you may still use the same SEO component; only data source changes).
- [ ] **Sitemap:** If generated from DB, regenerate from Convex (e.g. script that calls Convex to get all article slugs and static routes) and confirm same or acceptable URLs.

### 9.3 Performance

- Compare LCP and interaction latency on a few key pages (home, blog index, one article). Convex’s reactive model and CDN can improve perceived performance; fix any regressions (e.g. over-fetching, N+1) in Convex queries.

---

## 10. Phase 8: Cutover & Post-Migration

### 10.1 Final sync (optional)

- If you can afford a short maintenance window: run a last export from Supabase (only changed tables since last export) and re-run import or a “delta” import into Convex so Convex is as up-to-date as possible.
- Alternatively: announce a read-only period, then one final full export/import and cutover.

### 10.2 Switch production to Convex

- Set production env to use Convex (e.g. `VITE_CONVEX_URL` for production Convex project) and Clerk production keys.
- Remove or disable Supabase in production (stop using `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in production build).
- Deploy. Monitor errors and Convex dashboard (usage, function logs).

### 10.3 Post-migration

- Keep Supabase project and backup for at least 30 days. Then you can deactivate or delete.
- Update docs (e.g. README, runbooks) to describe Convex + Clerk and how to run migrations or seed data.
- If you had sitemap generation from Supabase, ensure it now uses Convex (or static export from Convex) and resubmit sitemap in GSC if needed.

---

## 11. Rollback Plan

- **Before cutover:** Production still uses Supabase; no rollback needed for production.
- **After cutover:** If critical issues appear:
  1. Revert the deployment to the previous build (Supabase-backed).
  2. Re-enable Supabase env vars and point domain back to that build.
  3. Investigate Convex/staging in parallel; fix and re-cutover when ready.
- **Data:** Do not delete Supabase backup until you are confident Convex has been the single source of truth for long enough and you have verified backups of Convex (Convex provides backups; confirm retention).

---

## 12. File Mapping: Supabase → Convex

| Responsibility | Supabase (current) | Convex (after) |
|----------------|--------------------|----------------|
| DB schema | PostgreSQL (Supabase Dashboard / migrations) | `convex/schema.ts` |
| List articles | `useArticles` → `supabase.from('articles').select(...)` | `useQuery(api.articles.list, args)` |
| Article by slug | `supabase.from('articles').select(...).eq('slug', slug)` | `useQuery(api.articles.getBySlug, { slug })` |
| Increment views | `supabase.rpc('increment_article_views', { ... })` | `useMutation(api.articles.incrementViews)` |
| Auth state | `supabase.auth.getSession()`, `onAuthStateChange` | Clerk `useUser()` / `useAuth()` |
| Profile by user id | `supabase.from('profiles').select(...).eq('user_id', id)` | `useQuery(api.profiles.get, { userId })` |
| Learning paths | `useLearningPaths` → Supabase | `useQuery(api.learningPaths.list)` + `api.learningPaths.getById` |
| Tools / Templates / Guides / Niches / Community / Events / Challenges | Respective hooks → Supabase | Convex queries/mutations per domain |
| Types | `src/lib/supabase.ts` (Profile, Article, …) | Convex-inferred types from `api` + optional shared types in `src/lib/convex.ts` |

---

## Convex schema (summary)

The file `convex/schema.ts` (provided separately) defines all tables from your PostgreSQL schema with Convex types. Main mappings:

- **UUID primary key** → Convex assigns `_id`; store old UUID in `legacyId` only if needed.
- **Foreign keys** → `v.id("referencedTable")` or `v.optional(v.id("referencedTable"))`.
- **timestamptz** → `v.number()` (ms) or `v.optional(v.number())`.
- **text/varchar** → `v.string()` or `v.optional(v.string())`.
- **jsonb** → `v.any()` or a specific object validator.
- **array** → `v.array(v.string())` etc.
- **boolean** → `v.boolean()`; **numeric** → `v.number()`.

Indexes are added for fields you query often (e.g. `slug`, `email`, `user_id`, `status`, `published_at`). Add more in schema as you implement queries.

---

**End of migration guide.** Proceed phase by phase; run Phase 0 and 1 first, then export/import (Phases 2–3), then auth (Phase 4), then code replacement (Phases 5–6), then testing (Phase 7) and cutover (Phase 8). Use the parity checklist to countercheck with the original site until full migration is successful.
