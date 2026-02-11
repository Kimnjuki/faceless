import { useState } from "react";

const DEFAULT_PLACEHOLDER = "/images/default-article-placeholder.svg";

// Content creation themed placeholders
const CONTENT_PLACEHOLDERS = [
  "/images/content-creation-placeholder.svg",
  "/images/faceless-strategy-placeholder.svg", 
  "/images/monetization-placeholder.svg",
  "/images/default-article-placeholder.svg"
];

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
 * Prevents CLS by setting explicit dimensions.
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
  const [loaded, setLoaded] = useState(false);
  
  // Use random themed placeholder for better visual variety
  const effectiveFallback = CONTENT_PLACEHOLDERS[Math.floor(Math.random() * CONTENT_PLACEHOLDERS.length)];
  const effectiveSrc = error || !src ? effectiveFallback : src;

  return (
    <div className="relative overflow-hidden">
      <img
        src={effectiveSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'cover',
          aspectRatio: '16/9'
        }}
        {...props}
      />
      {!loaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ aspectRatio: '16/9' }}
        />
      )}
    </div>
  );
}
