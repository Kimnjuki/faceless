-- ============================================================================
-- QUICK FIX: Create Templates Table Only
-- Run this if you only need the templates table
-- ============================================================================

-- Drop table if exists (optional - remove if you want to keep existing data)
-- DROP TABLE IF EXISTS public.templates CASCADE;

-- Create templates table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS templates_platform_idx ON public.templates(platform);
CREATE INDEX IF NOT EXISTS templates_niche_idx ON public.templates(niche);
CREATE INDEX IF NOT EXISTS templates_type_idx ON public.templates(type);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can read templates" ON public.templates;

-- Create policy
CREATE POLICY "Anyone can read templates" 
ON public.templates 
FOR SELECT 
USING (true);

-- Verify table was created
SELECT 
  'templates' as table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'templates'
    ) THEN '✅ CREATED SUCCESSFULLY'
    ELSE '❌ FAILED TO CREATE'
  END as status;






