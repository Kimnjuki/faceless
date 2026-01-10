import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: SupabaseUser | null; error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ user: SupabaseUser | null; error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; niche?: string; goal?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Handle OAuth sign in - create user record if needed
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Check if profile record exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          // Create profile record if it doesn't exist (for OAuth users)
          if (!existingProfile) {
            const userMetadata = session.user.user_metadata || {};
            const { error: insertError } = await supabase.from('profiles').insert({
              user_id: session.user.id,
              email: session.user.email || '',
              full_name: userMetadata.full_name || 
                        userMetadata.name || 
                        userMetadata.preferred_username ||
                        session.user.email?.split('@')[0] || '',
            });
            
            // Ignore duplicate key errors
            if (insertError && insertError.code !== '23505') {
              console.error('Error creating profile record:', insertError);
            }
          }
        } catch (error) {
          // User table might not exist yet, that's okay
          console.warn('Could not check/create user record:', error);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { user: null, error };
      }

      toast.success('Signed in successfully!');
      return { user: data.user, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      return { user: null, error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
        return { user: null, error };
      }

            // Create profile record in profiles table
            if (data.user) {
              try {
                const { error: insertError } = await supabase.from('profiles').insert({
                  user_id: data.user.id,
                  email: data.user.email || email,
                  full_name: name || '',
                });

                if (insertError && insertError.code !== '23505') {
                  // Ignore duplicate key errors (profile already exists)
                  console.error('Error creating profile record:', insertError);
                }
              } catch (insertErr) {
                // Profiles table might not exist yet, that's okay
                console.warn('Could not create profile record:', insertErr);
              }
            }

      // Check if email confirmation is required
      // If session is null, Supabase requires email confirmation
      if (!data.session && data.user) {
        toast.success('Account created! Please check your email to verify your account.', { duration: 6000 });
        return { user: data.user, error: null };
      }

      // If session exists, user is immediately signed in (email confirmation disabled)
      if (data.session) {
        toast.success('Account created successfully!');
        return { user: data.user, error: null };
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      return { user: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        // Check if it's the "provider not enabled" error
        if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
          toast.error(
            'Google sign-in is not enabled. Please enable it in Supabase Dashboard → Authentication → Providers → Google',
            { duration: 6000 }
          );
        } else {
          toast.error(error.message || 'Failed to sign in with Google');
        }
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
        toast.error(
          'Google sign-in is not enabled. Please enable it in Supabase Dashboard → Authentication → Providers → Google',
          { duration: 6000 }
        );
      } else {
        toast.error(error.message || 'Failed to sign in with Google');
      }
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const updateProfile = async (data: { name?: string; niche?: string; goal?: string }) => {
    if (!user) throw new Error('No user logged in');

    // Map legacy fields to profile fields
    const updateData: Record<string, any> = {};
    if (data.name) updateData.full_name = data.name;
    if (data.niche) updateData.primary_niche = data.niche;
    // Note: 'goal' field doesn't exist in profiles table, but we'll keep it for backward compatibility

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id);

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Profile updated!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

