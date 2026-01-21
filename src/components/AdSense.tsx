import { useEffect, useRef } from 'react';

interface AdSenseProps {
  /**
   * AdSense ad slot ID (format: "1234567890/1234567890")
   * Get this from your AdSense account after creating an ad unit
   */
  adSlot?: string;
  
  /**
   * Ad format type
   * - 'auto': Responsive ad (recommended)
   * - 'in-article': In-article ad
   * - 'in-feed': In-feed ad
   * - 'display': Display ad
   */
  format?: 'auto' | 'in-article' | 'in-feed' | 'display';
  
  /**
   * Ad size (for non-responsive ads)
   * Format: 'WIDTHxHEIGHT' (e.g., '728x90', '300x250')
   */
  adSize?: string;
  
  /**
   * Full-width responsive ad (for auto format)
   */
  fullWidthResponsive?: boolean;
  
  /**
   * Custom CSS class
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Ad unit name/identifier for tracking
   */
  name?: string;
}

/**
 * Google AdSense Component
 * Displays Google AdSense ads using the adsbygoogle API
 * 
 * Usage:
 * <AdSense format="auto" fullWidthResponsive />
 * <AdSense format="in-article" adSlot="1234567890/1234567890" />
 * <AdSense format="display" adSize="728x90" adSlot="1234567890/1234567890" />
 */
export default function AdSense({
  adSlot,
  format = 'auto',
  adSize,
  fullWidthResponsive = true,
  className = '',
  style = {},
  name
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adClient = 'ca-pub-9278124025449370';

  useEffect(() => {
    if (!adRef.current || typeof window === 'undefined') return;

    // Check if adsbygoogle is loaded
    if (!window.adsbygoogle) {
      console.warn('AdSense script not loaded. Make sure the AdSense script is included in index.html');
      return;
    }

    try {
      // Push ad configuration to adsbygoogle
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error initializing AdSense:', error);
    }
  }, []);

  // Generate ad slot if not provided (for auto ads)
  const getAdSlot = () => {
    if (adSlot) return adSlot;
    // Auto ads don't need adSlot
    return undefined;
  };

  // Build style based on format
  const getAdStyle = () => {
    const baseStyle: React.CSSProperties = {
      display: 'block',
      textAlign: 'center',
      ...style
    };

    if (format === 'auto' && fullWidthResponsive) {
      return {
        ...baseStyle,
        width: '100%',
        minHeight: '100px'
      };
    }

    if (adSize) {
      const [width, height] = adSize.split('x').map(Number);
      return {
        ...baseStyle,
        width: `${width}px`,
        height: `${height}px`,
        margin: '0 auto'
      };
    }

    return baseStyle;
  };

  // Get data-ad-format attribute
  const getDataAdFormat = () => {
    if (format === 'auto') return 'auto';
    if (format === 'in-article') return 'fluid';
    if (format === 'in-feed') return 'fluid';
    return undefined;
  };

  return (
    <div
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        margin: '1rem 0',
        minHeight: format === 'auto' ? '100px' : undefined,
        ...getAdStyle()
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...getAdStyle()
        }}
        data-ad-client={adClient}
        data-ad-slot={getAdSlot()}
        data-ad-format={getDataAdFormat()}
        data-full-width-responsive={fullWidthResponsive ? 'true' : undefined}
        data-ad-layout={format === 'in-article' ? 'in-article' : undefined}
        aria-label={name || 'Advertisement'}
      />
    </div>
  );
}

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

