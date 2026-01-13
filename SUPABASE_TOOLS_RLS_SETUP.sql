-- ============================================================================
-- RLS (Row Level Security) Setup for Tools Tables
-- ============================================================================
-- This script ensures that the tools, tool_categories, and affiliate_links
-- tables are accessible to the public (for reading) while maintaining security.

-- ============================================================================
-- 1. TOOL_CATEGORIES TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read categories (public access)
DROP POLICY IF EXISTS "Anyone can read categories" ON tool_categories;
CREATE POLICY "Anyone can read categories"
  ON tool_categories
  FOR SELECT
  USING (true);

-- ============================================================================
-- 2. TOOLS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read tools (public access)
DROP POLICY IF EXISTS "Anyone can read tools" ON tools;
CREATE POLICY "Anyone can read tools"
  ON tools
  FOR SELECT
  USING (true);

-- ============================================================================
-- 3. AFFILIATE_LINKS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read affiliate links (public access)
DROP POLICY IF EXISTS "Anyone can read affiliate links" ON affiliate_links;
CREATE POLICY "Anyone can read affiliate links"
  ON affiliate_links
  FOR SELECT
  USING (true);

-- ============================================================================
-- 4. VERIFICATION QUERIES
-- ============================================================================

-- Check if tables exist and have data
SELECT 
  'tool_categories' as table_name,
  COUNT(*) as row_count
FROM tool_categories
UNION ALL
SELECT 
  'tools' as table_name,
  COUNT(*) as row_count
FROM tools
UNION ALL
SELECT 
  'affiliate_links' as table_name,
  COUNT(*) as row_count
FROM affiliate_links;

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('tools', 'tool_categories', 'affiliate_links')
  AND schemaname = 'public';

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('tools', 'tool_categories', 'affiliate_links')
ORDER BY tablename, policyname;











