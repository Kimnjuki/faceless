/**
 * Prebid.js Configuration
 * Header Bidding Setup for ContentAnonymity
 * 
 * This configuration includes all approved ad network partners
 * for programmatic advertising revenue optimization.
 */

// Prebid.js adapter configuration
const pbjs = window.pbjs || {};
pbjs.que = pbjs.que || [];

// Bidder settings
const bidderSettings = {
  standard: {
    adserverTargeting: [
      {
        key: "hb_bidder",
        val: function(bidResponse) {
          return bidResponse.bidder;
        }
      },
      {
        key: "hb_adid",
        val: function(bidResponse) {
          return bidResponse.adId;
        }
      },
      {
        key: "hb_pb",
        val: function(bidResponse) {
          return bidResponse.pbMg;
        }
      },
      {
        key: "hb_size",
        val: function(bidResponse) {
          return bidResponse.size;
        }
      }
    ]
  }
};

// Ad units configuration
const adUnits = [
  {
    code: 'div-gpt-ad-728x90-1',
    mediaTypes: {
      banner: {
        sizes: [[728, 90], [970, 250], [300, 250], [320, 50]]
      }
    },
    bids: []
  },
  {
    code: 'div-gpt-ad-300x250-1',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [320, 50], [728, 90]]
      }
    },
    bids: []
  },
  {
    code: 'div-gpt-ad-320x50-1',
    mediaTypes: {
      banner: {
        sizes: [[320, 50], [300, 250]]
      }
    },
    bids: []
  }
];

// Initialize Prebid.js
pbjs.que.push(function() {
  // Set bidder timeout (in milliseconds)
  pbjs.setBidderSettings(bidderSettings);
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

  // Add ad units
  pbjs.addAdUnits(adUnits);

  // Request bids
  pbjs.requestBids({
    timeout: 3000,
    adUnits: adUnits,
    bidsBackHandler: function(bids) {
      // Bids received, now call DFP/GAM
      if (window.googletag && window.googletag.apiReady) {
        pbjs.setTargetingForGPTAsync();
        window.googletag.cmd.push(function() {
          window.googletag.pubads().refresh();
        });
      }
    }
  });
});

// Export for use
window.pbjs = pbjs;
window.pbjsConfig = {
  bidderSettings: bidderSettings,
  adUnits: adUnits
};





