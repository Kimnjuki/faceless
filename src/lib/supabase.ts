import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fvvpfueoaacijowkpdsf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dnBmdWVvYWFjaWpvd2twZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzYwODIsImV4cCI6MjA3OTAxMjA4Mn0.4PMgaMn33jJ36tN7UISTBbsCKTczhAlquQTkqAq7ApI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching the full schema

// ============================================================================
// PROFILES (Main user table - replaces 'users')
// ============================================================================
export interface Profile {
  id: string;
  user_id: string; // References auth.users(id)
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primary_niche?: string;
  subscription_tier?: 'free' | 'premium' | 'vip';
  email_verified: boolean;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  lifetime_value: number;
  total_purchases: number;
}

// ============================================================================
// LEADS (Email captures - backward compatibility)
// ============================================================================
export interface Lead {
  id: string;
  email: string;
  source?: string;
  created_at: string;
}

// ============================================================================
// EMAIL SUBSCRIBERS (Enhanced email list)
// ============================================================================
export interface EmailSubscriber {
  id: string;
  email: string;
  profile_id?: string;
  source?: string;
  lead_magnet_id?: string;
  status: 'active' | 'inactive' | 'bounced' | 'unsubscribed';
  segments?: Record<string, any>;
  custom_fields?: Record<string, any>;
  subscribed_at: string;
  unsubscribed_at?: string;
  last_engaged?: string;
}

// ============================================================================
// FORUM POSTS (Updated to use category_id)
// ============================================================================
export interface CommunityCategory {
  id: string;
  name: string;
  description?: string;
  access_tier: 'free' | 'premium' | 'vip';
  sort_order: number;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  category_id?: string; // References community_categories
  category?: CommunityCategory; // Joined
  author_id: string; // References profiles(user_id)
  title: string;
  content: string;
  post_type: 'discussion' | 'question' | 'success_story' | 'resource';
  pinned: boolean;
  status: 'published' | 'draft' | 'archived';
  view_count: number;
  reply_count: number;
  last_reply_at?: string;
  created_at: string;
  updated_at: string;
}

// Backward compatibility alias
export interface User extends Profile {
  // Legacy fields for backward compatibility
  name?: string; // Maps to full_name
  niche?: string; // Maps to primary_niche
  goal?: string; // Not in schema, but kept for compatibility
  onboarding_completed?: boolean; // Not in schema, but kept for compatibility
}

export interface Template {
  id: string;
  title: string;
  platform: string;
  niche?: string;
  type: string;
  difficulty: string;
  preview_url?: string;
  download_url: string;
  file_format?: string;
  description?: string;
  tags?: string[];
  download_count: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// NICHE CATEGORIES
// ============================================================================
export interface NicheCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

// ============================================================================
// NICHES (Updated to use category_id)
// ============================================================================
export interface Niche {
  id: string;
  niche_name: string;
  category_id?: string; // References niche_categories
  category?: NicheCategory; // Joined
  profitability_score: number;
  avg_rpm?: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  competition_level: 'low' | 'medium' | 'high' | 'very_high';
  startup_cost?: string;
  time_to_monetization?: string;
  evergreen_score?: number;
  estimated_earnings_range?: string;
  required_tools?: string[];
  best_ai_tools?: string[];
  risks?: string[];
  trend_status: 'rising' | 'stable' | 'declining';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description?: string;
}

export interface AffiliateLink {
  id: string;
  program_id: string;
  destination_url: string;
  slug: string;
  cta_text?: string;
}

export interface Tool {
  id: string;
  name: string;
  category_id: string;
  category?: ToolCategory; // Joined from tool_categories
  description?: string;
  pros?: string[];
  cons?: string[];
  pricing?: string;
  pricing_url?: string;
  best_for?: string;
  rating: number;
  rating_count: number;
  website_url?: string;
  tutorial_url?: string;
  created_at: string;
  // Affiliate link (joined or direct)
  affiliate_link?: AffiliateLink;
  affiliate_url?: string; // Computed from affiliate_link
}

// ============================================================================
// LEARNING PATHS & MODULES
// ============================================================================
export interface LearningPath {
  id: string;
  name: string;
  track_type: string;
  description?: string;
  estimated_duration?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  order_index?: number;
  icon_name?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  modules?: LearningModule[]; // Joined modules
  progress?: UserLearningProgress; // User's progress if logged in
  levels?: Array<{ // For new learning_path_modules structure
    level_order: number;
    level_title: string;
    modules: LearningModule[];
  }>;
}

export interface LearningModule {
  id: string;
  learning_path_id?: string;
  learning_path?: LearningPath; // Joined from learning_paths
  title: string;
  description?: string;
  content_type?: 'video' | 'article' | 'interactive' | 'quiz';
  content_url?: string;
  duration_minutes?: number;
  order_index?: number;
  prerequisites?: string[];
  is_free?: boolean;
  created_at?: string;
  updated_at?: string;
  progress?: UserLearningProgress; // User's progress if logged in
  // New fields from learning_path_modules table
  level_order?: number;
  level_title?: string;
  key_concepts?: string[];
}

export interface UserLearningProgress {
  id: string;
  user_id: string; // References profiles.user_id
  learning_path_id?: string;
  learning_path?: LearningPath; // Joined from learning_paths
  module_id?: string;
  module?: LearningModule; // Joined from learning_modules
  completed?: boolean;
  progress_percentage?: number;
  last_accessed?: string;
  time_spent?: number; // in minutes
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PLATFORM GUIDES
// ============================================================================
export interface PlatformGuide {
  id: string;
  title: string;
  slug: string;
  platform: string;
  category?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id?: string;
  author?: Profile; // Joined from profiles
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  read_time?: number;
  view_count?: number;
  published?: boolean;
  published_at?: string;
  tool_tags?: string[]; // Array of tool names
  example_applications?: Array<{
    feature: string;
    application: string;
  }>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CONTENT CATEGORIES
// ============================================================================
export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  parent?: ContentCategory; // Self-referencing join
  pillar_page?: boolean;
  seo_keywords?: string[];
  sort_order?: number;
  created_at: string;
}

// ============================================================================
// ARTICLES (Content Strategies)
// ============================================================================
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category_id?: string;
  category?: ContentCategory; // Joined from content_categories
  author_id?: string; // References profiles.user_id
  author?: Profile; // Joined from profiles
  status?: 'draft' | 'published' | 'archived';
  featured_image?: string;
  read_time?: number;
  word_count?: number;
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  schema_markup?: Record<string, any>;
  internal_links?: Record<string, any>;
  content_upgrades?: Record<string, any>;
  published_at?: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
  share_count?: number;
  tags?: ArticleTag[]; // Joined from article_tags
}

export interface ArticleTag {
  id: string;
  article_id: string;
  article?: Article; // Joined from articles
  tag: string;
  created_at: string;
}

// ============================================================================
// EVENTS
// ============================================================================
export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  event_type: 'webinar' | 'workshop' | 'live_qna' | 'challenge' | 'meetup';
  start_date: string;
  end_date?: string;
  timezone?: string;
  registration_url?: string;
  meeting_url?: string;
  max_participants?: number;
  current_participants: number;
  featured_image?: string;
  host_id?: string; // References profiles.user_id
  host?: Profile; // Joined from profiles
  status: 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
  registration_open: boolean;
  registration_deadline?: string;
  price: number;
  currency?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  event?: Event; // Joined from events
  user_id: string; // References profiles.user_id
  user?: Profile; // Joined from profiles
  registration_date: string;
  attendance_status: 'registered' | 'attended' | 'no_show' | 'cancelled';
  notes?: string;
  created_at: string;
}

// ============================================================================
// CHALLENGES
// ============================================================================
export interface Challenge {
  id: string;
  name: string;
  slug: string;
  description?: string;
  challenge_type: 'content' | 'growth' | 'monetization' | 'skill';
  start_date: string;
  end_date: string;
  duration_days?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  featured_image?: string;
  rules?: string[];
  prizes?: string[];
  requirements?: string[];
  leaderboard_enabled: boolean;
  max_participants?: number;
  current_participants: number;
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  registration_open: boolean;
  registration_deadline?: string;
  created_by?: string; // References profiles.user_id
  creator?: Profile; // Joined from profiles
  created_at: string;
  updated_at: string;
}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  challenge?: Challenge; // Joined from challenges
  user_id: string; // References profiles.user_id
  user?: Profile; // Joined from profiles
  registration_date: string;
  completion_status: 'registered' | 'in_progress' | 'completed' | 'dropped';
  progress_percentage: number;
  submissions?: Record<string, any>[];
  points: number;
  rank?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

