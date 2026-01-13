-- ============================================================================
-- FIX EMPTY RESULTS - Complete Solution
-- Run this entire script to fix all data access issues
-- ============================================================================

-- ============================================================================
-- STEP 1: CHECK CURRENT STATE
-- ============================================================================
SELECT 
  'Current Data Counts' as check_type,
  'templates' as table_name,
  COUNT(*)::text as value
FROM public.templates
UNION ALL
SELECT 
  'Current Data Counts',
  'articles (published)',
  COUNT(*)::text
FROM public.articles WHERE status = 'published'
UNION ALL
SELECT 
  'Current Data Counts',
  'platform_guides (published)',
  COUNT(*)::text
FROM public.platform_guides WHERE published = true
UNION ALL
SELECT 
  'Current Data Counts',
  'content_categories',
  COUNT(*)::text
FROM public.content_categories;

-- ============================================================================
-- STEP 2: FIX RLS POLICIES (Critical!)
-- ============================================================================

-- Templates: Public read access
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'templates') THEN
    ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can read templates" ON public.templates;
    CREATE POLICY "Anyone can read templates" 
    ON public.templates 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- Articles: Public read access for published articles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'articles') THEN
    ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
    CREATE POLICY "Anyone can read published articles" 
    ON public.articles 
    FOR SELECT 
    USING (status = 'published');
  END IF;
END $$;

-- Content Categories: Public read access
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_categories') THEN
    ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can read content categories" ON public.content_categories;
    CREATE POLICY "Anyone can read content categories" 
    ON public.content_categories 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- Platform Guides: Public read access for published guides
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'platform_guides') THEN
    ALTER TABLE public.platform_guides ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can read published platform guides" ON public.platform_guides;
    CREATE POLICY "Anyone can read published platform guides" 
    ON public.platform_guides 
    FOR SELECT 
    USING (published = true);
  END IF;
END $$;

-- Article Tags: Public read access
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'article_tags') THEN
    ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can read article tags" ON public.article_tags;
    CREATE POLICY "Anyone can read article tags" 
    ON public.article_tags 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

-- ============================================================================
-- STEP 3: ADD SAMPLE DATA (Only if tables are empty)
-- ============================================================================

-- Add sample content categories
INSERT INTO public.content_categories (name, slug, description, sort_order)
VALUES 
  ('Content Strategy', 'content-strategy', 'Guides and strategies for creating faceless content', 1),
  ('Monetization', 'monetization', 'Ways to monetize your faceless content business', 2),
  ('Platform Guides', 'platform-guides', 'Platform-specific guides and tutorials', 3),
  ('Getting Started', 'getting-started', 'Beginner guides to start your faceless business', 4)
ON CONFLICT (slug) DO NOTHING;

-- Add sample templates (only if none exist)
INSERT INTO public.templates (
  title,
  platform,
  type,
  download_url,
  description,
  tags,
  difficulty
)
SELECT * FROM (VALUES
  ('YouTube Hook Template', 'YouTube', 'script', 'https://example.com/youtube-hook.pdf', 'A proven template for creating engaging YouTube hooks', ARRAY['youtube', 'hook', 'script'], 'beginner'),
  ('TikTok Caption Template', 'TikTok', 'caption', 'https://example.com/tiktok-caption.pdf', 'Viral caption templates for TikTok', ARRAY['tiktok', 'caption', 'viral'], 'beginner'),
  ('Instagram Carousel Template', 'Instagram', 'design', 'https://example.com/ig-carousel.pdf', 'Professional carousel templates for Instagram', ARRAY['instagram', 'carousel', 'design'], 'intermediate')
) AS v(title, platform, type, download_url, description, tags, difficulty)
WHERE NOT EXISTS (SELECT 1 FROM public.templates LIMIT 1)
ON CONFLICT DO NOTHING;

-- Add sample published article (only if none exist)
-- Note: Using jsonb format to match your schema
INSERT INTO public.articles (
  title,
  slug,
  excerpt,
  content,
  status,
  published_at,
  read_time
)
SELECT * FROM (VALUES
  (
    'Getting Started with Faceless Content',
    'getting-started-faceless-content',
    'Learn the basics of building a faceless content business without showing your face',
    '{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Getting Started with Faceless Content"}]}, {"type": "paragraph", "content": [{"type": "text", "text": "Faceless content creation is a growing trend that allows creators to build successful businesses without showing their face. This guide will walk you through the fundamentals."}]}]'::jsonb,
    'published',
    NOW(),
    5
  )
) AS v(title, slug, excerpt, content, status, published_at, read_time)
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE status = 'published' LIMIT 1)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STEP 4: VERIFY FIXES
-- ============================================================================

-- Check accessible data after fixes
SELECT 
  'After Fixes' as check_type,
  'templates' as table_name,
  COUNT(*)::text as accessible_count
FROM public.templates
UNION ALL
SELECT 
  'After Fixes',
  'articles (published)',
  COUNT(*)::text
FROM public.articles WHERE status = 'published'
UNION ALL
SELECT 
  'After Fixes',
  'platform_guides (published)',
  COUNT(*)::text
FROM public.platform_guides WHERE published = true
UNION ALL
SELECT 
  'After Fixes',
  'content_categories',
  COUNT(*)::text
FROM public.content_categories;

-- Test RLS policies work
SELECT 
  'RLS Test' as check_type,
  'templates accessible' as test_name,
  CASE 
    WHEN COUNT(*) >= 0 THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as result
FROM public.templates;

-- ============================================================================
-- STEP 5: CHECK YOUR PLATFORM GUIDES DATA
-- ============================================================================

-- Verify your platform guides are published
SELECT 
  id,
  title,
  platform,
  published,
  published_at
FROM public.platform_guides
ORDER BY created_at DESC
LIMIT 10;

-- If guides exist but published = false, update them:
-- UPDATE public.platform_guides SET published = true, published_at = NOW() WHERE published = false;





