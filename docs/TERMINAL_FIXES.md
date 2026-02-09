# Terminal Errors – What Went Wrong & How to Fix

## 1. `'>' is not recognized` / `'$' is not recognized`

**What happened:** You pasted a **multi-line block** that included:
- Prompt symbols: `>`, `$`
- Comment lines: `# or`

PowerShell tried to run each line. It treated `>` and `$` as commands, so you saw "The term '>' is not recognized".

**Fix:** Run **one command per line**. Do not paste blocks that start with `>`, `$`, or `#` as if they were commands. Copy only the actual command, e.g.:

```powershell
supabase link --project-ref fvvpfueoaacijowkpdsf
```

---

## 2. `supabase : The term 'supabase' is not recognized`

**What happened:** The **Supabase CLI** is not installed (or not on your PATH). So when you ran `supabase link ...` or `supabase db push`, PowerShell couldn’t find `supabase`.

**Fix (only if you still need Supabase CLI):**

```powershell
npm install -g supabase
```

Then run your Supabase command again.  
If you’re **migrating to Convex**, you may not need the Supabase CLI for day-to-day work; you can use the Supabase Dashboard and the export script (`node scripts/export-supabase.mjs`) instead.

---

## 3. `CSV not found: ...\articles_rows.csv`

**What happened:** The import script looks for a file named `articles_rows.csv`. It either:
- Looks in the **project root** (`C:\Users\Administrator\Downloads\faceless\articles_rows.csv`), or
- Uses the path you pass. When you passed `path/to/articles_rows.csv`, it was treated as a relative path, so it looked for `...\faceless\path\to\articles_rows.csv`, which doesn’t exist.

**Fix – choose one:**

**Option A – Put the CSV in the project root**  
Save or copy your CSV as:

```
C:\Users\Administrator\Downloads\faceless\articles_rows.csv
```

Then run:

```powershell
npm run import-articles
```

**Option B – Pass the real path to your CSV**  
If the file is elsewhere (e.g. Desktop or Downloads), use the **full path** in quotes:

```powershell
node scripts/import-articles-from-csv.mjs "C:\Users\Administrator\Downloads\articles_rows.csv"
```

Use your actual path and filename.

**Option C – Export from Supabase first**  
If you don’t have a CSV yet:

1. Run the Supabase export script (uses your existing Supabase env vars):
   ```powershell
   node scripts/export-supabase.mjs
   ```
2. That creates `migration-data\<date>\articles.json`.
3. You can either convert that JSON to CSV and use the import script, or write a small script that reads `articles.json` and calls the Convex `importArticle` mutation for each row.

---

## 4. `Path articles_convex_import.json does not exist`

**What happened:** You ran:

```powershell
npx convex import --table articles articles_convex_import.json
```

The Convex CLI tried to read a file named `articles_convex_import.json` in the current directory, and that file doesn’t exist.

**Fix:**  
Use the CSV import flow instead:

1. Have `articles_rows.csv` in the project root or pass its full path (see section 3).
2. Run: `npm run import-articles` or:
   ```powershell
   node scripts/import-articles-from-csv.mjs "C:\full\path\to\articles_rows.csv"
   ```

If you prefer to use `convex import`, create the JSON file in the format Convex expects and put it in the project folder before running the command.

---

## Quick reference

| Goal                     | Command (run one at a time) |
|--------------------------|-----------------------------|
| Start Convex             | `npx convex dev`            |
| Import articles from CSV | `npm run import-articles`  |
| Import from specific CSV | `node scripts/import-articles-from-csv.mjs "C:\path\to\file.csv"` |
| Export from Supabase     | `node scripts/export-supabase.mjs` |

Always run **one command per line**; avoid pasting blocks that contain `>`, `$`, or `#` as part of the command.
