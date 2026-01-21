import { useEffect, useRef } from 'react';

interface AdUnitProps {
  adSlot: string;
  adSize: [number, number] | [number, number][];
  adUnitPath?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Google Ad Manager Ad Unit Component
 * Displays ads using Google Ad Manager (formerly DFP)
 */
export default function AdUnit({
  adSlot,
  adSize,
  adUnitPath = '/123456789/contentanonymity',
  className = '',
  style = {}
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || typeof window === 'undefined') return;

    // Initialize Google Ad Manager
    if (!window.googletag) {
      window.googletag = window.googletag || {};
      window.googletag.cmd = window.googletag.cmd || [];
    }

    const googletag = window.googletag;

    // Define ad slot
    googletag.cmd.push(() => {
      const slot = googletag.defineSlot(adUnitPath, adSize, adSlot);
      
      if (slot) {
        // Enable services
        slot.addService(googletag.pubads());
        
        // Set targeting if needed
        // slot.setTargeting('key', 'value');
        
        // Enable SRA (Single Request Architecture)
        googletag.pubads().enableSingleRequest();
        googletag.pubads().enableAsyncRendering();
        
        // Collapse empty divs
        googletag.pubads().collapseEmptyDivs();
        
        // Disable initial load (we'll load manually)
        googletag.pubads().disableInitialLoad();
        
        // Enable lazy loading
        googletag.pubads().enableLazyLoad({
          fetchMarginPercent: 100,
          renderMarginPercent: 50,
          mobileScaling: 2.0
        });
        
        // Display the ad
        googletag.display(adSlot);
        
        // Refresh the ad
        googletag.pubads().refresh([slot]);
      }
    });

    // Cleanup
    return () => {
      if (googletag && googletag.apiReady) {
        googletag.cmd.push(() => {
          const slots = googletag.pubads().getSlots();
          slots.forEach((slot: any) => {
            if (slot.getSlotElementId() === adSlot) {
              googletag.destroySlots([slot]);
            }
          });
        });
      }
    };
  }, [adSlot, adSize, adUnitPath]);

  return (
    <div
      ref={adRef}
      id={adSlot}
      className={`ad-unit ${className}`}
      style={{
        minHeight: Array.isArray(adSize[0]) ? '250px' : `${adSize[1]}px`,
        ...style
      }}
      aria-label="Advertisement"
    />
  );
}

// Extend Window interface
declare global {
  interface Window {
    googletag: any;
    pbjs: any;
  }
}


