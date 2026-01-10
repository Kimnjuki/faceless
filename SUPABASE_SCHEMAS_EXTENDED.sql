-- Extended Database Schemas for Full Implementation
-- Run these after the basic setup in SUPABASE_SETUP.md

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'tiktok', 'youtube', 'instagram', 'general'
  niche TEXT,
  type TEXT NOT NULL, -- 'script', 'storyboard', 'carousel', 'hook', 'outro'
  difficulty TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  preview_url TEXT,
  download_url TEXT NOT NULL,
  file_format TEXT, -- 'pdf', 'notion', 'google_docs', 'canva', 'video'
  description TEXT,
  tags TEXT[],
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Niches Database
CREATE TABLE IF NOT EXISTS niches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  niche_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  profitability_score INTEGER CHECK (profitability_score >= 1 AND profitability_score <= 10),
  difficulty_level TEXT, -- 'easy', 'medium', 'hard'
  competition_level TEXT, -- 'low', 'medium', 'high'
  avg_revenue_potential TEXT,
  required_tools TEXT[],
  startup_cost TEXT,
  content_ideas_count INTEGER DEFAULT 0,
  example_accounts TEXT[],
  monetization_methods TEXT[],
  trend_status TEXT, -- 'rising', 'stable', 'declining'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools Database
CREATE TABLE IF NOT EXISTS tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'video_editing', 'ai_voiceover', 'scriptwriting', etc.
  description TEXT,
  pros TEXT[],
  cons TEXT[],
  pricing TEXT,
  pricing_url TEXT,
  affiliate_link TEXT,
  best_for TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  website_url TEXT,
  tutorial_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Paths
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  track_type TEXT NOT NULL, -- 'content_creation', 'monetization', 'growth_marketing', 'automation_scaling'
  description TEXT,
  estimated_duration TEXT,
  difficulty_level TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Modules
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT, -- 'video', 'text', 'quiz', 'interactive'
  content_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER,
  prerequisites TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- User Goals
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL, -- 'custom', 'predefined'
  title TEXT NOT NULL,
  description TEXT,
  target_value TEXT,
  current_value TEXT,
  deadline DATE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal Steps
CREATE TABLE IF NOT EXISTS goal_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  badge_icon TEXT,
  criteria TEXT,
  category TEXT, -- 'streak', 'milestone', 'community', 'course', 'challenge'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rules TEXT,
  prizes TEXT[],
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Submissions
CREATE TABLE IF NOT EXISTS challenge_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_url TEXT NOT NULL,
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Calendar
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'workshop', 'qna', 'coworking', 'ama', 'challenge'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  zoom_link TEXT,
  recording_url TEXT,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(event_id, user_id)
);

-- Content Reviews (Peer Review System)
CREATE TABLE IF NOT EXISTS content_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  submitter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_url TEXT NOT NULL,
  hook_rating INTEGER CHECK (hook_rating >= 1 AND hook_rating <= 5),
  clarity_rating INTEGER CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  visual_rating INTEGER CHECK (visual_rating >= 1 AND visual_rating <= 5),
  audio_rating INTEGER CHECK (audio_rating >= 1 AND audio_rating <= 5),
  engagement_rating INTEGER CHECK (engagement_rating >= 1 AND engagement_rating <= 5),
  strengths TEXT,
  improvements TEXT,
  overall_impression TEXT,
  helpful_rating INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Tiers
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- 'free', 'premium', 'vip'
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB,
  limitations JSONB,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id),
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  billing_period TEXT, -- 'monthly', 'yearly'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  affiliate_url TEXT NOT NULL,
  commission_rate TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Affiliate Tracking
CREATE TABLE IF NOT EXISTS user_affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_link_id UUID REFERENCES affiliate_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(10,2)
);

-- Checklists
CREATE TABLE IF NOT EXISTS checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT, -- 'daily', 'weekly', 'launch', 'pre_publish', 'monthly', 'monetization'
  description TEXT,
  items JSONB NOT NULL, -- Array of {title, description, optional}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Checklist Progress
CREATE TABLE IF NOT EXISTS user_checklist_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE,
  completed_items JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checklist_id)
);

-- Resource Links
CREATE TABLE IF NOT EXISTS resource_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'stock_footage', 'music', 'fonts', 'design_tools', 'ai_tools'
  url TEXT NOT NULL,
  description TEXT,
  licensing_info TEXT,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  is_popular BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swipe Files
CREATE TABLE IF NOT EXISTS swipe_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  niche TEXT,
  content_type TEXT, -- 'educational', 'entertaining', 'motivational'
  performance_level TEXT, -- 'viral', 'high', 'good'
  view_count TEXT,
  engagement_metrics TEXT,
  content_url TEXT,
  analysis_notes TEXT,
  key_elements JSONB, -- {hook, structure, cta}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_platform ON templates(platform);
CREATE INDEX IF NOT EXISTS idx_templates_niche ON templates(niche);
CREATE INDEX IF NOT EXISTS idx_niches_category ON niches(category);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - allow authenticated users to read, users can only modify their own data)
-- Templates: All authenticated users can read
CREATE POLICY "Templates are viewable by authenticated users" ON templates FOR SELECT USING (auth.role() = 'authenticated');

-- Niches: All authenticated users can read
CREATE POLICY "Niches are viewable by authenticated users" ON niches FOR SELECT USING (auth.role() = 'authenticated');

-- Tools: All authenticated users can read
CREATE POLICY "Tools are viewable by authenticated users" ON tools FOR SELECT USING (auth.role() = 'authenticated');

-- User Progress: Users can only see/modify their own progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- User Goals: Users can only see/modify their own goals
CREATE POLICY "Users can view own goals" ON user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON user_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON user_goals FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other user-specific tables...
-- (Add more policies as needed based on your security requirements)

