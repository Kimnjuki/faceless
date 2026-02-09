# Convex Migration – Detailed Next Steps

You have **connected Convex** and the schema is deployed. Follow these steps in order. Check off each item as you complete it.

---

## Where you are now

- [x] Convex project created and linked (`npx convex dev` running)
- [x] `convex/schema.ts` deployed (all 52 tables)
- [x] `convex/_generated/` has types (api, dataModel, server)
- [ ] **Next:** Export data from Supabase → Import into Convex → Auth → Code swap → Test → Cutover

---

## Phase 2: Export data from Supabase

**Goal:** Get every table’s rows into JSON files so you can import them into Convex.

### Step 2.1 – Create export folder and script

1. Create a folder for export output (do not commit large JSON to git if sensitive):
   ```
   migration-data/
     2026-01-27/          ← date of export
       articles.json
       content_categories.json
       profiles.json
       ... (one file per table)
   ```

2. Create a one-off Node script that uses the Supabase client to export tables.

   **File:** `scripts/export-supabase.js` (or `scripts/export-supabase.mjs` if you use ESM)

   - Use `@supabase/supabase-js` with **service_role** key (or anon if that’s all you have) so you can read every table.
   - For each table, run something like:
     ```js
     const { data, error } = await supabase.from('TABLE_NAME').select('*');
     // Write to migration-data/2026-01-27/TABLE_NAME.json
     ```
   - For large tables, use `.range(from, to)` and append to the file or paginate.
   - Store the list of tables and row counts in `migration-data/2026-01-27/manifest.json` (e.g. `{ "articles": 150, "profiles": 42 }`).

3. **Tables to export** (same order as in the migration guide; export all you use):
   - Categories first: `content_categories`, `tool_categories`, `niche_categories`, `community_categories`, `product_categories`
   - Then: `affiliate_programs`, `lead_magnets`, `email_sequences`, `learning_paths`, `learning_path_modules`, `platform_content_templates`, `niche_analysis`, `niches`
   - Then: `profiles` (after you decide how auth will work; see Phase 4)
   - Then: `articles`, `article_tags`, `article_related`, `forum_posts`, `platform_guides`, `products`, `courses`, `webinars`, `support_tickets`, `templates`, `tools`, `template_tools`, `content_tools`, `affiliate_links`, `email_campaigns`, `email_subscribers`
   - Then: `course_modules`, `course_lessons`, `learning_modules`, `order_items`, `digital_assets`, `webinar_registrations`, `subscriptions`, `student_progress`, `user_learning_progress`, `post_replies`, `post_upvotes`, `affiliate_clicks`, `affiliate_commissions`, `user_affiliate_clicks`, `conversions`, `page_views`, `user_events`, `ticket_replies`, `orders`, `niche_case_studies`, `niche_content_ideas`

### Step 2.2 – Normalize for Convex in the export (or during import)

- **Timestamps:** Convert `created_at`, `updated_at`, `published_at`, etc. from ISO strings to **milliseconds**: `Date.parse(row.created_at)` (or store as number when writing JSON).
- **Keep UUIDs** in the export (e.g. `id`, `author_id`, `category_id`); you will use them only to build `oldUuid → Convex _id` maps during import.
- **Nulls:** Omit optional fields that are null so Convex gets `undefined` instead of `null` if your import script passes through.

### Step 2.3 – Verify export

- [ ] Row count per table in Supabase (Dashboard or `SELECT count(*)`) matches length of array in each JSON file.
- [ ] Spot-check `articles.json`, `profiles.json`, `content_categories.json` for correct structure and no truncation.

---

## Phase 3: Import data into Convex

**Goal:** Insert exported rows into Convex in **dependency order**, and build `oldUuid → Convex _id` maps so foreign references resolve.

### Step 3.1 – Add Convex import mutations (optional but recommended)

Create mutations that insert one document and return `_id`, and optionally accept `legacyId`. Example for one table:

**File:** `convex/migrations/importContentCategories.ts` (or a single `convex/import.ts` with one mutation per table)

- Use a **mutation** that:
  - Accepts a single document (with camelCase fields and timestamps as numbers).
  - Inserts into the correct table.
  - Returns the document `_id`.
- You can do the same for each table, or one generic “import” mutation that takes `tableName` + document (less type-safe).

**Simpler approach:** Use a **Node script** that reads JSON files and calls Convex HTTP API or `ConvexHttpClient` to run a single “insert and return id” mutation per row. No need to put all import logic inside Convex.

### Step 3.2 – Import in dependency order

Use the order from the migration guide:

1. **No dependencies:**  
   Import: `content_categories`, `tool_categories`, `niche_categories`, `community_categories`, `product_categories`, `lead_magnets`, `email_sequences`, `affiliate_programs`, `learning_paths`, `learning_path_modules`, `platform_content_templates`, `niche_analysis`, `niches`.  
   For each row: insert, get `_id`, store `idMap["content_categories"][row.id] = _id`.

2. **Profiles:**  
   Import `profiles`. Map `row.user_id` (Supabase auth user id) → new Convex `_id`. Store in `idMap["profiles"]` keyed by old `id` or `user_id` (you’ll need this for articles, forum_posts, etc.).

3. **Depends on profiles + categories:**  
   Import: `articles`, `article_tags`, `article_related`, `forum_posts`, `platform_guides`, `products`, `courses`, `webinars`, `support_tickets`, `templates`, `tools`, `template_tools`, `content_tools`, `affiliate_links`, `email_campaigns`, `email_subscribers`.  
   When inserting, resolve `category_id` → `idMap["content_categories"][category_id]`, `author_id` → `idMap["profiles"][author_id]`, etc. Use Convex `Id<"tableName">` for every reference.

4. **Depends on courses/products/others:**  
   Import the rest: `course_modules`, `course_lessons`, `learning_modules`, `order_items`, `digital_assets`, `webinar_registrations`, `subscriptions`, `student_progress`, `user_learning_progress`, `post_replies`, `post_upvotes`, `affiliate_clicks`, `affiliate_commissions`, `user_affiliate_clicks`, `conversions`, `page_views`, `user_events`, `ticket_replies`, `orders`, `niche_case_studies`, `niche_content_ideas`.

### Step 3.3 – Field mapping (Supabase → Convex)

When building the document for Convex from a Supabase row:

- **Snake_case → camelCase:** e.g. `author_id` → `authorId`, `created_at` → `createdAt`.
- **Timestamps:** Already in ms (from Phase 2); set `createdAt`, `updatedAt`, `publishedAt` as numbers.
- **Optional `legacyId`:** Set `legacyId: row.id` (original UUID) for debugging.
- **References:** Replace UUID with Convex id from the map, e.g. `authorId: idMap.profiles[row.author_id]` (or omit if null).

### Step 3.4 – Post-import checks

- [ ] In Convex Dashboard → Data: document counts match (or are acceptable) vs Supabase.
- [ ] Spot-check: one article by slug, its category and author resolve correctly; one learning path and its modules.

---

## Phase 4: Auth migration (Clerk recommended)

**Goal:** Use Clerk (or Auth0) for auth so Convex never talks to Supabase Auth.

### Step 4.1 – Create Clerk application

- [ ] Go to [dashboard.clerk.com](https://dashboard.clerk.com), create an application.
- [ ] Note **Publishable Key** and **Secret Key** (backend). Add to `.env.local`:
  - `VITE_CLERK_PUBLISHABLE_KEY=pk_...`
  - `CLERK_SECRET_KEY=sk_...` (for Convex backend later)

### Step 4.2 – Install Clerk in the app

```bash
npm install @clerk/clerk-react
```

- [ ] In `src/main.tsx`, wrap the app with `<ClerkProvider publishableKey={...}>` (use `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`).
- [ ] Keep `<AuthProvider>` for now if it holds app-specific state (e.g. profile), but **replace** Supabase auth calls inside `AuthContext` with Clerk: `useUser()`, `useAuth().signIn`, `signUp`, `signOut`, etc. See Phase 5 for removing Supabase from AuthContext.

### Step 4.3 – Convex + Clerk

- [ ] In Convex Dashboard: Configure Clerk (or use `convex/auth.config.ts` if you use Convex auth config).
- [ ] In Convex queries/mutations that need “current user”, get identity from the Convex `ctx` (Clerk will pass the user id). Your `profiles` table will be keyed by this Clerk user id in `userId`.

### Step 4.4 – User migration

- **Option A:** Users re-sign up with Clerk (forgot password flow on new site).
- **Option B:** Bulk import users into Clerk from Supabase export, then attach existing `profiles` data to Clerk user ids (e.g. during import, create profiles with `userId` = Clerk id where you have a mapping from Supabase user id to Clerk id).

---

## Phase 5: Replace Supabase with Convex in code

**Goal:** App reads/writes via Convex only; no Supabase client in the frontend.

### Step 5.1 – Convex provider in the app

- [ ] In `src/main.tsx`, add:
  ```tsx
  import { ConvexProvider, ConvexReactClient } from "convex/react";

  const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
  ```
  Wrap your app (e.g. inside `HelmetProvider` / `ErrorBoundary`):
  ```tsx
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
  ```
- [ ] Add `VITE_CONVEX_URL` to `.env.local` (from Convex Dashboard or `npx convex dev` output).

### Step 5.2 – Implement Convex queries and mutations

Create Convex functions for the features you use. Suggested files and functions:

| File | Purpose |
|------|--------|
| `convex/articles.ts` | `list` (args: status, category?, limit?), `getBySlug` (slug), `incrementViews` (mutation, by slug or id) |
| `convex/contentCategories.ts` | `list` (for nav/filters) |
| `convex/learningPaths.ts` | `list`, `getById` or `getBySlug`, and modules |
| `convex/tools.ts` | `list`, `listByCategory` |
| `convex/templates.ts` | `list`, `getById`, `incrementDownloads` (mutation) |
| `convex/platformGuides.ts` | `list`, `getBySlug`, `incrementViews` (mutation) |
| `convex/niches.ts` | `list`, `listByCategory` (if used) |
| `convex/community.ts` or `convex/forumPosts.ts` | `listCategories`, `listPosts`, `getPost` |
| `convex/profiles.ts` | `getByUserId` (for current user profile) |

- [ ] Implement at least: `articles.list`, `articles.getBySlug`, `articles.incrementViews`, `contentCategories.list`, then add others as you migrate each hook.

### Step 5.3 – Replace hooks one by one

- [ ] **useArticles** (`src/hooks/useArticles.ts`): Replace Supabase `from('articles')` and `from('content_categories')` with `useQuery(api.articles.list, { ... })` and `useQuery(api.contentCategories.list)`. Use Convex types from `convex/_generated/api`.
- [ ] **ArticleDetail** (`src/pages/ArticleDetail.tsx`): Use `useQuery(api.articles.getBySlug, { slug })` and `useMutation(api.articles.incrementViews)` instead of Supabase + RPC.
- [ ] **useLearningPaths:** Switch to `useQuery(api.learningPaths.list)` and detail query.
- [ ] **useTools, useTemplates, usePlatformGuides, useNiches:** Same pattern (Convex queries/mutations).
- [ ] **useCommunityPosts:** Convex queries for categories and posts.
- [ ] **useEvents, useChallenges:** Convex queries + mutations for increment participants (replace RPCs).
- [ ] **useUser / profile:** Use Clerk `useUser()` for identity and `useQuery(api.profiles.getByUserId, { userId })` for profile document.
- [ ] **RelatedContent, ContributorCard:** Use Convex queries for related articles and author profile.

### Step 5.4 – AuthContext and auth pages

- [ ] **AuthContext** (`src/contexts/AuthContext.tsx`): Remove `supabase.auth.getSession`, `onAuthStateChange`, `signInWithPassword`, `signUp`, `signInWithOAuth`, `signOut`. Use Clerk’s `useUser()`, `useAuth().signIn`, `signUp`, `signOut`. Profile creation on sign-up: call a Convex mutation (e.g. `profiles.createOrUpdate`) instead of `supabase.from('profiles').insert`.
- [ ] **OAuthCallback** (`src/pages/auth/OAuthCallback.tsx`): Replace Supabase session check and profile insert with Clerk + Convex mutation.
- [ ] **Signup** (`src/pages/auth/Signup.tsx`): Use Clerk sign-up; after success, create/update profile via Convex.
- [ ] **useCommunityPosts, useEvents, useChallenges:** Replace `supabase.auth.getUser()` with Clerk `useUser()` (or Convex identity) for “current user” checks.

### Step 5.5 – Feature flag (optional)

- Use `VITE_USE_CONVEX=true` and branch in code so production can stay on Supabase until you flip the switch. Or migrate fully and cut over in one deploy.

---

## Phase 6: RPCs → Convex mutations

**Goal:** Every Supabase RPC has a Convex mutation and the UI calls it.

- [ ] `increment_article_views` → `articles.incrementViews` (implement in `convex/articles.ts`).
- [ ] `increment_template_download` → `templates.incrementDownloads` (in `convex/templates.ts`).
- [ ] `increment_guide_views` → `platformGuides.incrementViews` (in `convex/platformGuides.ts`).
- [ ] `increment_event_participants` → `events.incrementParticipants` (in `convex/events.ts` or similar).
- [ ] `increment_challenge_participants` → `challenges.incrementParticipants` (in `convex/challenges.ts` or similar).

Replace every `supabase.rpc(...)` call with `useMutation(api....)`.

---

## Phase 7: Testing and parity

- [ ] Run the app locally with Convex only (`VITE_CONVEX_URL` set, Supabase env removed or unused).
- [ ] **Checklist:** Homepage, blog index, article by slug (and view count), learning paths, tools, templates, platform guides, niches, community, auth (sign up, sign in, sign out, profile), dashboard, SEO/sitemap. Compare with current contentanonymity.com.
- [ ] Deploy to a **staging** URL (e.g. Vercel preview or staging.contentanonymity.com) with Convex + Clerk and run the same checklist.

---

## Phase 8: Cutover

- [ ] Final export/import if you want a last sync from Supabase.
- [ ] Set production env to Convex + Clerk; remove or disable Supabase in production build.
- [ ] Deploy production; monitor Convex Dashboard and errors.
- [ ] Keep Supabase backup for at least 30 days; update docs and sitemap generation to use Convex.

---

## Quick reference: files to touch

| Area | Files |
|------|--------|
| Convex backend | `convex/schema.ts` (done), `convex/articles.ts`, `convex/contentCategories.ts`, `convex/learningPaths.ts`, `convex/tools.ts`, `convex/templates.ts`, `convex/platformGuides.ts`, `convex/niches.ts`, `convex/profiles.ts`, `convex/community.ts` or forum, events, challenges |
| App shell | `src/main.tsx` (ConvexProvider, ClerkProvider) |
| Auth | `src/contexts/AuthContext.tsx`, `src/pages/auth/OAuthCallback.tsx`, `src/pages/auth/Signup.tsx` |
| Data hooks | `src/hooks/useArticles.ts`, `useLearningPaths.ts`, `useTools.ts`, `useTemplates.ts`, `usePlatformGuides.ts`, `useNiches.ts`, `useCommunityPosts.ts`, `useEvents.ts`, `useChallenges.ts`, `useUser.ts`, `useMembers.ts` |
| Pages | `src/pages/ArticleDetail.tsx`, `BlogIndex.tsx`, learning, tools, templates, guides, community, dashboard |
| Components | `RelatedContent.tsx`, `ContributorCard.tsx`, any component that uses Supabase |
| Env | `.env.local`: `VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (backend) |

---

**Next immediate action:** Start with **Phase 2** (export script and run export), then **Phase 3** (import script and run import in dependency order). After data is in Convex, do **Phase 5.1** (ConvexProvider) and **5.2** (first Convex queries for articles and categories), then swap **useArticles** and **ArticleDetail** to Convex so the blog works end-to-end. Then continue with auth (Phase 4) and the rest of the hooks and RPCs (Phases 5–6), then test and cut over (Phases 7–8).
