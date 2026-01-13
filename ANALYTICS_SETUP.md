# Google Analytics Setup & Implementation

## Overview
ContentAnonymity uses Google Analytics (GA4) with measurement ID `G-VGB9R02TVY` to track user behavior, conversions, and engagement metrics while maintaining user privacy and GDPR compliance.

## Features Implemented

### 1. **Privacy-Compliant Analytics**
- ✅ Cookie consent banner before tracking
- ✅ IP anonymization enabled
- ✅ Google Signals disabled
- ✅ Ad personalization disabled
- ✅ User can opt-out at any time

### 2. **Automatic Tracking**
- ✅ **Page Views**: Automatically tracked on route changes
- ✅ **User Signups**: Email and Google OAuth signups
- ✅ **Content Views**: Articles and products
- ✅ **Email Captures**: Newsletter subscriptions and lead generation
- ✅ **Form Submissions**: All form interactions

### 3. **Event Tracking**
- ✅ Button clicks (with location context)
- ✅ Form submissions
- ✅ Email captures (with source tracking)
- ✅ Content views (articles, products)
- ✅ Purchases (e-commerce transactions)
- ✅ Conversions (for ad platform tracking)

### 4. **User Experience**
- ✅ Non-intrusive consent banner
- ✅ Clear privacy messaging
- ✅ Easy opt-out option
- ✅ Settings persistence

## Implementation Details

### Files Created/Modified

1. **`src/utils/analytics.ts`**
   - Core analytics utility functions
   - Privacy-compliant initialization
   - Event tracking helpers
   - User consent management

2. **`src/components/AnalyticsConsent.tsx`**
   - GDPR-compliant consent banner
   - User-friendly privacy messaging
   - Accept/Decline options

3. **`index.html`**
   - Google Analytics script loaded
   - Initialization deferred until consent

4. **`src/App.tsx`**
   - Page view tracking on route changes
   - Consent banner integration

5. **Event Tracking Integration**
   - `src/pages/auth/Signup.tsx` - Signup tracking
   - `src/hooks/useLeads.ts` - Email capture tracking
   - `src/components/Header.tsx` - Button click tracking
   - `src/components/Hero.tsx` - CTA button tracking
   - `src/pages/ArticleDetail.tsx` - Content view tracking
   - `src/pages/ecommerce/ProductDetail.tsx` - Product view tracking
   - `src/pages/ecommerce/Checkout.tsx` - Purchase tracking

## Usage Examples

### Track Custom Events
```typescript
import { trackEvent } from '@/utils/analytics';

// Track a custom event
trackEvent('video_play', 'engagement', 'hero-video', 30);
```

### Track Conversions
```typescript
import { trackConversion } from '@/utils/analytics';

// Track a conversion for ad platforms
trackConversion('AW-CONVERSION_ID/CONVERSION_LABEL', 197, 'USD');
```

### Track Purchases
```typescript
import { trackPurchase } from '@/utils/analytics';

trackPurchase(
  'txn_12345',
  197,
  'USD',
  [
    {
      id: 'blueprint',
      name: 'Faceless Automation Blueprint',
      category: 'digital-product',
      price: 197,
      quantity: 1
    }
  ]
);
```

## Privacy & Compliance

### GDPR Compliance
- ✅ User consent required before tracking
- ✅ IP addresses anonymized
- ✅ No personal data collection
- ✅ User can opt-out anytime
- ✅ Clear privacy policy link

### Data Anonymization
- IP addresses are anonymized
- No personally identifiable information (PII) collected
- User IDs are anonymous/hashed
- Location data is generalized

### Cookie Policy
- Analytics cookies are only set after user consent
- Cookies are used for session tracking only
- No third-party advertising cookies
- Users can clear cookies to reset tracking

## Google Analytics Dashboard

### Key Metrics Tracked
1. **User Engagement**
   - Page views
   - Session duration
   - Bounce rate
   - Pages per session

2. **Conversions**
   - Signups (email & Google)
   - Email captures
   - Form submissions
   - Purchases

3. **Content Performance**
   - Article views
   - Product views
   - Most popular content
   - Content engagement time

4. **User Behavior**
   - Button clicks
   - Navigation patterns
   - Exit points
   - User flow

## Testing

### Verify Analytics is Working
1. Open browser DevTools → Network tab
2. Filter by "gtag" or "collect"
3. Navigate through the site
4. Check for requests to `google-analytics.com`

### Test Consent Flow
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Consent banner should appear
4. Accept/Decline and verify tracking behavior

### Test Event Tracking
1. Open browser console
2. Check `window.dataLayer` array
3. Perform actions (signup, click buttons, etc.)
4. Verify events are pushed to dataLayer

## Configuration

### Update Measurement ID
If you need to change the Google Analytics ID:
1. Update `GA_MEASUREMENT_ID` in `src/utils/analytics.ts`
2. Update script in `index.html`
3. Update consent banner if needed

### Custom Dimensions
To add custom dimensions:
```typescript
gtag('config', GA_MEASUREMENT_ID, {
  custom_map: {
    dimension1: 'user_type',
    dimension2: 'subscription_tier'
  }
});

gtag('event', 'page_view', {
  user_type: 'premium',
  subscription_tier: 'pro'
});
```

## Troubleshooting

### Analytics Not Tracking
1. Check if user has consented (localStorage: `analytics_consent`)
2. Verify Google Analytics script is loaded
3. Check browser console for errors
4. Verify measurement ID is correct

### Events Not Appearing
1. Check `window.dataLayer` in console
2. Verify `isAnalyticsEnabled()` returns true
3. Check network tab for GA requests
4. Wait 24-48 hours for data to appear in GA dashboard

### Consent Banner Not Showing
1. Clear localStorage
2. Check if banner component is in App.tsx
3. Verify no CSS is hiding the banner
4. Check browser console for errors

## Next Steps

### Recommended Enhancements
1. **Enhanced E-commerce Tracking**
   - Add to cart events
   - Remove from cart events
   - Checkout progress tracking

2. **User Segmentation**
   - Track user types (free, premium, etc.)
   - Track content preferences
   - Track engagement levels

3. **Conversion Funnels**
   - Signup funnel analysis
   - Purchase funnel analysis
   - Content engagement funnel

4. **A/B Testing Integration**
   - Google Optimize integration
   - Experiment tracking
   - Variant performance

## Support

For issues or questions:
- Check Google Analytics documentation: https://developers.google.com/analytics
- Review privacy compliance: https://support.google.com/analytics/answer/9019185
- Contact development team for custom tracking needs

