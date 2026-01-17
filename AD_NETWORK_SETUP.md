# Ad Network Integration Setup

## Overview
ContentAnonymity is configured with multiple ad networks for programmatic advertising revenue optimization through header bidding and direct ad serving.

## Files Created

### 1. `public/ads.txt`
- **Purpose**: Authorized digital sellers file
- **Location**: Must be accessible at `https://yourdomain.com/ads.txt`
- **Content**: Lists all authorized ad network partners and their IDs
- **Importance**: Required by ad networks to verify authorized sellers and prevent ad fraud

### 2. `src/components/AdUnit.tsx`
- **Purpose**: React component for displaying Google Ad Manager ads
- **Features**:
  - Lazy loading support
  - Responsive ad sizes
  - Automatic ad refresh
  - Cleanup on unmount

### 3. `src/utils/adManager.ts`
- **Purpose**: Utilities for Google Ad Manager and Prebid.js integration
- **Functions**:
  - `initGoogleAdManager()` - Initialize GAM
  - `initPrebid()` - Configure Prebid.js
  - `requestBidsAndRefresh()` - Header bidding workflow
  - `trackAdImpression()` - Analytics tracking
  - `trackAdClick()` - Click tracking

## Ad Networks Integrated

### Primary Networks
1. **ForeMedia** - Multiple Google AdSense/AdX publishers
2. **RITRIBE** - AdSense, AdX, and programmatic partners
3. **Sovrn** - Direct and reseller relationships
4. **Revcontent** - Content recommendation ads
5. **33Across** - Programmatic display
6. **Outbrain** - Content discovery and video
7. **Teads** - Video advertising
8. **Minute Media** - Sports and entertainment content
9. **Smaato** - Mobile-first advertising
10. **Sonobi** - Programmatic advertising

### Additional Partners
- Index Exchange
- OpenX
- PubMatic
- Rubicon Project
- AppNexus/Xandr
- Media.net
- And 50+ additional ad networks

## Setup Instructions

### 1. Configure Google Ad Manager
1. Sign up for Google Ad Manager (formerly DFP)
2. Get your Publisher ID (format: `/123456789/your-site`)
3. Update `GAM_PUBLISHER_ID` in `src/utils/adManager.ts`
4. Create ad units in GAM dashboard
5. Get ad unit paths for each ad slot

### 2. Update Ad Unit Paths
In `src/components/AdUnit.tsx`, update the default `adUnitPath`:
```typescript
adUnitPath = '/YOUR_PUBLISHER_ID/contentanonymity'
```

### 3. Deploy ads.txt
Ensure `public/ads.txt` is accessible at:
```
https://yourdomain.com/ads.txt
```

### 4. Initialize Ad Manager
Add to your main app initialization:
```typescript
import { initGoogleAdManager, initPrebid } from '@/utils/adManager';

// Initialize on app load
initGoogleAdManager();
initPrebid();
```

## Usage Examples

### Basic Ad Unit
```tsx
import AdUnit from '@/components/AdUnit';

<AdUnit
  adSlot="div-gpt-ad-728x90-1"
  adSize={[728, 90]}
  adUnitPath="/123456789/contentanonymity/leaderboard"
/>
```

### Responsive Ad Unit
```tsx
<AdUnit
  adSlot="div-gpt-ad-300x250-1"
  adSize={[[300, 250], [320, 50], [728, 90]]}
  adUnitPath="/123456789/contentanonymity/responsive"
/>
```

### In Article Ad
```tsx
<AdUnit
  adSlot="div-gpt-ad-inarticle-1"
  adSize={[300, 250]}
  adUnitPath="/123456789/contentanonymity/inarticle"
  className="my-8"
/>
```

## Header Bidding Setup

### Prebid.js Configuration
Prebid.js is loaded from CDN and configured automatically. To add custom bidders:

1. Add bidder adapters in `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.js"></script>
```

2. Configure bidders in `src/utils/adManager.ts`:
```typescript
pbjs.que.push(() => {
  pbjs.addAdUnits([
    {
      code: 'div-gpt-ad-728x90-1',
      mediaTypes: {
        banner: {
          sizes: [[728, 90], [970, 250]]
        }
      },
      bids: [
        {
          bidder: 'appnexus',
          params: {
            placementId: 12345678
          }
        }
      ]
    }
  ]);
});
```

## Ad Placement Guidelines

### Recommended Positions
1. **Header** - 728x90 or 970x250 leaderboard
2. **Sidebar** - 300x250 medium rectangle
3. **In-Article** - 300x250 between paragraphs
4. **Footer** - 728x90 or responsive
5. **Mobile Sticky** - 320x50 at bottom

### Best Practices
- Maximum 3 ads per page
- Maintain content-to-ad ratio (70/30 minimum)
- Use lazy loading for below-fold ads
- Ensure ads don't block content
- Test on mobile devices
- Monitor Core Web Vitals impact

## Analytics Integration

Ad events are automatically tracked in Google Analytics:
- `ad_impression` - When an ad is displayed
- `ad_click` - When an ad is clicked

View in GA4: Events → ad_impression / ad_click

## Testing

### Verify ads.txt
```bash
curl https://yourdomain.com/ads.txt
```

### Test Ad Units
1. Open browser DevTools
2. Check Network tab for GAM requests
3. Verify Prebid.js is loading
4. Check console for errors
5. Verify ads are displaying

### Test Header Bidding
1. Open DevTools → Network
2. Filter by "prebid" or "bid"
3. Verify bid requests are sent
4. Check bid responses in console

## Troubleshooting

### Ads Not Showing
1. Check GAM Publisher ID is correct
2. Verify ad unit paths match GAM dashboard
3. Check browser console for errors
4. Verify ads.txt is accessible
5. Check ad blocker is disabled

### Header Bidding Not Working
1. Verify Prebid.js is loaded
2. Check bidder configurations
3. Verify network requests in DevTools
4. Check console for Prebid errors

### Performance Issues
1. Enable lazy loading
2. Reduce number of ad units
3. Use smaller ad sizes
4. Implement ad refresh limits
5. Monitor Core Web Vitals

## Revenue Optimization

### Tips
1. **A/B Test Ad Sizes** - Test different sizes to find optimal revenue
2. **Monitor Fill Rates** - Track which ad units perform best
3. **Optimize Placement** - Move high-performing ads to better positions
4. **Header Bidding** - Maximize revenue with simultaneous bidding
5. **Lazy Loading** - Improve UX while maintaining revenue

### Metrics to Track
- Fill Rate (% of ad requests filled)
- CPM (Cost Per Mille)
- CTR (Click-Through Rate)
- Revenue per page view
- Ad viewability

## Compliance

### GDPR/CCPA
- Ads respect user consent preferences
- No tracking without consent
- Privacy-compliant ad serving

### Ad Quality
- All networks are verified in ads.txt
- Ad content is monitored
- Malicious ads are blocked

## Support

For issues or questions:
- Google Ad Manager Help: https://support.google.com/admanager
- Prebid.js Documentation: https://docs.prebid.org/
- Ads.txt Specification: https://iabtechlab.com/ads-txt/

## Next Steps

1. ✅ ads.txt file created and deployed
2. ⏳ Set up Google Ad Manager account
3. ⏳ Configure ad units in GAM
4. ⏳ Update Publisher ID in code
5. ⏳ Test ad serving
6. ⏳ Monitor revenue and performance


