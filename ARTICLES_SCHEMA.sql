-- ============================================================================
-- ARTICLES TABLE FOR CONTENT STRATEGIES
-- ============================================================================
-- This table stores blog articles and content strategies

CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category_id uuid,
  author_id uuid, -- References profiles.user_id
  status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying]::text[])),
  featured_image text,
  read_time integer, -- in minutes
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
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- CONTENT CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.content_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  parent_id uuid, -- For nested categories
  pillar_page boolean DEFAULT false,
  seo_keywords text[],
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_categories_pkey PRIMARY KEY (id),
  CONSTRAINT content_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.content_categories(id) ON DELETE SET NULL
);

-- ============================================================================
-- ARTICLE TAGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.article_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  article_id uuid NOT NULL,
  tag character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT article_tags_pkey PRIMARY KEY (id),
  CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE,
  UNIQUE(article_id, tag)
);

-- ============================================================================
-- FOREIGN KEYS
-- ============================================================================
ALTER TABLE public.articles 
  ADD CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.content_categories(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_status_idx ON public.articles(status);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS articles_category_id_idx ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS content_categories_slug_idx ON public.content_categories(slug);
CREATE INDEX IF NOT EXISTS article_tags_article_id_idx ON public.article_tags(article_id);
CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON public.article_tags(tag);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Articles: Public read access for published articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published articles" ON public.articles FOR SELECT USING (status = 'published');

-- Content Categories: Public read access
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view content categories" ON public.content_categories FOR SELECT USING (true);

-- Article Tags: Public read access
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view article tags" ON public.article_tags FOR SELECT USING (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to increment article view count
CREATE OR REPLACE FUNCTION increment_article_views(article_id_input uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = article_id_input;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample categories
INSERT INTO public.content_categories (name, slug, description, sort_order) VALUES
('YouTube', 'youtube', 'YouTube automation and growth strategies', 1),
('AI Tools', 'ai-tools', 'AI-powered content creation tools', 2),
('Monetization', 'monetization', 'Revenue generation strategies', 3),
('Automation', 'automation', 'Content automation workflows', 4),
('Niche Selection', 'niche-selection', 'Finding profitable niches', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample articles (if you want to test)
-- Note: Replace author_id with actual profile user_id from your database
/*
INSERT INTO public.articles (title, slug, excerpt, content, category_id, status, read_time, published_at) 
SELECT 
  'How to Start a Faceless YouTube Channel in 2025',
  'faceless-youtube-channel-guide',
  'Complete guide to launching and monetizing an anonymous content channel',
  '# How to Start a Faceless YouTube Channel in 2025\n\nThis comprehensive guide will walk you through...',
  (SELECT id FROM public.content_categories WHERE slug = 'youtube' LIMIT 1),
  'published',
  12,
  now()
WHERE NOT EXISTS (SELECT 1 FROM public.articles WHERE slug = 'faceless-youtube-channel-guide');
*/


