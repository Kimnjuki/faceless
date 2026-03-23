import ContributorCard from "./ContributorCard";

/**
 * E-E-A-T author block for articles and guides (semantic wrapper).
 */
export default function AuthorBio({
  profileId,
  className,
}: {
  profileId: string;
  className?: string;
}) {
  return <ContributorCard profileId={profileId} showFullBio className={className} />;
}
