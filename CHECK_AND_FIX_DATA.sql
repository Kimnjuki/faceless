-- ============================================================================
-- CHECK AND FIX DATA ACCESS ISSUES
-- Run this to diagnose why you're not seeing results
-- ============================================================================

-- 1. Check if tables have data
SELECT 
  'templates' as table_name,
  COUNT(*) as row_count
FROM public.templates
UNION ALL
SELECT 
  'articles' as table_name,
  COUNT(*) as row_count
FROM public.articles
UNION ALL
SELECT 
  'content_categories' as table_name,
  COUNT(*) as row_count
FROM public.content_categories
UNION ALL
SELECT 
  'platform_guides' as table_name,
  COUNT(*) as row_count
FROM public.platform_guides;

-- 2. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('templates', 'articles', 'content_categories', 'platform_guides')
ORDER BY tablename, policyname;

-- 3. Test if you can read templates (as anon user)
SELECT COUNT(*) as templates_accessible FROM public.templates;

-- 4. Test if you can read published articles
SELECT COUNT(*) as published_articles FROM public.articles WHERE status = 'published';

-- 5. Check platform_guides
SELECT COUNT(*) as published_guides FROM public.platform_guides WHERE published = true;

-- ============================================================================
-- FIX RLS POLICIES (Run if tables exist but queries return empty)
-- ============================================================================

-- Templates: Ensure public read access
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read templates" ON public.templates;
CREATE POLICY "Anyone can read templates" 
ON public.templates 
FOR SELECT 
USING (true);

-- Articles: Ensure public read access for published articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
CREATE POLICY "Anyone can read published articles" 
ON public.articles 
FOR SELECT 
USING (status = 'published');

-- Content Categories: Ensure public read access
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read content categories" ON public.content_categories;
CREATE POLICY "Anyone can read content categories" 
ON public.content_categories 
FOR SELECT 
USING (true);

-- Platform Guides: Ensure public read access for published guides
ALTER TABLE public.platform_guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published platform guides" ON public.platform_guides;
CREATE POLICY "Anyone can read published platform guides" 
ON public.platform_guides 
FOR SELECT 
USING (published = true);

-- ============================================================================
-- ADD SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Add a sample template
INSERT INTO public.templates (
  title,
  platform,
  type,
  download_url,
  description,
  tags
) VALUES (
  'YouTube Hook Template',
  'YouTube',
  'script',
  'https://example.com/template.pdf',
  'A proven template for creating engaging YouTube hooks that get views',
  ARRAY['youtube', 'hook', 'script']
) ON CONFLICT DO NOTHING;

-- Add a sample content category
INSERT INTO public.content_categories (
  name,
  slug,
  description,
  sort_order
) VALUES 
  ('Content Strategy', 'content-strategy', 'Guides and strategies for creating faceless content', 1),
  ('Monetization', 'monetization', 'Ways to monetize your faceless content business', 2),
  ('Platform Guides', 'platform-guides', 'Platform-specific guides and tutorials', 3)
ON CONFLICT (slug) DO NOTHING;

-- Add a sample published article
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
  '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "This is your first article content. Faceless content creation is a growing trend that allows creators to build successful businesses without showing their face."}]}]}'::jsonb,
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VERIFY AFTER FIXES
-- ============================================================================

-- Check accessible data
SELECT 'Templates' as type, COUNT(*) as count FROM public.templates
UNION ALL
SELECT 'Published Articles', COUNT(*) FROM public.articles WHERE status = 'published'
UNION ALL
SELECT 'Content Categories', COUNT(*) FROM public.content_categories
UNION ALL
SELECT 'Published Platform Guides', COUNT(*) FROM public.platform_guides WHERE published = true;









