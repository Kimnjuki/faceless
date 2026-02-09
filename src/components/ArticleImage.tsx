import { useState } from "react";

const DEFAULT_PLACEHOLDER = "/images/default-article-placeholder.svg";

interface ArticleImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  fallback?: string;
  loading?: "lazy" | "eager";
  className?: string;
}

/**
 * Article featured image with fallback for broken URLs.
 * Uses lazy loading by default. Falls back to placeholder on error.
 */
export default function ArticleImage({
  src,
  alt,
  fallback = DEFAULT_PLACEHOLDER,
  loading = "lazy",
  className = "",
  ...props
}: ArticleImageProps) {
  const [error, setError] = useState(false);
  const effectiveSrc = error || !src ? fallback : src;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}
