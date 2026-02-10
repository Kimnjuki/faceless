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
      // GPT script not loaded, skip ad initialization
      return;
    }

    const googletag = window.googletag;
    if (!googletag.cmd || !googletag.defineSlot || !googletag.pubads || !googletag.display) {
      // GPT not fully initialized, skip
      return;
    }

    // Define ad slot
    googletag.cmd!.push(() => {
      try {
        const slot = googletag.defineSlot!(adUnitPath, adSize, adSlot);
        const pubads = googletag.pubads!();
        
        if (slot && pubads) {
          // Enable services
          slot.addService(pubads);
          
          // Set targeting if needed
          // slot.setTargeting('key', 'value');
          
          // Enable SRA (Single Request Architecture)
          pubads.enableSingleRequest();
          pubads.enableAsyncRendering();
          
          // Collapse empty divs
          pubads.collapseEmptyDivs();
          
          // Disable initial load (we'll load manually)
          if (pubads.disableInitialLoad) {
            pubads.disableInitialLoad();
          }
          
          // Enable lazy loading
          pubads.enableLazyLoad({
            fetchMarginPercent: 100,
            renderMarginPercent: 50,
            mobileScaling: 2.0
          });
          
          // Display the ad
          googletag.display!(adSlot);
          
          // Refresh the ad
          pubads.refresh([slot]);
        }
      } catch (error) {
        console.warn('Ad unit initialization error:', error);
      }
    });

    // Cleanup
    return () => {
      if (googletag && googletag.apiReady && googletag.cmd && googletag.pubads && googletag.destroySlots) {
        googletag.cmd.push(() => {
          try {
            const pubads = googletag.pubads!();
            if (pubads && pubads.getSlots) {
              const slots = pubads.getSlots();
              slots.forEach((slot: any) => {
                if (slot.getSlotElementId() === adSlot) {
                  googletag.destroySlots!([slot]);
                }
              });
            }
          } catch (error) {
            console.warn('Ad unit cleanup error:', error);
          }
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


