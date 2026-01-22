# Google Search Console Setup Guide

## Step 1: Verify Ownership

### Option 1: HTML Tag (Recommended)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Select "URL prefix" and enter: `https://contentanonymity.com`
4. Choose "HTML tag" verification method
5. Copy the meta tag provided (looks like: `<meta name="google-site-verification" content="..."/>`)
6. Add this tag to your `index.html` file in the `<head>` section

### Option 2: DNS Verification

1. Choose "DNS record" verification method
2. Add the TXT record to your domain's DNS settings
3. Wait for DNS propagation (can take up to 48 hours)

## Step 2: Submit Sitemap

1. After verification, go to "Sitemaps" in the left sidebar
2. Enter: `https://contentanonymity.com/sitemap.xml`
3. Click "Submit"
4. Wait for Google to process (usually within a few hours)

## Step 3: Request Indexing for Key Pages

1. Go to "URL Inspection" tool
2. Enter your homepage URL: `https://contentanonymity.com`
3. Click "Request Indexing"
4. Repeat for other important pages:
   - `/getting-started`
   - `/blog`
   - `/tools/calculator`
   - `/tools/niche-quiz`

## Step 4: Monitor Performance

### Weekly Checks:

- **Performance Tab**: Monitor impressions, clicks, CTR, average position
- **Coverage Tab**: Check for indexing errors
- **Mobile Usability**: Ensure no mobile issues
- **Core Web Vitals**: Monitor LCP, FID, CLS scores

### Key Metrics to Track:

- **Impressions**: Should increase over time
- **Clicks**: Should increase as rankings improve
- **CTR**: Target >3% for top 10 rankings
- **Average Position**: Target <20 in 3 months
- **Coverage Issues**: Fix any errors immediately

## Step 5: Fix Issues

### Common Issues to Fix:

1. **404 Errors**: Update or remove broken links
2. **Mobile Usability**: Fix mobile rendering issues
3. **Core Web Vitals**: Optimize slow pages
4. **Coverage Issues**: Fix pages with errors

## Step 6: Submit Updated Content

Whenever you publish new content:

1. Use "URL Inspection" to submit new pages
2. Update sitemap.xml if needed
3. Resubmit sitemap if you've added many new pages

## Troubleshooting

### Sitemap Not Found:
- Verify sitemap.xml is accessible at `/sitemap.xml`
- Check robots.txt allows crawling
- Ensure sitemap is valid XML

### Pages Not Indexing:
- Check for noindex tags
- Verify pages are accessible
- Check robots.txt doesn't block pages
- Request indexing manually

### Low Impressions:
- This is normal for new sites
- Focus on creating quality content
- Build backlinks
- Be patient (takes 3-6 months)

## Next Steps

After setting up Google Search Console:

1. Set up Google Analytics 4 (see `GOOGLE_ANALYTICS_SETUP.md`)
2. Monitor performance weekly
3. Fix any issues immediately
4. Submit new content regularly
5. Track keyword rankings



