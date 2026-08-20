import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { ShieldCheck, RefreshCw, Sparkles, FileCheck2 } from "lucide-react";

interface ArticleTrustBlockProps {
  publishedAt?: string; // ISO date
  lastReviewedAt?: number; // epoch ms
  reviewerId?: string;
  methodologyNotes?: string;
  aiAssistanceDisclosure?: string;
  className?: string;
}

function fmt(ts?: number): string | null {
  if (!ts) return null;
  try {
    return format(new Date(ts), "MMM d, yyyy");
  } catch {
    return null;
  }
}

/**
 * E-E-A-T trust strip rendered directly under the article H1 (P1).
 * Surfaces freshness (last reviewed), human review, methodology, and any
 * AI-assistance disclosure — the transparency signals Google's quality
 * raters and privacy-conscious readers look for.
 */
export default function ArticleTrustBlock({
  publishedAt,
  lastReviewedAt,
  reviewerId,
  methodologyNotes,
  aiAssistanceDisclosure,
  className = "",
}: ArticleTrustBlockProps) {
  const reviewer = useQuery(
    api.profiles.get,
    reviewerId ? { id: reviewerId as never } : "skip"
  );

  const reviewedLabel = fmt(lastReviewedAt);
  const publishedLabel = publishedAt ? fmt(new Date(publishedAt).getTime()) : null;
  const reviewerName = !reviewer
    ? undefined
    : (reviewer.fullName ?? (reviewer as { full_name?: string }).full_name ?? undefined);

  const showMeta = Boolean(reviewedLabel || reviewerName || publishedLabel || methodologyNotes || aiAssistanceDisclosure);
  if (!showMeta) return null;

  return (
    <div
      className={`mt-4 rounded-xl border border-primary/10 bg-muted/40 px-4 py-3 text-sm text-muted-foreground ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {publishedLabel && (
          <span className="inline-flex items-center gap-1.5">
            <FileCheck2 className="h-4 w-4 text-primary" />
            Published {publishedLabel}
          </span>
        )}
        {reviewedLabel && (
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-primary" />
            Last reviewed {reviewedLabel}
          </span>
        )}
        {reviewerName && (
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Reviewed by {reviewerName}
          </span>
        )}
        {aiAssistanceDisclosure && (
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            {aiAssistanceDisclosure}
          </span>
        )}
      </div>
      {methodologyNotes && (
        <p className="mt-2 border-t border-border/60 pt-2 text-xs leading-relaxed">
          <span className="font-semibold text-foreground/80">How we verified this:</span>{" "}
          {methodologyNotes}
        </p>
      )}
    </div>
  );
}
