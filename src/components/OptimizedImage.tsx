import React, { useState, useRef, useEffect } from 'react';
import { getImage, IMAGES } from '@/config/images';

interface OptimizedImageProps {
  src: string;
  alt: string;
  category?: keyof typeof IMAGES;
  key?: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  fallbackCategory?: keyof typeof IMAGES;
  fallbackKey?: string;
  onError?: (error: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

// Helper type for nested image objects
type ImageCategory = {
  [key: string]: string;
};

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Responsive picture tags for optimal loading
 * - Lazy loading for performance
 * - Fallback handling with gradient backgrounds
 * - SEO-friendly alt text
 * - Consistent styling with img-fluid and rounded classes
 * - Error handling with graceful fallbacks
 */
export default function OptimizedImage({
  src,
  alt,
  category,
  key: imageKey,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  priority = false,
  fallbackCategory = 'fallbacks',
  fallbackKey = 'default',
  onError,
  onLoad
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Get fallback image if category and key are provided
  const fallbackSrc = category && imageKey 
    ? (IMAGES[category] as ImageCategory)?.[imageKey] || IMAGES.fallbacks[fallbackKey]
    : IMAGES.fallbacks[fallbackKey];

  // Handle image error
  const handleError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Image failed to load: ${src}`);
    setHasError(true);
    onError?.(error);
  };

  // Handle image load
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  // Generate responsive srcset for different screen sizes
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('unsplash.com')) return baseSrc;
    
    // Generate different sizes for Unsplash images
    const sizes = [
      `${baseSrc}&w=400 400w`,
      `${baseSrc}&w=800 800w`,
      `${baseSrc}&w=1200 1200w`,
      `${baseSrc}&w=1600 1600w`
    ];
    
    return sizes.join(', ');
  };

  // Generate fallback gradient style
  const getFallbackStyle = () => {
    if (!hasError) return {};
    
    // Generate gradient based on category
    const gradients: Record<string, string> = {
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      aiTools: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      privacy: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      contentCreation: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      monetization: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      learning: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      tools: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      community: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    };
    
    return {
      background: gradients[category || ''] || gradients.hero,
      minHeight: height || 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500'
    };
  };

  // If image has error, show fallback
  if (hasError) {
    return (
      <div 
        className={`img-fluid rounded ${className}`}
        style={getFallbackStyle()}
        role="img"
        aria-label={alt}
      >
        <span>{alt}</span>
      </div>
    );
  }

  // Generate picture element for responsive images
  const PictureComponent = () => (
    <picture>
      {/* WebP source for modern browsers */}
      {src.includes('unsplash.com') && (
        <source
          srcSet={generateSrcSet(src).replace(/\.jpg/g, '.webp')}
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      {/* Fallback to original format */}
      <img
        ref={imgRef}
        src={src}
        srcSet={src.includes('unsplash.com') ? generateSrcSet(src) : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        className={`img-fluid rounded transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-75'
        } ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </picture>
  );

  return (
    <div className="relative overflow-hidden rounded">
      <PictureComponent />
      
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Error fallback overlay */}
      {hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40 rounded"
          style={getFallbackStyle()}
        >
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm font-medium">{alt}</div>
            <div className="text-xs opacity-75 mt-1">Image unavailable</div>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS for shimmer effect
const shimmerCSS = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Inject shimmer CSS into head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerCSS;
  document.head.appendChild(style);
}
