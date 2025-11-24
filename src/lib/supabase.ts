import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fvvpfueoaacijowkpdsf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dnBmdWVvYWFjaWpvd2twZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzYwODIsImV4cCI6MjA3OTAxMjA4Mn0.4PMgaMn33jJ36tN7UISTBbsCKTczhAlquQTkqAq7ApI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Lead {
  id: string;
  email: string;
  source?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  niche?: string;
  goal?: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  created_at: string;
}

