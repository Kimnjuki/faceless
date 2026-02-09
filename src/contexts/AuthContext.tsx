import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

/** Minimal user shape compatible with existing UI (Supabase used id, email, user_metadata). */
export interface AuthUser {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
}

export interface AuthContextType {
  user: AuthUser | null;
  session: { user: AuthUser } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; niche?: string; goal?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FALLBACK_AUTH: AuthContextType = {
  user: null,
  session: null,
  loading: false,
  signIn: async () => {
    toast.error("Auth not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID.");
    return { user: null, error: new Error("Not configured") };
  },
  signUp: async () => {
    toast.error("Auth not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID.");
    return { user: null, error: new Error("Not configured") };
  },
  signInWithGoogle: async () => {
    toast.error("Auth not configured.");
    return { error: new Error("Not configured") };
  },
  signOut: async () => {},
  updateProfile: async () => {
    throw new Error("No user logged in");
  },
};

/** Use when Auth0 is configured; must be inside Auth0Provider. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading: auth0Loading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const upsertFromAuth = useMutation(api.profiles.upsertFromAuth);
  const updateProfileMutation = useMutation(api.profiles.update);

  const user: AuthUser | null = auth0User
    ? {
        id: auth0User.sub!,
        email: auth0User.email ?? null,
        user_metadata: {
          full_name: auth0User.name ?? undefined,
          name: auth0User.name ?? undefined,
          avatar_url: auth0User.picture ?? undefined,
        },
      }
    : null;

  const session = user ? { user } : null;

  useEffect(() => {
    if (!isAuthenticated || !auth0User) return;
    (async () => {
      try {
        await upsertFromAuth({
          userId: auth0User.sub!,
          email: auth0User.email ?? "",
          fullName: auth0User.name ?? auth0User.email?.split("@")[0] ?? "",
          avatarUrl: auth0User.picture ?? undefined,
        });
      } catch (e) {
        console.warn("Profile sync to Convex failed:", e);
      }
    })();
  }, [isAuthenticated, auth0User, upsertFromAuth]);

  const signIn = async (_email: string, _password: string) => {
    try {
      await loginWithRedirect();
      return { user: null, error: null };
    } catch (e: any) {
      toast.error(e?.message ?? "Sign in failed");
      return { user: null, error: e ?? null };
    }
  };

  const signUp = async (_email: string, _password: string, _name?: string) => {
    try {
      await loginWithRedirect({ authorizationParams: { screen_hint: "signup" } });
      return { user: null, error: null };
    } catch (e: any) {
      toast.error(e?.message ?? "Sign up failed");
      return { user: null, error: e ?? null };
    }
  };

  const signInWithGoogle = async () => {
    try {
      await loginWithRedirect({ authorizationParams: { connection: "google" } });
      return { error: null };
    } catch (e: any) {
      toast.error(e?.message ?? "Google sign in failed");
      return { error: e ?? null };
    }
  };

  const signOut = async () => {
    try {
      logout({ logoutParams: { returnTo: window.location.origin } });
      toast.success("Signed out successfully");
    } catch (e: any) {
      toast.error(e?.message ?? "Sign out failed");
      throw e;
    }
  };

  const updateProfile = async (data: { name?: string; niche?: string; goal?: string }) => {
    if (!user) throw new Error("No user logged in");
    try {
      await updateProfileMutation({
        userId: user.id,
        fullName: data.name,
        primaryNiche: data.niche,
      });
      toast.success("Profile updated!");
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
      throw e;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading: auth0Loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Use when Auth0 is not configured; provides null user and no-op auth. */
export function AuthProviderFallback({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={FALLBACK_AUTH}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
