# Learning Paths Troubleshooting Guide

## Issue: "No learning paths found" Message

If you're seeing "No learning paths found" on the learning paths page, follow these steps:

---

## ✅ Step-by-Step Fix

### 1. **Check if Tables Exist in Supabase**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this query to check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('learning_paths', 'learning_modules', 'user_learning_progress');
```

**Expected Result:** You should see all three tables listed.

**If tables don't exist:** Continue to Step 2.

---

### 2. **Run the Schema Script**

1. Open the `LEARNING_PATHS_SCHEMA.sql` file in your project
2. Copy the entire contents
3. Go to Supabase → **SQL Editor**
4. Paste and run the script
5. Verify it executed successfully (should see "Success. No rows returned")

**Key parts of the script:**
- Creates `learning_paths` table
- Creates `learning_modules` table  
- Creates `user_learning_progress` table
- Sets up RLS (Row Level Security) policies
- Inserts sample data (optional)

---

### 3. **Verify RLS Policies**

The script should create these policies automatically, but verify:

```sql
-- Check RLS policies for learning_paths
SELECT * FROM pg_policies WHERE tablename = 'learning_paths';

-- Should see: "Anyone can view learning paths" policy
```

**If policies are missing**, run this:

```sql
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view learning paths" ON public.learning_paths;
CREATE POLICY "Anyone can view learning paths" ON public.learning_paths FOR SELECT USING (true);

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view learning modules" ON public.learning_modules;
CREATE POLICY "Anyone can view learning modules" ON public.learning_modules FOR SELECT USING (true);
```

---

### 4. **Check if Data Exists**

Run this query to see if learning paths exist:

```sql
SELECT id, name, track_type, difficulty_level, featured 
FROM public.learning_paths 
ORDER BY order_index;
```

**Expected Result:** Should show at least one learning path (if you ran the sample data).

**If no data exists:**
- The schema script includes sample data that should insert automatically
- If it didn't insert, you can manually add learning paths

---

### 5. **Manually Add a Learning Path (If Needed)**

If tables exist but no data, you can add a test learning path:

```sql
-- Insert a test learning path
INSERT INTO public.learning_paths (
  name, 
  track_type, 
  description, 
  estimated_duration, 
  difficulty_level, 
  order_index, 
  featured, 
  icon_name
) VALUES (
  'Faceless Content Creation',
  'beginner',
  'Complete guide to creating faceless content from scratch',
  '4 weeks',
  'beginner',
  1,
  true,
  'PlayCircle'
) RETURNING *;
```

Then add a module to it:

```sql
-- Get the path ID from the previous insert, then:
INSERT INTO public.learning_modules (
  learning_path_id,
  title,
  description,
  content_type,
  content_url,
  duration_minutes,
  order_index,
  is_free
) VALUES (
  'YOUR_PATH_ID_HERE', -- Replace with actual ID from above
  'Introduction to Faceless Content',
  'Learn the fundamentals of faceless content creation',
  'article',
  '/blog/introduction-to-faceless-content', -- Link to your article
  15,
  1,
  true
) RETURNING *;
```

---

### 6. **Check Browser Console**

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Navigate to the learning paths page
4. Look for error messages or warnings

**Common messages:**
- `✅ Fetched X learning paths from Supabase` - Success!
- `⚠️ No learning paths found in database` - Tables exist but empty
- `Error fetching learning paths: ...` - Check the error message

---

### 7. **Verify Supabase Connection**

Check your `.env` file has correct Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**To find these:**
1. Go to Supabase Dashboard
2. Click **Settings** → **API**
3. Copy **Project URL** and **anon/public key**

---

### 8. **Test the Query Directly**

Run this in Supabase SQL Editor to test the exact query the app uses:

```sql
SELECT 
  *,
  (SELECT json_agg(json_build_object(
    'id', lm.id,
    'title', lm.title,
    'description', lm.description,
    'content_type', lm.content_type,
    'content_url', lm.content_url,
    'duration_minutes', lm.duration_minutes,
    'order_index', lm.order_index,
    'is_free', lm.is_free
  ) ORDER BY lm.order_index)
  FROM learning_modules lm 
  WHERE lm.learning_path_id = lp.id
  ) as modules
FROM learning_paths lp
ORDER BY lp.order_index ASC;
```

**Expected Result:** Should return learning paths with their modules.

---

## 🔍 Common Issues & Solutions

### Issue: "Table does not exist"
**Solution:** Run `LEARNING_PATHS_SCHEMA.sql` script

### Issue: "Permission denied"
**Solution:** Check RLS policies (Step 3)

### Issue: "No rows returned"
**Solution:** Add learning paths manually (Step 5)

### Issue: Tables exist but page shows empty
**Solution:** 
1. Check browser console for errors
2. Verify RLS policies allow SELECT
3. Try refreshing the page (refresh button)

### Issue: "Failed to fetch learning paths"
**Solution:**
1. Check Supabase connection (Step 7)
2. Verify environment variables
3. Check network tab in browser DevTools

---

## ✅ Verification Checklist

- [ ] Tables exist in Supabase (`learning_paths`, `learning_modules`)
- [ ] RLS policies are set up correctly
- [ ] At least one learning path exists in database
- [ ] Environment variables are correct
- [ ] No errors in browser console
- [ ] Refresh button works on the page

---

## 🚀 Quick Fix Commands

If you need to reset everything:

```sql
-- Drop and recreate (WARNING: This deletes all data)
DROP TABLE IF EXISTS public.user_learning_progress CASCADE;
DROP TABLE IF EXISTS public.learning_modules CASCADE;
DROP TABLE IF EXISTS public.learning_paths CASCADE;

-- Then run the full LEARNING_PATHS_SCHEMA.sql script
```

---

## 📝 Still Having Issues?

1. **Check the browser console** for specific error messages
2. **Verify Supabase dashboard** shows the tables and data
3. **Test the query** directly in Supabase SQL Editor
4. **Check RLS policies** are not blocking access
5. **Verify environment variables** are loaded correctly

---

*Last Updated: January 2025*










