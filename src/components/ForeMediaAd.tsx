import { useEffect, useRef } from "react";

const FOREMEDIA_SITE_ID = "60934";

export type ForeMediaSlot =
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "e1"
  | "footer"
  | "footer_float"
  | "pop_ads"
  | "custom32177"
  | "custom32178";

/** Custom slots are script-only (no container div) */
const CUSTOM_SLOTS: ForeMediaSlot[] = ["custom32177", "custom32178"];

const loadedSlots = new Set<string>();

interface ForeMediaAdProps {
  slot: ForeMediaSlot;
  className?: string;
  /** Optional: render a wrapper for layout (e.g. min-height for sticky) */
  wrapperClassName?: string;
}

/**
 * ForeMedia ad unit. Renders the placeholder div and loads the ForeMedia script for the given slot.
 * Standard slots: div + async script. Custom slots: script only.
 */
export default function ForeMediaAd({
  slot,
  className = "",
  wrapperClassName = "",
}: ForeMediaAdProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const isCustom = CUSTOM_SLOTS.includes(slot);
    const scriptId = `foremedia-${slot}`;

    if (loadedSlots.has(scriptId)) {
      return;
    }

    const src = `https://platform.foremedia.net/code/${FOREMEDIA_SITE_ID}/${slot}`;
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "text/javascript";
    script.async = !isCustom;
    script.src = src;
    
    // Suppress errors from ForeMedia redirect/tracking endpoints
    script.onerror = () => {
      // Silently handle script load errors (ForeMedia may return 400/404 for tracking)
      console.debug(`ForeMedia script failed to load for slot: ${slot}`);
    };
    
    // Suppress network errors from ForeMedia redirect endpoints
    const originalFetch = window.fetch;
    const errorHandler = (event: ErrorEvent) => {
      if (event.message?.includes('foremedia') || 
          event.filename?.includes('foremedia') ||
          event.target instanceof HTMLScriptElement && event.target.src?.includes('foremedia')) {
        event.preventDefault();
        return true;
      }
      return false;
    };
    
    // Add global error handler for ForeMedia redirect errors
    const handleError = (event: ErrorEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (
        (target instanceof HTMLScriptElement && target.src?.includes('foremedia')) ||
        (target instanceof HTMLImageElement && target.src?.includes('foremedia'))
      )) {
        // Suppress ForeMedia-related errors
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
      return false;
    };
    
    window.addEventListener('error', handleError, true);
    
    scriptRef.current = script;
    document.body.appendChild(script);
    loadedSlots.add(scriptId);

    return () => {
      window.removeEventListener('error', handleError, true);
      script.remove();
      scriptRef.current = null;
      loadedSlots.delete(scriptId);
    };
  }, [slot]);

  if (CUSTOM_SLOTS.includes(slot)) {
    return null;
  }

  const divId = `foremediaads-${slot}`;
  const isPopAds = slot === "pop_ads";
  return (
    <div
      className={wrapperClassName || (isPopAds ? "hidden" : undefined)}
      aria-label={isPopAds ? undefined : "Advertisement"}
      role={isPopAds ? undefined : "complementary"}
    >
      <div
        id={divId}
        className={isPopAds ? "hidden" : className}
        data-foremedia-slot={slot}
      />
    </div>
  );
}
