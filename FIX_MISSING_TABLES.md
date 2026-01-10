# Fix Missing Tables Error

## Problem
You're seeing this error:
```
Could not find the table 'public.templates' in the schema cache
```

This happens because some required database tables don't exist in your Supabase project.

## Solution

### Step 1: Run the SQL Script

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `MISSING_TABLES_SETUP.sql`
4. Click **Run** (or press Ctrl+Enter)

This will create:
- ✅ `templates` table
- ✅ `content_categories` table  
- ✅ `articles` table
- ✅ `article_tags` table

### Step 2: Refresh Schema Cache (if needed)

If you still see errors after creating the tables:

1. In Supabase Dashboard, go to **Settings** → **API**
2. Scroll down and click **Refresh Schema Cache**
3. Wait a few seconds for it to refresh

### Step 3: Verify Tables Were Created

Run this query in SQL Editor to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('templates', 'content_categories', 'articles', 'article_tags')
ORDER BY table_name;
```

You should see all 4 tables listed.

### Step 4: Test Your Application

1. Refresh your application in the browser
2. Navigate to `/blog` - articles should load (empty list is fine if no articles exist)
3. Navigate to `/resources/templates` - templates page should load without errors

## What These Tables Are For

- **templates**: Stores downloadable content templates (scripts, checklists, etc.)
- **content_categories**: Organizes articles into categories
- **articles**: Blog posts and content strategy articles
- **article_tags**: Tags for articles (many-to-many relationship)

## Adding Sample Data (Optional)

After creating the tables, you can add sample data:

### Add a Sample Article

```sql
INSERT INTO public.articles (
  title,
  slug,
  excerpt,
  content,
  status,
  published_at
) VALUES (
  'Getting Started with Faceless Content',
  'getting-started-faceless-content',
  'Learn the basics of building a faceless content business',
  'This is your first article content. Edit it in Supabase or through your admin panel.',
  'published',
  NOW()
);
```

### Add Sample Templates

```sql
INSERT INTO public.templates (
  title,
  platform,
  type,
  download_url,
  description
) VALUES (
  'YouTube Hook Template',
  'YouTube',
  'script',
  'https://example.com/template.pdf',
  'A proven template for creating engaging YouTube hooks'
);
```

## Troubleshooting

### Still seeing errors?

1. **Check RLS Policies**: Make sure Row Level Security policies are set correctly (the SQL script includes these)

2. **Check Table Names**: Ensure table names match exactly (case-sensitive in some cases)

3. **Check Permissions**: Verify your Supabase anon key has the correct permissions

4. **Clear Browser Cache**: Sometimes cached errors persist - try hard refresh (Ctrl+Shift+R)

5. **Check Supabase Logs**: Go to **Logs** → **Postgres Logs** to see detailed error messages

## Need Help?

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Check Supabase logs for database errors
3. Verify your `.env` file has the correct Supabase URL and anon key



