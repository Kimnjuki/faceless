# CSV Import Troubleshooting

## Problem: "No CSV files found" or "All tables skipped"

The import script looks for CSV files in the **project root** with **exact table names**. If your CSV files have different names or are in a different location, they won't be found.

---

## Step 1: Check what CSV files you have

Run this helper script to see what CSV files exist:

```powershell
node scripts/list-csv-files.mjs
```

This will show:
- All CSV files found in the project root
- Which tables they match (if any)
- Expected table names

---

## Step 2: Verify CSV file location

CSV files must be in the **project root**:

```
C:\Users\Administrator\Downloads\faceless\
  ├── content_categories.csv  ← Here
  ├── articles.csv            ← Here
  ├── profiles.csv            ← Here
  └── ...
```

**Not** in subfolders like:
- `migration-data/`
- `csv/`
- `data/`

---

## Step 3: Check CSV file names

CSV files must match table names **exactly** (case-insensitive):

| ✅ Correct | ❌ Wrong |
|------------|----------|
| `content_categories.csv` | `ContentCategories.csv` |
| `articles.csv` | `articles_rows.csv` |
| `profiles.csv` | `users.csv` |
| `learning_paths.csv` | `learning-paths.csv` |

**Pattern:** `table_name.csv` (snake_case, lowercase)

---

## Step 4: Rename CSV files if needed

If your CSV files have different names, rename them to match the table names:

**Example:** If you have `articles_rows.csv`, rename it to `articles.csv`:

```powershell
# In PowerShell, from project root:
Rename-Item -Path "articles_rows.csv" -NewName "articles.csv"
```

Or rename multiple files:

```powershell
Rename-Item -Path "content_categories_rows.csv" -NewName "content_categories.csv"
Rename-Item -Path "profiles_rows.csv" -NewName "profiles.csv"
# ... etc
```

---

## Step 5: Re-run the import

After renaming, run the import again:

```powershell
npm run import-all
```

Or:

```powershell
node scripts/import-all-from-csv.mjs
```

The script will now:
- List all CSV files found
- Show which tables are being imported
- Skip tables without CSV files (with a message)

---

## Common issues

### Issue: CSV files exported from Supabase have different names

**Solution:** Supabase exports might use names like `table_name_rows.csv`. Rename them to `table_name.csv`.

### Issue: CSV files are in a subfolder

**Solution:** Move CSV files to the project root, or update the script to look in a different folder (modify `root` variable in `scripts/import-all-from-csv.mjs`).

### Issue: CSV files have uppercase names

**Solution:** The script now handles case-insensitive matching, but it's best to rename to lowercase (e.g. `Articles.csv` → `articles.csv`).

---

## Quick check: What should I see?

When you run `npm run import-all`, you should see:

```
✓ Found 5 CSV file(s) in project root:
  - content_categories.csv
  - articles.csv
  - profiles.csv
  - learning_paths.csv
  - tools.csv

content_categories: 10 inserted, 0 errors
articles: 25 inserted, 0 errors
profiles: 5 inserted, 0 errors
...

Total: 40 inserted, 0 errors
```

If you see **"No CSV files found"**, check:
1. CSV files are in the project root (not a subfolder)
2. File names match table names exactly
3. Files have `.csv` extension

---

## Still stuck?

1. Run `node scripts/list-csv-files.mjs` to see what files exist
2. Check the exact filenames in Windows Explorer
3. Compare with the expected table names in `docs/IMPORT_ALL_CSV_STEPS.md`
4. Rename files to match if needed
