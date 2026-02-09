/**
 * ContributorCard Component
 *
 * Displays expert contributor information with E-E-A-T signals
 * Includes Person JSON-LD schema for 2026 AI search optimization
 *
 * Features:
 * - Expert Verified badge for verified_expert profiles
 * - KnowsAbout tags for niche authority
 * - Social links with sameAs schema
 * - WorksFor relationship to Organization
 */

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "@/lib/convex-ids";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ExternalLink, CheckCircle2, Linkedin, Twitter, Github, Globe } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface ContributorProfile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  job_title: string | null;
  company_name: string | null;
  social_links: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  } | null;
  credentials: string[] | null;
  knows_about: string[] | null;
  verified_expert: boolean;
}

interface ContributorCardProps {
  profileId: string;
  className?: string;
  showFullBio?: boolean;
}

export default function ContributorCard({
  profileId,
  className = "",
  showFullBio = false,
}: ContributorCardProps) {
  const profileDoc = useQuery(
    api.profiles.get,
    profileId ? { id: profileId as Id<"profiles"> } : "skip"
  );

  const profile: ContributorProfile | null = profileDoc
    ? {
        id: profileDoc._id ?? profileId,
        full_name: profileDoc.fullName ?? null,
        bio: profileDoc.bio ?? null,
        avatar_url: profileDoc.avatarUrl ?? null,
        website_url: profileDoc.websiteUrl ?? null,
        job_title: profileDoc.jobTitle ?? null,
        company_name: profileDoc.companyName ?? null,
        social_links: profileDoc.socialLinks ?? null,
        credentials: profileDoc.credentials ?? null,
        knows_about: profileDoc.knowsAbout ?? null,
        verified_expert: profileDoc.verifiedExpert ?? false,
      }
    : null;

  const loading = profileId != null && profileDoc === undefined;
  const error = profileId != null && profileDoc === null ? "Profile not found" : null;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading contributor...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return null;
  }

  const displayName = profile.full_name || "Contributor";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    ...(profile.bio && { description: profile.bio }),
    ...(profile.avatar_url && { image: profile.avatar_url }),
    ...(profile.job_title && { jobTitle: profile.job_title }),
    ...(profile.company_name && {
      worksFor: { "@type": "Organization", name: profile.company_name },
    }),
    ...(profile.website_url && { url: profile.website_url }),
    ...(profile.social_links && {
      sameAs: [
        profile.social_links.linkedin,
        profile.social_links.twitter,
        profile.social_links.github,
      ].filter(Boolean),
    }),
    ...(profile.knows_about?.length && { knowsAbout: profile.knows_about }),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={displayName} />
              <AvatarFallback className="text-lg">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">{displayName}</h3>
                {profile.verified_expert && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Expert
                  </Badge>
                )}
              </div>
              {profile.job_title && (
                <p className="text-sm text-muted-foreground">{profile.job_title}</p>
              )}
              {profile.company_name && (
                <p className="text-sm text-muted-foreground">{profile.company_name}</p>
              )}
              {showFullBio && profile.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
              )}
              {profile.knows_about && profile.knows_about.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.knows_about.slice(0, 5).map((topic, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {profile.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {profile.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {profile.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
