-- ============================================================================
-- PROFILES TABLE - E-E-A-T Enhanced for 2026 SEO
-- ============================================================================
-- This migration handles both new table creation and existing table updates
-- Required for Person JSON-LD schema and Contributor Authority

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  
  -- Professional Information
  job_title TEXT,
  company_name TEXT,
  
  -- Social Links (JSONB for flexibility)
  social_links JSONB DEFAULT '{}'::jsonb,
  -- Example: {"linkedin": "https://linkedin.com/in/...", "twitter": "https://twitter.com/...", "github": "https://github.com/..."}
  
  -- E-E-A-T Signals
  credentials TEXT[] DEFAULT ARRAY[]::TEXT[],
  -- Example: ["Certified Privacy Expert", "SaaS Developer", "Content Marketing Specialist"]
  
  knows_about TEXT[] DEFAULT ARRAY[]::TEXT[],
  -- Example: ["Data Anonymization", "React Security", "Faceless Content Creation", "AI Automation"]
  
  verified_expert BOOLEAN DEFAULT FALSE,
  -- Critical: Set to true for verified experts (high E-E-A-T signal)
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- ADD MISSING COLUMNS (if table already exists)
-- ============================================================================
-- These ALTER statements are safe to run multiple times (they check if column exists)

-- Add website_url if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN website_url TEXT;
  END IF;
END $$;

-- Add job_title if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE profiles ADD COLUMN job_title TEXT;
  END IF;
END $$;

-- Add company_name if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN company_name TEXT;
  END IF;
END $$;

-- Add social_links if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'social_links'
  ) THEN
    ALTER TABLE profiles ADD COLUMN social_links JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add credentials if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'credentials'
  ) THEN
    ALTER TABLE profiles ADD COLUMN credentials TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- Add knows_about if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'knows_about'
  ) THEN
    ALTER TABLE profiles ADD COLUMN knows_about TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;

-- Add verified_expert if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'verified_expert'
  ) THEN
    ALTER TABLE profiles ADD COLUMN verified_expert BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- ============================================================================
-- CREATE INDEXES (safe to run multiple times with IF NOT EXISTS)
-- ============================================================================

-- Index for verified experts (partial index for performance)
CREATE INDEX IF NOT EXISTS profiles_verified_expert_idx 
  ON profiles(verified_expert) 
  WHERE verified_expert = TRUE;

-- GIN indexes for array columns (for fast searches)
CREATE INDEX IF NOT EXISTS profiles_knows_about_idx 
  ON profiles USING GIN(knows_about);

CREATE INDEX IF NOT EXISTS profiles_credentials_idx 
  ON profiles USING GIN(credentials);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Policy: Anyone can read profiles (for public display)
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (TRUE);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- ============================================================================
-- HELPER FUNCTION: Get expert profiles by topic
-- ============================================================================
CREATE OR REPLACE FUNCTION get_experts_by_topic(p_topic TEXT)
RETURNS TABLE(
  id UUID,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  job_title TEXT,
  credentials TEXT[],
  knows_about TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.bio,
    p.avatar_url,
    p.job_title,
    p.credentials,
    p.knows_about
  FROM profiles p
  WHERE p.verified_expert = TRUE
    AND (
      p.knows_about @> ARRAY[p_topic]::TEXT[]
      OR p.bio ILIKE '%' || p_topic || '%'
    )
  ORDER BY p.updated_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- EXAMPLE DATA INSERT (for testing)
-- ============================================================================
-- After creating your auth user, insert a profile like this:
-- 
-- INSERT INTO profiles (
--   id,
--   full_name,
--   bio,
--   job_title,
--   company_name,
--   social_links,
--   credentials,
--   knows_about,
--   verified_expert
-- ) VALUES (
--   'your-user-uuid-here',
--   'John Doe',
--   '10+ years building anonymous content businesses. Expert in AI automation and privacy-first entrepreneurship.',
--   'Senior Content Strategist',
--   'ContentAnonymity',
--   '{"linkedin": "https://linkedin.com/in/johndoe", "twitter": "https://twitter.com/johndoe"}',
--   ARRAY['Certified Privacy Expert', 'SaaS Developer', 'Content Marketing Specialist'],
--   ARRAY['Data Anonymization', 'Faceless Content Creation', 'AI Automation', 'YouTube Automation'],
--   TRUE  -- Set to TRUE for verified experts
-- );
