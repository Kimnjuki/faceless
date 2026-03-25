import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEO from '@/components/SEO';
import { isAuth0Configured } from '@/lib/auth0';

const hasAuth0 = isAuth0Configured();

function OAuthCallbackWithAuth0() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error('OAuth error:', error);
      const q = new URLSearchParams();
      const anyErr = error as { error?: string; message?: string; error_description?: string };
      const code = anyErr.error ?? anyErr.message ?? 'oauth_failed';
      q.set('error', code);
      const desc = anyErr.error_description ?? anyErr.message;
      if (desc && desc !== code) q.set('error_description', desc);
      navigate(`/auth/login?${q.toString()}`);
      return;
    }
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth/login');
    }
  }, [isAuthenticated, isLoading, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

function OAuthCallbackFallback() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/auth/login');
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <>
      <SEO
        title="Completing Secure Sign In | ContentAnonymity"
        description="Completing your secure OAuth sign in. This intermediary callback page is not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/auth/callback"
      />
      {hasAuth0 ? <OAuthCallbackWithAuth0 /> : <OAuthCallbackFallback />}
    </>
  );
}
