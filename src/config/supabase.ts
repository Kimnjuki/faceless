// Supabase Configuration
// Centralized config for all Supabase API calls
// NOTE: This file is kept for backward compatibility
// New code should use src/lib/supabase.ts for the Supabase client

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://fvvpfueoaacijowkpdsf.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dnBmdWVvYWFjaWpvd2twZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzYwODIsImV4cCI6MjA3OTAxMjA4Mn0.4PMgaMn33jJ36tN7UISTBbsCKTczhAlquQTkqAq7ApI'
};

// Helper function for making Supabase API calls
export async function supabaseFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${supabaseConfig.url}/rest/v1/${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'apikey': supabaseConfig.anonKey,
    'Authorization': `Bearer ${supabaseConfig.anonKey}`,
    'Prefer': 'return=minimal'
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase API error: ${response.statusText}`);
  }

  return response;
}

// Specific API functions
export const supabaseApi = {
  // Lead capture
  async createLead(email: string, source?: string) {
    return supabaseFetch('leads', {
      method: 'POST',
      body: JSON.stringify({ email, source })
    });
  },

  // User management
  async createUser(data: { email: string; name?: string; niche?: string; goal?: string }) {
    return supabaseFetch('users', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateUser(id: string, data: Partial<{ name: string; niche: string; goal: string; onboarding_completed: boolean }>) {
    return supabaseFetch(`users?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async getUser(id: string) {
    const response = await supabaseFetch(`users?id=eq.${id}`, {
      method: 'GET'
    });
    return response.json();
  }
};
