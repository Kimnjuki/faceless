-- ============================================================================
-- VERIFY TABLES EXIST
-- Run this to check if tables were created successfully
-- ============================================================================

-- Check if tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('templates', 'content_categories', 'articles', 'article_tags')
ORDER BY table_name;

-- Check table structures
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('templates', 'content_categories', 'articles', 'article_tags')
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('templates', 'content_categories', 'articles', 'article_tags')
ORDER BY tablename, policyname;






