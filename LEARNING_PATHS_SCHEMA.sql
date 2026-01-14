-- ============================================================================
-- LEARNING PATHS & MODULES SCHEMA
-- ============================================================================
-- Educational content structure for faceless content creators

-- ============================================================================
-- 1. LEARNING PATHS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  track_type character varying NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'specialized'
  description text,
  estimated_duration character varying, -- e.g., "4 weeks", "20 hours"
  difficulty_level character varying CHECK (difficulty_level::text = ANY (ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying]::text[])),
  order_index integer DEFAULT 0,
  icon_name character varying, -- For icon display
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT learning_paths_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 2. LEARNING MODULES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  learning_path_id uuid,
  title character varying NOT NULL,
  description text,
  content_type character varying DEFAULT 'video'::character varying CHECK (content_type::text = ANY (ARRAY['video'::character varying, 'article'::character varying, 'interactive'::character varying, 'quiz'::character varying]::text[])),
  content_url text, -- URL to video, article, or interactive content
  duration_minutes integer,
  order_index integer DEFAULT 0,
  prerequisites text[], -- Array of module IDs that must be completed first
  is_free boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT learning_modules_pkey PRIMARY KEY (id),
  CONSTRAINT learning_modules_learning_path_id_fkey FOREIGN KEY (learning_path_id) REFERENCES public.learning_paths(id) ON DELETE CASCADE
);

-- ============================================================================
-- 3. USER LEARNING PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL, -- References profiles.user_id
  learning_path_id uuid,
  module_id uuid,
  completed boolean DEFAULT false,
  progress_percentage integer DEFAULT 0,
  last_accessed timestamp with time zone,
  time_spent integer DEFAULT 0, -- in minutes
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_learning_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_learning_progress_learning_path_id_fkey FOREIGN KEY (learning_path_id) REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  CONSTRAINT user_learning_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  UNIQUE(user_id, module_id) -- One progress record per user per module
);

-- ============================================================================
-- 4. PLATFORM GUIDES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.platform_guides (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  platform character varying NOT NULL, -- 'youtube', 'tiktok', 'instagram', 'general'
  category character varying, -- 'setup', 'optimization', 'monetization', 'growth'
  content text NOT NULL, -- Markdown or HTML content
  excerpt text,
  featured_image text,
  author_id uuid, -- References profiles.user_id
  difficulty_level character varying DEFAULT 'beginner'::character varying,
  read_time integer, -- in minutes
  view_count integer DEFAULT 0,
  published boolean DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT platform_guides_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS learning_paths_track_type_idx ON public.learning_paths(track_type);
CREATE INDEX IF NOT EXISTS learning_paths_featured_idx ON public.learning_paths(featured);
CREATE INDEX IF NOT EXISTS learning_modules_path_id_idx ON public.learning_modules(learning_path_id);
CREATE INDEX IF NOT EXISTS learning_modules_order_idx ON public.learning_modules(learning_path_id, order_index);
CREATE INDEX IF NOT EXISTS user_learning_progress_user_id_idx ON public.user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS user_learning_progress_path_id_idx ON public.user_learning_progress(learning_path_id);
CREATE INDEX IF NOT EXISTS platform_guides_platform_idx ON public.platform_guides(platform);
CREATE INDEX IF NOT EXISTS platform_guides_published_idx ON public.platform_guides(published);
CREATE INDEX IF NOT EXISTS platform_guides_slug_idx ON public.platform_guides(slug);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Learning Paths: Public read access
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view learning paths" ON public.learning_paths FOR SELECT USING (true);

-- Learning Modules: Public read access
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view learning modules" ON public.learning_modules FOR SELECT USING (true);

-- User Learning Progress: Users can only see their own progress
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_learning_progress FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own progress" ON public.user_learning_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own progress" ON public.user_learning_progress FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Platform Guides: Public read access for published guides
ALTER TABLE public.platform_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published guides" ON public.platform_guides FOR SELECT USING (published = true);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample learning paths
INSERT INTO public.learning_paths (name, track_type, description, estimated_duration, difficulty_level, order_index, featured, icon_name) VALUES
('Faceless Content Fundamentals', 'beginner', 'Master the basics of creating faceless content from niche selection to first video', '4 weeks', 'beginner', 1, true, 'PlayCircle'),
('YouTube Automation Mastery', 'intermediate', 'Build and scale a profitable YouTube channel with automation', '6 weeks', 'intermediate', 2, true, 'Youtube'),
('TikTok Growth System', 'intermediate', 'Grow your TikTok following and monetize with proven strategies', '4 weeks', 'intermediate', 3, false, 'Video'),
('Advanced Monetization', 'advanced', 'Multiple revenue streams and scaling strategies', '8 weeks', 'advanced', 4, false, 'DollarSign')
ON CONFLICT DO NOTHING;

-- Insert sample modules for first learning path
INSERT INTO public.learning_modules (learning_path_id, title, description, content_type, duration_minutes, order_index, is_free) 
SELECT 
  lp.id,
  'Introduction to Faceless Content',
  'Learn what faceless content is and why it works',
  'video',
  15,
  1,
  true
FROM public.learning_paths lp WHERE lp.name = 'Faceless Content Fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO public.learning_modules (learning_path_id, title, description, content_type, duration_minutes, order_index, is_free) 
SELECT 
  lp.id,
  'Niche Selection Framework',
  'How to choose a profitable niche with low competition',
  'video',
  25,
  2,
  true
FROM public.learning_paths lp WHERE lp.name = 'Faceless Content Fundamentals'
ON CONFLICT DO NOTHING;

INSERT INTO public.learning_modules (learning_path_id, title, description, content_type, duration_minutes, order_index, is_free) 
SELECT 
  lp.id,
  'Essential Tools Setup',
  'Set up your content creation toolkit',
  'interactive',
  30,
  3,
  false
FROM public.learning_paths lp WHERE lp.name = 'Faceless Content Fundamentals'
ON CONFLICT DO NOTHING;

-- Insert sample platform guides
INSERT INTO public.platform_guides (title, slug, platform, category, content, excerpt, difficulty_level, read_time, published) VALUES
('Complete YouTube Channel Setup Guide', 'youtube-channel-setup', 'youtube', 'setup', '# YouTube Channel Setup Guide\n\nThis comprehensive guide will walk you through setting up your YouTube channel for faceless content success...', 'Step-by-step guide to setting up your YouTube channel for faceless content', 'beginner', 12, true),
('TikTok Algorithm Optimization', 'tiktok-algorithm-optimization', 'tiktok', 'optimization', '# TikTok Algorithm Optimization\n\nUnderstanding and leveraging the TikTok algorithm for maximum reach...', 'Master the TikTok algorithm to maximize your content reach', 'intermediate', 15, true),
('Instagram Reels Growth Strategy', 'instagram-reels-growth', 'instagram', 'growth', '# Instagram Reels Growth Strategy\n\nHow to grow your Instagram following using Reels...', 'Proven strategies to grow your Instagram following with Reels', 'beginner', 10, true)
ON CONFLICT DO NOTHING;












