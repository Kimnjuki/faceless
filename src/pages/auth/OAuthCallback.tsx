import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('OAuth error:', error);
          navigate('/auth/login?error=oauth_failed');
          return;
        }

        if (session?.user) {
          // Check if profile record exists, create if not
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          if (!existingProfile) {
            // Create profile record for OAuth users
            try {
              await supabase.from('profiles').insert({
                user_id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] || '',
              });
            } catch (insertError: any) {
              // Ignore duplicate key errors
              if (insertError.code !== '23505') {
                console.error('Error creating profile record:', insertError);
              }
            }
          }

          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/auth/login?error=oauth_failed');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

