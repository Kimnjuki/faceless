/**
 * Global type augmentations for window, gtag, and dataLayer.
 * Reduces (window as any) usage in analytics.
 */
export {};

declare global {
  interface Window {
    __GA4_INITIALIZED__?: boolean;
    dataLayer?: unknown[];
    /** Google gtag (variadic); args are [command, ...rest] */
    gtag?: (...args: unknown[]) => void;
    /** Google Ad Manager */
    googletag?: {
      cmd?: Array<() => void>;
      apiReady?: boolean;
      pubads?: () => {
        enableSingleRequest: () => void;
        enableAsyncRendering: () => void;
        collapseEmptyDivs: () => void;
        enableLazyLoad: (config: any) => void;
        setPrivacySettings: (settings: any) => void;
        refresh: (slots?: any[]) => void;
        disableInitialLoad: () => void;
        getSlots: () => any[];
      };
      enableServices: () => void;
      defineSlot: (path: string, size: any, id: string) => any;
      display: (id: string) => void;
      destroySlots: (slots: any[]) => void;
    };
    /** Prebid.js */
    pbjs?: {
      que?: Array<() => void>;
      setConfig?: (config: any) => void;
      setBidderSettings?: (settings: any) => void;
      requestBids?: (config: any) => void;
      setTargetingForGPTAsync?: () => void;
    };
    /** Microsoft Clarity */
    clarity?: (action: string, ...args: any[]) => void;
  }
}
