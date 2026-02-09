import { useEffect, useRef, useState } from 'react';
import { lazyLoadImage, getOptimalImageFormat } from '@/utils/imageOptimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  className?: string;
}

/**
 * Optimized image component with lazy loading and WebP support
 * Improves mobile page speed by deferring non-critical image loads
 */
export default function OptimizedImage({
  src,
  alt,
  srcSet,
  sizes,
  loading = 'lazy',
  placeholder,
  className = '',
  ...props
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imgRef.current || loading === 'eager') {
      return;
    }

    // Use native lazy loading if supported, otherwise use intersection observer
    if ('loading' in HTMLImageElement.prototype) {
      imgRef.current.loading = 'lazy';
      setIsLoaded(true);
    } else {
      const cleanup = lazyLoadImage(imgRef.current, src);
      return cleanup;
    }
  }, [src, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Optimize image format
  const optimizedSrc = getOptimalImageFormat(src);

  return (
    <img
      ref={imgRef}
      src={loading === 'eager' ? optimizedSrc : placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
      data-src={optimizedSrc}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      style={{
        ...(hasError && { display: 'none' }),
      }}
      {...props}
    />
  );
}



