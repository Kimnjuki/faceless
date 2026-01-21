# Google Analytics 4 Setup Guide

## Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Enter property name: "ContentAnonymity"
5. Select time zone and currency
6. Click "Next" and complete setup

## Step 2: Get Measurement ID

1. Go to "Admin" → "Data Streams"
2. Click "Add stream" → "Web"
3. Enter website URL: `https://contentanonymity.com`
4. Stream name: "ContentAnonymity Website"
5. Copy the Measurement ID (format: G-XXXXXXXXXX)

## Step 3: Install Tracking Code

### Option 1: Add to index.html (Recommended)

1. Open `index.html`
2. Add the Google Analytics script in the `<head>` section:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Option 2: Use React Component

Create a component to load GA4:

```typescript
// src/components/GoogleAnalytics.tsx
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your ID

export default function GoogleAnalytics() {
  useEffect(() => {
    // Load gtag.js
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}
```

Then add to `App.tsx`:

```typescript
import GoogleAnalytics from '@/components/GoogleAnalytics';

function App() {
  return (
    <>
      <GoogleAnalytics />
      {/* rest of your app */}
    </>
  );
}
```

## Step 4: Set Up Conversion Goals

### Track Signups:

1. Go to "Admin" → "Events"
2. Click "Create event"
3. Event name: `signup`
4. Conditions: When `event_name` equals `signup`
5. Mark as conversion: Yes

### Track Tool Usage:

1. Create event: `tool_calculator_used`
2. Create event: `tool_quiz_completed`
3. Mark important events as conversions

## Step 5: Configure Enhanced Measurement

1. Go to "Admin" → "Data Streams"
2. Click on your web stream
3. Enable "Enhanced measurement"
4. Toggle on:
   - Page views
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads

## Step 6: Set Up Custom Events

Track important user actions:

```typescript
// Track article view
gtag('event', 'article_view', {
  article_title: 'How to Start Faceless YouTube',
  article_category: 'Content Strategies'
});

// Track tool usage
gtag('event', 'tool_used', {
  tool_name: 'Profitability Calculator',
  tool_category: 'Tools'
});

// Track signup
gtag('event', 'signup', {
  method: 'email'
});
```

## Step 7: Link to Google Search Console

1. Go to "Admin" → "Search Console Links"
2. Click "Link"
3. Select your Search Console property
4. Click "Confirm"

This allows you to see search query data in Analytics.

## Step 8: Set Up Reports

### Key Reports to Monitor:

1. **Acquisition Report**: Where traffic comes from
2. **Engagement Report**: User behavior and engagement
3. **Monetization Report**: Conversions and revenue
4. **Retention Report**: User retention over time

### Custom Reports:

Create custom reports for:
- Blog post performance
- Tool usage statistics
- Conversion funnel
- User journey

## Step 9: Privacy & Compliance

### GDPR Compliance:

1. Add cookie consent banner (already implemented)
2. Only track after user consent
3. Provide opt-out option
4. Update privacy policy

### Update Analytics Component:

```typescript
// Only load GA4 after consent
if (hasConsented) {
  // Load GA4
}
```

## Step 10: Test Installation

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) Chrome extension
2. Visit your website
3. Check that events are firing
4. Verify in GA4 Real-Time reports

## Monthly Review Checklist

- [ ] Review traffic sources
- [ ] Analyze top pages
- [ ] Check conversion rates
- [ ] Review user behavior flow
- [ ] Identify drop-off points
- [ ] Track goal completions
- [ ] Monitor bounce rates
- [ ] Review device breakdown

## Next Steps

After setting up Google Analytics:

1. Set up Google Search Console (see `GOOGLE_SEARCH_CONSOLE_SETUP.md`)
2. Link Search Console to Analytics
3. Set up custom dashboards
4. Create automated reports
5. Set up alerts for significant changes

