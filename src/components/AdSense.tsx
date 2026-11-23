import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ADSENSE_CLIENT, isAdsAllowed } from '@/config/adsAllowed';

interface AdSenseProps {
  adSlot?: string;
  format?: 'auto' | 'in-article' | 'in-feed' | 'display';
  adSize?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
}

const SCRIPT_ID = 'adsense-loader';

function ensureAdSenseScript(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SCRIPT_ID)) return;
  const existing = document.querySelector(
    `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`,
  );
  if (existing) return;
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.onerror = () => console.warn('AdSense script failed to load');
  document.head.appendChild(script);
}

/**
 * Google AdSense unit. Only mounts on ads_allowed routes (T6.1).
 * Script is loaded on demand — not globally from index.html.
 */
export default function AdSense({
  adSlot,
  format = 'auto',
  adSize,
  fullWidthResponsive = true,
  className = '',
  style = {},
  name,
}: AdSenseProps) {
  const { pathname } = useLocation();
  const allowed = isAdsAllowed(pathname);
  const adRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!allowed || !adRef.current || typeof window === 'undefined' || isInitializedRef.current) {
      return;
    }

    ensureAdSenseScript();

    const timer = setTimeout(() => {
      if (!adRef.current) return;

      const adElement = adRef.current.querySelector('ins.adsbygoogle');
      if (adElement && adElement.getAttribute('data-ads-initialized')) {
        return;
      }

      const rect = adRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('AdSense container has zero dimensions, skipping ad initialization');
        return;
      }

      try {
        isInitializedRef.current = true;
        if (adElement) {
          adElement.setAttribute('data-ads-initialized', 'true');
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error initializing AdSense:', error);
        isInitializedRef.current = false;
        if (adElement) {
          adElement.removeAttribute('data-ads-initialized');
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      isInitializedRef.current = false;
    };
  }, [allowed, adSlot, format, pathname]);

  if (!allowed) return null;

  const getAdStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'block',
      textAlign: 'center',
      ...style,
    };

    if (format === 'auto' && fullWidthResponsive) {
      return { ...baseStyle, width: '100%', minHeight: '100px' };
    }

    if (adSize) {
      const [width, height] = adSize.split('x').map(Number);
      return {
        ...baseStyle,
        width: `${width}px`,
        height: `${height}px`,
        margin: '0 auto',
      };
    }

    return baseStyle;
  };

  const getDataAdFormat = () => {
    if (format === 'auto') return 'auto';
    if (format === 'in-article' || format === 'in-feed') return 'fluid';
    return undefined;
  };

  const adId = `adsense-${adSlot || 'auto'}-${format}-${adSize || 'responsive'}-${name || 'default'}`;

  return (
    <div
      key={adId}
      ref={adRef}
      className={`adsense-container ${className}`}
      style={{
        margin: '1rem 0',
        minHeight: format === 'auto' ? '100px' : undefined,
        ...getAdStyle(),
      }}
    >
      <ins
        key={`${adId}-ins-${pathname}`}
        className="adsbygoogle"
        style={{ display: 'block', ...getAdStyle() }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={getDataAdFormat()}
        data-full-width-responsive={fullWidthResponsive ? 'true' : undefined}
        data-ad-layout={format === 'in-article' ? 'in-article' : undefined}
        aria-label={name || 'Advertisement'}
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
