# Step-by-Step: Import All Supabase CSV Tables into Convex

Use this when you have exported **all** Supabase tables as CSV files in the project root and want to load them into Convex in one run (like the articles import).

---

## Prerequisites

- Convex project linked and running (`npx convex dev` has been run at least once).
- All CSV files in the **project root** with these exact names (one per table):

  `content_categories.csv`, `tool_categories.csv`, `niche_categories.csv`, `community_categories.csv`, `product_categories.csv`, `affiliate_programs.csv`, `lead_magnets.csv`, `email_sequences.csv`, `learning_paths.csv`, `learning_path_modules.csv`, `platform_content_templates.csv`, `niche_analysis.csv`, `niches.csv`, `profiles.csv`, `articles.csv`, `article_tags.csv`, `article_related.csv`, `forum_posts.csv`, `platform_guides.csv`, `products.csv`, `product_variants.csv`, `courses.csv`, `webinars.csv`, `support_tickets.csv`, `templates.csv`, `tools.csv`, `template_tools.csv`, `content_tools.csv`, `affiliate_links.csv`, `email_campaigns.csv`, `email_subscribers.csv`, `course_modules.csv`, `course_lessons.csv`, `learning_modules.csv`, `orders.csv`, `order_items.csv`, `digital_assets.csv`, `webinar_registrations.csv`, `subscriptions.csv`, `student_progress.csv`, `user_learning_progress.csv`, `post_replies.csv`, `post_upvotes.csv`, `affiliate_clicks.csv`, `affiliate_commissions.csv`, `user_affiliate_clicks.csv`, `conversions.csv`, `page_views.csv`, `user_events.csv`, `ticket_replies.csv`, `niche_case_studies.csv`, `niche_content_ideas.csv`

- You **do not** need every file. Missing CSVs are skipped. Import order is fixed so foreign keys resolve (e.g. `content_categories` before `articles`).

---

## Steps (run in order)

### Step 1: Start Convex dev server

In a terminal, from the project root:

```powershell
npx convex dev
```

Leave this running. Wait until you see **"Convex functions ready!"**.

---

### Step 2: Confirm Convex URL in env

Ensure `.env.local` has either:

- `CONVEX_URL=...` or  
- `VITE_CONVEX_URL=...`

(These are usually set when you run `npx convex dev`.)

---

### Step 3: Run the full import script

In a **second** terminal, from the project root:

```powershell
node scripts/import-all-from-csv.mjs
```

Or use the npm script:

```powershell
npm run import-all
```

The script will:

1. Process tables in **dependency order** (categories → profiles → articles → …).
2. For each table, read the matching CSV (e.g. `content_categories.csv`).
3. Convert each row: snake_case → camelCase, timestamps → ms, resolve FKs from previous tables.
4. Call Convex `import.insertDocument` for each row and store the new `_id` for later FK resolution.
5. Skip tables whose CSV is missing (with a "Skip … (no … .csv)" message).
6. Print per-table counts: `tableName: X inserted, Y errors`.

---

### Step 4: Check the output

- **"X inserted, 0 errors"** → Import for that table succeeded.
- **"X inserted, Y errors"** → Some rows failed (first few errors are printed). Fix CSV or schema and re-run if needed.
- **"Skip … (no … .csv)"** → That table was skipped because the CSV was missing (optional table).

At the end you’ll see a **Total: X inserted, Y errors**.

---

### Step 5: Verify in Convex Dashboard

1. Open [Convex Dashboard](https://dashboard.convex.dev).
2. Select your project.
3. Go to **Data** and check a few tables (e.g. `content_categories`, `articles`, `profiles`).
4. Confirm row counts and that relations look correct (e.g. articles have `categoryId` / `authorId`).

---

## If something goes wrong

| Issue | What to do |
|--------|------------|
| **"CONVEX_URL or VITE_CONVEX_URL" missing** | Run `npx convex dev` once; it writes URL to `.env.local`. Or add `VITE_CONVEX_URL=...` manually from the Convex dashboard. |
| **"No CSV files found"** | Check that CSV files are in the **project root**. Run `node scripts/list-csv-files.mjs` to see what files exist. CSV files must match table names exactly (e.g. `content_categories.csv`, `articles.csv`). |
| **All tables skipped** | CSV files might be named differently. Check filenames: they should be `table_name.csv` (snake_case). If your files have different names (e.g. `ContentCategories.csv` or `articles_rows.csv`), rename them to match the table name. |
| **Schema validation errors** | Convex validates each document. Fix the CSV (required fields, types) or adjust the script’s `rowToDoc` / defaults for that table. |
| **FK resolution wrong** | Import order is fixed. If a referenced row is missing (e.g. no profile for `author_id`), that field is left undefined. Re-export Supabase so parent rows exist, or fix CSV. |

---

## Import order (for reference)

Tables are imported in this order so that every foreign key points to an already-imported row:

1. content_categories, tool_categories, niche_categories, community_categories, product_categories  
2. affiliate_programs, lead_magnets, email_sequences, learning_paths, learning_path_modules  
3. platform_content_templates, niche_analysis, niches  
4. profiles  
5. articles, article_tags, article_related, forum_posts, platform_guides  
6. products, product_variants, courses, webinars, support_tickets  
7. templates, tools, template_tools, content_tools, affiliate_links  
8. email_campaigns, email_subscribers  
9. course_modules, course_lessons, learning_modules  
10. orders, order_items, digital_assets, webinar_registrations, subscriptions  
11. student_progress, user_learning_progress  
12. post_replies, post_upvotes  
13. affiliate_clicks, affiliate_commissions, user_affiliate_clicks  
14. conversions, page_views, user_events, ticket_replies  
15. niche_case_studies, niche_content_ideas  

---

## One-off: import only some tables

You can temporarily comment out tables in `scripts/import-all-from-csv.mjs` (in the `TABLE_CONFIG` array) so only the CSVs you have are processed. Keep the **order** the same so dependencies still resolve (e.g. keep `content_categories` before `articles`).
