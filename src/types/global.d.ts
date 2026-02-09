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
  }
}
