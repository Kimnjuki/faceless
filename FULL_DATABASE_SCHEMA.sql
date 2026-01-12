-- ============================================================================
-- FULL DATABASE SCHEMA FOR FACELESS SOLOPRENEUR HUB
-- ============================================================================
-- This is the complete schema matching the provided structure
-- Run this in Supabase SQL Editor to set up the entire database

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. PROFILES TABLE (Main user profile - replaces 'users' table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  avatar_url text,
  bio text,
  skill_level character varying CHECK (skill_level::text = ANY (ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying, 'expert'::character varying]::text[])),
  primary_niche character varying,
  subscription_tier character varying DEFAULT 'free'::character varying CHECK (subscription_tier::text = ANY (ARRAY['free'::character varying, 'premium'::character varying, 'vip'::character varying]::text[])),
  email_verified boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login timestamp with time zone,
  lifetime_value numeric DEFAULT 0,
  total_purchases integer DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 3. LEADS TABLE (Email captures - keep for backward compatibility)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  source character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 4. EMAIL SUBSCRIBERS TABLE (Enhanced email list)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  profile_id uuid,
  source character varying,
  lead_magnet_id uuid,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'bounced'::character varying, 'unsubscribed'::character varying]::text[])),
  segments jsonb,
  custom_fields jsonb,
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  last_engaged timestamp with time zone,
  CONSTRAINT email_subscribers_pkey PRIMARY KEY (id),
  CONSTRAINT email_subscribers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT email_subscribers_lead_magnet_id_fkey FOREIGN KEY (lead_magnet_id) REFERENCES public.lead_magnets(id)
);

-- ============================================================================
-- 5. TOOL CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tool_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tool_categories_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 6. TOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  category_id uuid,
  description text,
  website_url text,
  pricing text,
  pricing_url text,
  pros text[],
  cons text[],
  best_for text,
  rating numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  tutorial_url text,
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tools_pkey PRIMARY KEY (id),
  CONSTRAINT tools_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.tool_categories(id)
);

-- ============================================================================
-- 7. AFFILIATE PROGRAMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_programs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  company character varying,
  commission_rate numeric,
  cookie_duration integer,
  status character varying DEFAULT 'active'::character varying,
  terms_url text,
  created_at timestamp with time zone DEFAULT now(),
  product_category character varying,
  is_recurring boolean DEFAULT false,
  quality_score integer DEFAULT 3,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT affiliate_programs_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 8. PRODUCTS TABLE (for affiliate links)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  short_description text,
  type character varying CHECK (type::text = ANY (ARRAY['digital'::character varying, 'course'::character varying, 'service'::character varying, 'subscription'::character varying, 'bundle'::character varying]::text[])),
  category_id uuid,
  price numeric,
  compare_at_price numeric,
  subscription_interval character varying,
  trial_period_days integer,
  featured_image text,
  gallery_images text[],
  features jsonb,
  requirements jsonb,
  target_audience character varying,
  profit_margin numeric,
  status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'active'::character varying, 'archived'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id)
);

-- ============================================================================
-- 9. AFFILIATE LINKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  program_id uuid,
  product_id uuid,
  destination_url text NOT NULL,
  slug character varying NOT NULL UNIQUE,
  campaign_source character varying,
  medium character varying,
  created_at timestamp with time zone DEFAULT now(),
  cta_text text,
  CONSTRAINT affiliate_links_pkey PRIMARY KEY (id),
  CONSTRAINT affiliate_links_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT affiliate_links_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.affiliate_programs(id)
);

-- ============================================================================
-- 10. NICHE CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.niche_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT niche_categories_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 11. NICHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.niches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  niche_name character varying NOT NULL UNIQUE,
  category_id uuid,
  profitability_score integer CHECK (profitability_score >= 1 AND profitability_score <= 10),
  avg_rpm numeric,
  difficulty_level character varying CHECK (difficulty_level::text = ANY (ARRAY['easy'::character varying, 'medium'::character varying, 'hard'::character varying]::text[])),
  competition_level character varying CHECK (competition_level::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'very_high'::character varying]::text[])),
  startup_cost character varying,
  time_to_monetization character varying,
  evergreen_score integer CHECK (evergreen_score >= 1 AND evergreen_score <= 10),
  estimated_earnings_range character varying,
  required_tools text[],
  best_ai_tools text[],
  risks text[],
  trend_status character varying CHECK (trend_status::text = ANY (ARRAY['rising'::character varying, 'stable'::character varying, 'declining'::character varying]::text[])),
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT niches_pkey PRIMARY KEY (id),
  CONSTRAINT niches_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.niche_categories(id)
);

-- ============================================================================
-- 12. TEMPLATES TABLE (if not exists in schema, create for backward compatibility)
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
-- 13. COMMUNITY CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.community_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  access_tier character varying DEFAULT 'free'::character varying CHECK (access_tier::text = ANY (ARRAY['free'::character varying, 'premium'::character varying, 'vip'::character varying]::text[])),
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_categories_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 14. FORUM POSTS (updated to use category_id)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  category_id uuid,
  author_id uuid,
  title character varying NOT NULL,
  content text NOT NULL,
  post_type character varying DEFAULT 'discussion'::character varying CHECK (post_type::text = ANY (ARRAY['discussion'::character varying, 'question'::character varying, 'success_story'::character varying, 'resource'::character varying]::text[])),
  pinned boolean DEFAULT false,
  status character varying DEFAULT 'published'::character varying CHECK (status::text = ANY (ARRAY['published'::character varying, 'draft'::character varying, 'archived'::character varying]::text[])),
  view_count integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  last_reply_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT forum_posts_pkey PRIMARY KEY (id),
  CONSTRAINT forum_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.community_categories(id),
  CONSTRAINT forum_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(user_id)
);

-- ============================================================================
-- 15. LEAD MAGNETS (for email_subscribers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lead_magnets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  tier character varying CHECK (tier::text = ANY (ARRAY['entry'::character varying, 'engagement'::character varying, 'value'::character varying, 'ascension'::character varying]::text[])),
  type character varying CHECK (type::text = ANY (ARRAY['pdf'::character varying, 'email_course'::character varying, 'template'::character varying, 'checklist'::character varying, 'video'::character varying]::text[])),
  file_url text,
  delivery_sequence jsonb,
  conversion_goal character varying,
  optin_form_copy text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lead_magnets_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 16. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS tools_category_id_idx ON public.tools(category_id);
CREATE INDEX IF NOT EXISTS niches_category_id_idx ON public.niches(category_id);
CREATE INDEX IF NOT EXISTS forum_posts_category_id_idx ON public.forum_posts(category_id);
CREATE INDEX IF NOT EXISTS forum_posts_author_id_idx ON public.forum_posts(author_id);

-- ============================================================================
-- 17. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Email Subscribers
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert email subscribers" ON public.email_subscribers;
CREATE POLICY "Anyone can insert email subscribers" ON public.email_subscribers FOR INSERT WITH CHECK (true);

-- Tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read tools" ON public.tools;
CREATE POLICY "Anyone can read tools" ON public.tools FOR SELECT USING (true);

-- Tool Categories
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read tool categories" ON public.tool_categories;
CREATE POLICY "Anyone can read tool categories" ON public.tool_categories FOR SELECT USING (true);

-- Niches
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read niches" ON public.niches;
CREATE POLICY "Anyone can read niches" ON public.niches FOR SELECT USING (true);

-- Niche Categories
ALTER TABLE public.niche_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read niche categories" ON public.niche_categories;
CREATE POLICY "Anyone can read niche categories" ON public.niche_categories FOR SELECT USING (true);

-- Templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read templates" ON public.templates;
CREATE POLICY "Anyone can read templates" ON public.templates FOR SELECT USING (true);

-- Forum Posts
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read forum posts" ON public.forum_posts;
CREATE POLICY "Anyone can read forum posts" ON public.forum_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can create forum posts" ON public.forum_posts;
CREATE POLICY "Authenticated users can create forum posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can update own forum posts" ON public.forum_posts;
CREATE POLICY "Users can update own forum posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);

-- Affiliate Links
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read affiliate links" ON public.affiliate_links;
CREATE POLICY "Anyone can read affiliate links" ON public.affiliate_links FOR SELECT USING (true);

-- Affiliate Programs
ALTER TABLE public.affiliate_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read affiliate programs" ON public.affiliate_programs;
CREATE POLICY "Anyone can read affiliate programs" ON public.affiliate_programs FOR SELECT USING (true);

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (status = 'active');

-- Community Categories
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read community categories" ON public.community_categories;
CREATE POLICY "Anyone can read community categories" ON public.community_categories FOR SELECT USING (true);

-- ============================================================================
-- 18. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_niches_updated_at BEFORE UPDATE ON public.niches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE
-- ============================================================================
SELECT 'Database schema setup complete!' as status;










