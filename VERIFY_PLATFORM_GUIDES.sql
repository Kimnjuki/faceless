-- ============================================================================
-- VERIFY YOUR PLATFORM GUIDES DATA
-- Run this to check if your inserted guides are accessible
-- ============================================================================

-- 1. Check all platform guides (including unpublished)
SELECT 
  id,
  title,
  slug,
  platform,
  published,
  published_at,
  created_at
FROM public.platform_guides
ORDER BY created_at DESC;

-- 2. Check only published guides (what the app shows)
SELECT 
  id,
  title,
  slug,
  platform,
  category,
  published,
  published_at
FROM public.platform_guides
WHERE published = true
ORDER BY published_at DESC;

-- 3. Count published vs unpublished
SELECT 
  published,
  COUNT(*) as count
FROM public.platform_guides
GROUP BY published;

-- 4. Check if RLS is blocking access
SELECT 
  'RLS Policy Check' as check_type,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'platform_guides';

-- 5. Test direct query (simulates what the app does)
SELECT COUNT(*) as accessible_published_guides
FROM public.platform_guides
WHERE published = true;

-- ============================================================================
-- FIX: If guides exist but are not published
-- ============================================================================

-- Uncomment and run this if your guides have published = false:
-- UPDATE public.platform_guides 
-- SET published = true, 
--     published_at = COALESCE(published_at, NOW())
-- WHERE published = false 
--   AND title IS NOT NULL;

-- ============================================================================
-- FIX: If RLS policy is missing or incorrect
-- ============================================================================

ALTER TABLE public.platform_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published platform guides" ON public.platform_guides;

CREATE POLICY "Anyone can read published platform guides" 
ON public.platform_guides 
FOR SELECT 
USING (published = true);

-- Verify policy was created
SELECT 
  'Policy Created' as status,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'platform_guides'
  AND policyname = 'Anyone can read published platform guides';









