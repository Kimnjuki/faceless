import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Profile } from "@/types";

interface MemberFilters {
  skillLevel?: string;
  niche?: string;
  subscriptionTier?: string;
  searchQuery?: string;
}

function toProfile(p: any): Profile {
  return {
    ...p,
    id: p._id ?? p.id,
    user_id: p.userId,
    full_name: p.fullName,
    avatar_url: p.avatarUrl,
    website_url: p.websiteUrl,
    job_title: p.jobTitle,
    company_name: p.companyName,
    social_links: p.socialLinks,
    skill_level: p.skillLevel,
    primary_niche: p.primaryNiche,
    subscription_tier: p.subscriptionTier,
    email_verified: p.emailVerified,
    marketing_consent: p.marketingConsent,
    created_at: p.createdAt != null ? new Date(p.createdAt).toISOString() : undefined,
    updated_at: p.updatedAt != null ? new Date(p.updatedAt).toISOString() : undefined,
  };
}

export function useMembers(filters: MemberFilters = {}) {
  const raw = useQuery(api.profiles.list, {});

  const members: Profile[] = useMemo(() => {
    let list = (raw ?? []).map(toProfile);
    if (filters.skillLevel && filters.skillLevel !== "all")
      list = list.filter((m) => m.skillLevel ?? m.skill_level === filters.skillLevel);
    if (filters.niche && filters.niche !== "all")
      list = list.filter((m) => (m.primaryNiche ?? m.primary_niche) === filters.niche);
    if (filters.subscriptionTier && filters.subscriptionTier !== "all")
      list = list.filter((m) => (m.subscriptionTier ?? m.subscription_tier) === filters.subscriptionTier);
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          (m.fullName ?? m.full_name ?? "").toLowerCase().includes(q) ||
          (m.email ?? "").toLowerCase().includes(q) ||
          (m.primaryNiche ?? m.primary_niche ?? "").toLowerCase().includes(q) ||
          (m.bio ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [raw, filters.skillLevel, filters.niche, filters.subscriptionTier, filters.searchQuery]);

  const loading = raw === undefined;
  const error: string | null = null;

  return { members, loading, error, refetch: () => {} };
}
