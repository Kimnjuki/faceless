/**
 * Shared types for the app. Convex doc shapes are mapped here for components.
 * Use camelCase for frontend; Convex uses camelCase in schema.
 * IDs can be Convex Id<> or string from API.
 */

export interface Profile {
  _id?: string;
  id?: string;
  userId: string;
  user_id?: string;
  email: string;
  fullName?: string;
  full_name?: string;
  avatarUrl?: string;
  avatar_url?: string;
  bio?: string;
  websiteUrl?: string;
  website_url?: string;
  jobTitle?: string;
  job_title?: string;
  companyName?: string;
  company_name?: string;
  socialLinks?: Record<string, string>;
  social_links?: Record<string, string>;
  credentials?: string[];
  knows_about?: string[];
  verifiedExpert?: boolean;
  verified_expert?: boolean;
  skillLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  skill_level?: string;
  primaryNiche?: string;
  primary_niche?: string;
  subscriptionTier?: "free" | "premium" | "vip";
  subscription_tier?: string;
  emailVerified?: boolean;
  email_verified?: boolean;
  marketingConsent?: boolean;
  marketing_consent?: boolean;
  createdAt?: number;
  created_at?: string;
  updatedAt?: number;
  updated_at?: string;
  lifetime_value?: number;
  lifetimeValue?: number;
}

export interface User extends Profile {
  name?: string;
  niche?: string;
  goal?: string;
  onboarding_completed?: boolean;
}

export interface ContentCategory {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent_id?: string;
  pillarPage?: boolean;
  pillar_page?: boolean;
  seoKeywords?: string[];
  sortOrder?: number;
  created_at?: string;
}

export interface Article {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  category_id?: string;
  category?: ContentCategory | null;
  authorId?: string;
  author_id?: string;
  author?: Profile | null;
  status?: "draft" | "published" | "archived";
  featuredImage?: string;
  featured_image?: string;
  readTime?: number;
  read_time?: number;
  wordCount?: number;
  seoTitle?: string;
  seo_title?: string;
  metaDescription?: string;
  meta_description?: string;
  canonicalUrl?: string;
  canonical_url?: string;
  publishedAt?: number;
  published_at?: string;
  createdAt?: number;
  created_at?: string;
  updatedAt?: number;
  updated_at?: string;
  viewCount?: number;
  view_count?: number;
  tags?: string[];
}

export interface ToolCategory {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
}

export interface Tool {
  _id?: string;
  id?: string;
  name: string;
  categoryId?: string;
  category_id?: string;
  category?: ToolCategory | null;
  description?: string;
  websiteUrl?: string;
  website_url?: string;
  pricing?: string;
  pricingUrl?: string;
  pros?: string[];
  cons?: string[];
  bestFor?: string;
  best_for?: string;
  rating?: number;
  ratingCount?: number;
  rating_count?: number;
  tutorialUrl?: string;
  tutorial_url?: string;
  createdAt?: number;
  created_at?: string;
  affiliate_link?: { destination_url?: string; slug?: string; cta_text?: string } | null;
  affiliate_url?: string | null;
}

export interface Template {
  _id?: string;
  id?: string;
  title: string;
  platform?: string;
  niche?: string;
  type?: string;
  difficulty?: string;
  previewUrl?: string;
  downloadUrl: string;
  download_url?: string;
  fileFormat?: string;
  file_format?: string;
  description?: string;
  tags?: string[];
  downloadCount?: number;
  download_count?: number;
  rating?: number;
  rating_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PlatformGuide {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  platform: string;
  category?: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId?: string;
  author?: Profile | null;
  difficultyLevel?: string;
  difficulty_level?: string;
  readTime?: number;
  read_time?: number;
  viewCount?: number;
  view_count?: number;
  published?: boolean;
  publishedAt?: number;
  toolTags?: string[];
  tool_tags?: string[];
  exampleApplications?: Array<{ feature: string; application: string }>;
  example_applications?: Array<{ feature: string; application: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface LearningModule {
  _id?: string;
  id?: string;
  learningPathId?: string;
  title: string;
  description?: string;
  contentType?: string;
  contentUrl?: string;
  durationMinutes?: number;
  orderIndex?: number;
  order_index?: number;
  prerequisites?: string[];
  level_order?: number;
  level_title?: string;
  key_concepts?: string[];
}

export interface LearningPath {
  _id?: string;
  id?: string;
  name: string;
  trackType?: string;
  track_type?: string;
  description?: string;
  estimatedDuration?: string;
  estimated_duration?: string;
  difficultyLevel?: string;
  difficulty_level?: string;
  orderIndex?: number;
  order_index?: number;
  icon_name?: string;
  featured?: boolean;
  modules?: LearningModule[];
  levels?: Array<{ level_order: number; level_title: string; modules: unknown[] }>;
}

export interface UserLearningProgress {
  id?: string;
  user_id?: string;
  learning_path_id?: string;
  module_id?: string;
  completed?: boolean;
  progress_percentage?: number;
  last_accessed?: string;
  time_spent?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CommunityCategory {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  access_tier?: string;
}

export interface CommunityPost {
  _id?: string;
  id?: string;
  categoryId?: string;
  category_id?: string;
  category?: CommunityCategory | null;
  authorId?: string;
  author_id?: string;
  author?: Profile | null;
  title: string;
  content: string;
  post_type?: string;
  pinned?: boolean;
  status?: string;
  view_count?: number;
  reply_count?: number;
  last_reply_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NicheCategory {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
}

export interface Niche {
  _id?: string;
  id?: string;
  nicheName?: string;
  niche_name?: string;
  categoryId?: string;
  category_id?: string;
  category?: NicheCategory | null;
  profitabilityScore?: number;
  profitability_score?: number;
  difficultyLevel?: string;
  difficulty_level?: string;
  description?: string;
  trend_status?: string;
  estimated_earnings_range?: string;
  avg_rpm?: number;
  startup_cost?: string;
  competition_level?: string;
  best_ai_tools?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  event_type?: string;
  start_date?: string;
  scheduledAt?: number;
  host_id?: string;
  host?: Profile | null;
  status?: string;
  current_participants?: number;
  maxAttendees?: number;
  max_participants?: number;
  featured_image?: string;
  price?: number;
  currency?: string;
  registration_open?: boolean;
  registration_url?: string;
  registration_deadline?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  _id?: string;
  id?: string;
  email: string;
  source?: string;
  created_at?: string;
  subscribedAt?: number;
}

export interface Challenge {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  difficulty_level?: string;
  duration_days?: number;
  current_participants?: number;
  max_participants?: number;
  status?: string;
  registration_open?: boolean;
  featured_image?: string;
  prizes?: string[];
  leaderboard_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}
