import { useMutation } from "convex/react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { User } from "@/types";

export function useUser() {
  const { user: authUser } = useAuth();
  const profile = useQuery(
    api.profiles.getByUserId,
    authUser?.id ? { userId: authUser.id } : "skip"
  );
  const updateProfileMutation = useMutation(api.profiles.update);

  const user: User | null =
    authUser && profile
      ? {
          ...profile,
          id: profile.userId,
          user_id: profile.userId,
          name: profile.fullName,
          full_name: profile.fullName,
          niche: profile.primaryNiche,
          primary_niche: profile.primaryNiche,
        } as User
      : authUser
        ? ({
            id: authUser.id,
            user_id: authUser.id,
            email: authUser.email ?? "",
            name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name,
            full_name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name,
          } as User)
        : null;

  const loading = authUser != null && profile === undefined;

  const updateUser = async (data: Partial<User>) => {
    if (!authUser) return;
    await updateProfileMutation({
      userId: authUser.id,
      fullName: data.name ?? data.full_name,
      primaryNiche: data.niche ?? data.primary_niche,
      bio: data.bio,
      websiteUrl: data.website_url ?? data.websiteUrl,
    });
  };

  return { user, loading, updateUser };
}
