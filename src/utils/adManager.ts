/**
 * Google Ad Manager Integration
 * Handles ad initialization and Prebid.js header bidding
 */

// Google Ad Manager Publisher ID
// Replace with your actual GAM Publisher ID
const GAM_PUBLISHER_ID = '123456789'; // TODO: Replace with actual publisher ID

/**
 * Initialize Google Ad Manager
 */
export function initGoogleAdManager() {
  if (typeof window === 'undefined') return;

  // Check if already initialized
  if (window.googletag && window.googletag.apiReady) {
    return;
  }

  // Initialize googletag
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  const googletag = window.googletag;

  googletag.cmd.push(() => {
    // Enable services
    googletag.pubads().enableSingleRequest();
    googletag.pubads().enableAsyncRendering();
    googletag.pubads().collapseEmptyDivs();
    
    // Enable lazy loading
    googletag.pubads().enableLazyLoad({
      fetchMarginPercent: 100,
      renderMarginPercent: 50,
      mobileScaling: 2.0
    });

    // Set privacy settings
    googletag.pubads().setPrivacySettings({
      restrictDataProcessing: false,
      childDirectedTreatment: false
    });

    // Enable SRA (Single Request Architecture)
    googletag.pubads().enableSingleRequest();
    
    // Mark as ready
    googletag.enableServices();
  });
}

/**
 * Initialize Prebid.js for header bidding
 */
export function initPrebid() {
  if (typeof window === 'undefined') return;

  // Check if Prebid.js is loaded
  if (!window.pbjs) {
    console.warn('Prebid.js not loaded. Header bidding will not work.');
    return;
  }

  const pbjs = window.pbjs;

  // Configure Prebid
  pbjs.que.push(() => {
    pbjs.setConfig({
      bidderTimeout: 3000,
      enableSendAllBids: true,
      priceGranularity: {
        "buckets": [
          {
            "min": 0,
            "max": 5,
            "increment": 0.50
          },
          {
            "min": 5,
            "max": 10,
            "increment": 1
          },
          {
            "min": 10,
            "max": 20,
            "increment": 2
          }
        ]
      }
    });

    // Set bidder settings
    pbjs.setBidderSettings({
      standard: {
        adserverTargeting: [
          {
            key: "hb_bidder",
            val: function(bidResponse: any) {
              return bidResponse.bidder;
            }
          },
          {
            key: "hb_adid",
            val: function(bidResponse: any) {
              return bidResponse.adId;
            }
          },
          {
            key: "hb_pb",
            val: function(bidResponse: any) {
              return bidResponse.pbMg;
            }
          },
          {
            key: "hb_size",
            val: function(bidResponse: any) {
              return bidResponse.size;
            }
          }
        ]
      }
    });
  });
}

/**
 * Request bids from Prebid and refresh GAM
 */
export function requestBidsAndRefresh(adUnits: any[]) {
  if (typeof window === 'undefined' || !window.pbjs) return;

  const pbjs = window.pbjs;

  pbjs.que.push(() => {
    pbjs.requestBids({
      timeout: 3000,
      adUnits: adUnits,
      bidsBackHandler: function() {
        // Set targeting for GAM
        if (window.googletag && window.googletag.apiReady) {
          pbjs.setTargetingForGPTAsync();
          window.googletag.cmd.push(() => {
            window.googletag.pubads().refresh();
          });
        }
      }
    });
  });
}

/**
 * Track ad impressions
 */
export function trackAdImpression(adSlot: string, adSize: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const gtag = window.gtag;
  gtag('event', 'ad_impression', {
    ad_slot: adSlot,
    ad_size: adSize,
    event_category: 'advertising'
  });
}

/**
 * Track ad clicks
 */
export function trackAdClick(adSlot: string, adSize: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const gtag = window.gtag;
  gtag('event', 'ad_click', {
    ad_slot: adSlot,
    ad_size: adSize,
    event_category: 'advertising'
  });
}








