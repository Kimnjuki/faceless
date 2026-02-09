# AdSense ads.txt File Setup

## ✅ File Created

The `ads.txt` file has been created at `public/ads.txt` and will be automatically served at:
**https://contentanonymity.com/ads.txt**

## 📝 File Contents

```
google.com, ca-pub-9278124025449370, DIRECT, f08c47fec0942fa0
```

### Format Explanation

The ads.txt file format is:
```
<DOMAIN>, <PUBLISHER_ID>, <RELATIONSHIP>, <CERTIFICATION_AUTHORITY_ID>
```

- **google.com** - The ad network domain (Google AdSense)
- **ca-pub-9278124025449370** - Your AdSense publisher ID
- **DIRECT** - Indicates a direct relationship with the publisher
- **f08c47fec0942fa0** - Google's certification authority ID (standard for all AdSense accounts)

## 🔍 Verification

### How to Verify

1. **After Deployment:**
   - Visit: `https://contentanonymity.com/ads.txt`
   - You should see the file contents

2. **In AdSense Dashboard:**
   - Go to **Account** → **Account information**
   - Check the **ads.txt status** section
   - Status should change from "Not found" to "Authorized" within 24-48 hours

3. **Manual Check:**
   ```bash
   curl https://contentanonymity.com/ads.txt
   ```

## ⚠️ Important Notes

### File Location
- **Development:** `public/ads.txt`
- **Production:** `https://contentanonymity.com/ads.txt` (root domain)
- Vite automatically copies files from `public/` to the build root

### Requirements
- ✅ File must be at the root domain (not in a subdirectory)
- ✅ File must be accessible via HTTP/HTTPS
- ✅ File must be plain text (no HTML)
- ✅ File must use UTF-8 encoding
- ✅ File must be publicly accessible (no authentication required)

### Vercel / SPA deployment (critical for approval)

For single-page apps on Vercel, a catch-all rewrite `"source": "/(.*)"` sends **every** request (including `/ads.txt`) to `index.html`, so ad platforms never see the real file.

**Fix applied in this project:**
- `vercel.json` rewrites now **exclude** `/ads.txt`, `/robots.txt`, `/sitemap.xml`, and other root static files so they are served from `public/` instead of the app.
- `vercel.json` sets `Content-Type: text/plain; charset=utf-8` for `/ads.txt` (required by IAB).
- After deploy, confirm: `curl -I https://contentanonymity.com/ads.txt` returns `200` and `Content-Type: text/plain`.

### Common Issues

**Issue: File not found / Ad platform says ads.txt not found**
- **Vercel:** Ensure `vercel.json` rewrites do **not** match `/ads.txt` (see "Vercel / SPA deployment" above).
- Ensure the file is in the `public/` directory
- Rebuild and redeploy the application
- Check that the file is copied to the build output
- Verify: open `https://yourdomain.com/ads.txt` in a browser — you must see plain text, not your app’s HTML.

**Issue: Wrong format**
- Ensure no extra spaces or characters
- Ensure proper comma separation
- Ensure publisher ID matches exactly (ca-pub-9278124025449370)

**Issue: Not updating in AdSense**
- Google crawls ads.txt files periodically (24-48 hours)
- Wait for the next crawl cycle
- Manually request a crawl in Google Search Console (if available)

## 🚀 Next Steps

1. **Deploy the Application**
   - The ads.txt file will be automatically included in the build
   - It will be accessible at the root domain

2. **Wait for Google Crawl**
   - Google typically crawls ads.txt files within 24-48 hours
   - Check AdSense dashboard for status updates

3. **Verify Authorization**
   - Once crawled, status should show "Authorized"
   - Ads will then be able to serve properly

## 📚 Additional Resources

- [Google AdSense ads.txt Help](https://support.google.com/adsense/answer/7532444)
- [IAB ads.txt Specification](https://iabtechlab.com/ads-txt/)
- [AdSense Publisher ID](https://support.google.com/adsense/answer/160192)

---

**Last Updated:** January 2026  
**Status:** ✅ File Created - Awaiting Deployment and Google Crawl




