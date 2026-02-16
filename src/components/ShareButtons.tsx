import { Twitter, Linkedin, Link2, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trackShare } from "@/utils/analytics";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  contentType?: string;
  contentId?: string;
  variant?: "default" | "compact";
}

export default function ShareButtons({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "ContentAnonymity - Build Your Faceless Content Empire",
  description = "Discover the system 10,000+ creators use to earn 6-figures anonymously.",
  contentType = "page",
  contentId,
  variant = "default",
}: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      platform: "twitter",
      label: "Share on Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
    {
      platform: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      platform: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
  ];

  const handleShare = (platform: string) => {
    trackShare(platform, contentType, contentId);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackShare("copy_link", contentType, contentId);
      toast.success("Link copied to clipboard");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      trackShare("copy_link", contentType, contentId);
      toast.success("Link copied to clipboard");
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2" role="group" aria-label="Share this content">
        <span className="text-sm text-muted-foreground mr-2">Share:</span>
        {shareLinks.map(({ platform, href, icon: Icon }) => (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${platform}`}
            onClick={() => handleShare(platform)}
            className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy link"
          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        >
          <Link2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Share this content">
      <span className="text-sm font-medium text-muted-foreground w-full mb-2">Share this page:</span>
      {shareLinks.map(({ platform, label, href, icon: Icon }) => (
        <Button
          key={platform}
          variant="outline"
          size="sm"
          asChild
          className="gap-2"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare(platform)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
        <Link2 className="h-4 w-4" />
        Copy Link
      </Button>
    </div>
  );
}
