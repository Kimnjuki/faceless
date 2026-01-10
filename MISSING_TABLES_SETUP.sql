-- ============================================================================
-- MISSING TABLES SETUP
-- Run this script in Supabase SQL Editor to create missing tables
-- ============================================================================

-- ============================================================================
-- 1. TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  platform character varying,
  niche character varying,
  type character varying,
  difficulty character varying,
  preview_url text,
  download_url text NOT NULL,
  file_format character varying,
  description text,
  tags text[],
  download_count integer DEFAULT 0,
  rating numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT templates_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 2. CONTENT CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  parent_id uuid,
  pillar_page boolean DEFAULT false,
  seo_keywords text[],
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_categories_pkey PRIMARY KEY (id),
  CONSTRAINT content_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.content_categories(id)
);

-- ============================================================================
-- 3. ARTICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category_id uuid,
  author_id uuid,
  status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying]::text[])),
  featured_image text,
  read_time integer,
  word_count integer,
  seo_title character varying,
  meta_description text,
  canonical_url text,
  schema_markup jsonb,
  internal_links jsonb,
  content_upgrades jsonb,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  view_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.content_categories(id)
  -- Note: author_id foreign key removed to avoid dependency on profiles table
  -- If profiles table exists, you can add: CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(user_id)
);

-- ============================================================================
-- 4. ARTICLE TAGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.article_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL,
  tag character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT article_tags_pkey PRIMARY KEY (id),
  CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE,
  CONSTRAINT article_tags_unique UNIQUE (article_id, tag)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS templates_platform_idx ON public.templates(platform);
CREATE INDEX IF NOT EXISTS templates_niche_idx ON public.templates(niche);
CREATE INDEX IF NOT EXISTS templates_type_idx ON public.templates(type);
CREATE INDEX IF NOT EXISTS content_categories_slug_idx ON public.content_categories(slug);
CREATE INDEX IF NOT EXISTS content_categories_parent_id_idx ON public.content_categories(parent_id);
CREATE INDEX IF NOT EXISTS articles_category_id_idx ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON public.articles(status);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS article_tags_article_id_idx ON public.article_tags(article_id);
CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON public.article_tags(tag);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Templates: Public read access
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read templates" ON public.templates;
CREATE POLICY "Anyone can read templates" ON public.templates FOR SELECT USING (true);

-- Content Categories: Public read access
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read content categories" ON public.content_categories;
CREATE POLICY "Anyone can read content categories" ON public.content_categories FOR SELECT USING (true);

-- Articles: Public read access for published articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published articles" ON public.articles;
CREATE POLICY "Anyone can read published articles" ON public.articles FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "Authors can manage own articles" ON public.articles;
CREATE POLICY "Authors can manage own articles" ON public.articles FOR ALL USING (auth.uid() = author_id);

-- Article Tags: Public read access
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read article tags" ON public.article_tags;
CREATE POLICY "Anyone can read article tags" ON public.article_tags FOR SELECT USING (true);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert a sample content category
INSERT INTO public.content_categories (name, slug, description, sort_order)
VALUES 
  ('Content Strategy', 'content-strategy', 'Guides and strategies for creating faceless content', 1),
  ('Monetization', 'monetization', 'Ways to monetize your faceless content business', 2),
  ('Platform Guides', 'platform-guides', 'Platform-specific guides and tutorials', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('templates', 'content_categories', 'articles', 'article_tags')
ORDER BY table_name;

