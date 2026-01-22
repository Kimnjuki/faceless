# Fix Duplicate Articles Checklist System

## Problem
Articles are appearing in multiple topics/categories, causing duplicate content issues. The generic "faceless content business" article is likely appearing across multiple categories.

## Checklist System

### Phase 1: Diagnosis ✅
- [x] Created SQL script to identify duplicate articles
- [ ] Run diagnosis queries in Supabase SQL Editor
- [ ] Document findings

### Phase 2: Analysis
- [ ] Identify root cause:
  - [ ] Duplicate articles with same title
  - [ ] Duplicate articles with same slug
  - [ ] Same article assigned to multiple categories
  - [ ] Articles with identical/similar content

### Phase 3: Fix Strategy
- [ ] Decide on fix approach:
  - [ ] Archive duplicates (keep oldest)
  - [ ] Merge duplicates
  - [ ] Reassign categories
  - [ ] Delete duplicates

### Phase 4: Implementation
- [ ] Execute fix SQL scripts
- [ ] Verify fixes
- [ ] Update frontend to prevent duplicates

### Phase 5: Prevention
- [ ] Add unique constraints
- [ ] Update article creation logic
- [ ] Add validation checks

## How to Use

### Step 1: Run Diagnosis
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run `CHECK_DUPLICATE_ARTICLES.sql`
4. Review each STEP (1-6) results

### Step 2: Analyze Results
- **STEP 1**: Shows duplicate titles
- **STEP 2**: Shows duplicate slugs
- **STEP 3**: Shows same content in multiple categories
- **STEP 4**: Shows similar content (potential duplicates)
- **STEP 5**: Lists all articles for manual review
- **STEP 6**: Finds the specific generic article

### Step 3: Choose Fix Option
Based on results, choose one of the FIX OPTIONS:
- **OPTION 1**: Archive duplicates by title (keep oldest)
- **OPTION 2**: Archive duplicates by slug (keep oldest)
- **OPTION 3**: Archive duplicates by content hash (keep one per category)
- **OPTION 4**: Reassign category for generic article

### Step 4: Execute Fix
1. Uncomment the chosen fix option in the SQL script
2. Review the UPDATE statement carefully
3. Run in Supabase SQL Editor
4. Verify with STEP 1-4 queries again

### Step 5: Add Prevention
Run the PREVENTION section to add unique constraints.

## Expected Results

After fixes:
- ✅ No duplicate titles in same category
- ✅ No duplicate slugs
- ✅ Each article appears in only one category
- ✅ Generic article assigned to single appropriate category

## Frontend Updates Needed

1. **Article Fetching**: Ensure `useArticles` hook doesn't return duplicates
2. **Category Filtering**: Verify category filtering works correctly
3. **Deduplication**: Add client-side deduplication if needed

## Monitoring

After fixes, monitor:
- Article count per category
- No duplicate articles appearing
- Category filtering working correctly



