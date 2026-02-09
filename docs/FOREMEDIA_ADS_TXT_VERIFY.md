# ForeMedia ads.txt Verification

This doc ensures **ForeMedia can confirm your ads.txt** when you click "Check" in their dashboard.

## 1. Exact URL ForeMedia will request

Your ads.txt **must** be reachable at this exact URL (no trailing slash, no www):

```
https://contentanonymity.com/ads.txt
```

- Use **https**
- Use **contentanonymity.com** (same domain as in your ForeMedia site settings)
- Do **not** use `www.contentanonymity.com` unless that is the domain you added in ForeMedia

## 2. What must be true for confirmation

| Check | How we satisfy it |
|-------|-------------------|
| URL returns **200** | `vercel.json` rewrites **exclude** `ads.txt` so the static file is served, not the SPA. |
| **Content-Type: text/plain** | `vercel.json` sets this header for `/ads.txt`. |
| File is **plain text** | No HTML; only comments and data lines. |
| ForeMedia demand entries present | The ForeMedia block at the top of `public/ads.txt` contains the lines they provided (google.com, appnexus, openx, rubicon, etc.). |

## 3. Verify locally after deploy

Run (replace with your real domain if different):

```bash
curl -I https://contentanonymity.com/ads.txt
```

You should see:

- `HTTP/2 200` (or `HTTP/1.1 200`)
- `content-type: text/plain; charset=utf-8`

Then fetch content:

```bash
curl -s https://contentanonymity.com/ads.txt | head -50
```

You should see plain text starting with `# ads.txt for contentanonymity.com` and data lines like `google.com, ca-pub-...`, **not** HTML.

## 4. In ForeMedia dashboard

1. Log in to **platform.foremedia.net**.
2. Open the site that uses **contentanonymity.com** (e.g. site ID 60934).
3. Go to the **ads.txt** or **domain/settings** section where you can "Check" or "Verify" ads.txt.
4. Ensure the domain saved there is exactly **contentanonymity.com** (no `www`, no path, no typo).
5. Click **Check** / **Verify**.  
   - If it still fails, wait **24–48 hours** after the last deploy and try again (crawler cache).  
   - If it passes, you should get a clear confirmation.

## 5. Code changes that make confirmation work

- **`public/ads.txt`**  
  - IAB-style header and **ForeMedia block at the top** (no inline comments on data lines).  
  - Single `contact=...` variable.  
  - Rest of your partners (RITRIBE, etc.) follow.

- **`vercel.json`**  
  - Rewrite pattern **excludes** `ads.txt` (and `robots.txt`, `sitemap.xml`, etc.) so they are served as static files.  
  - **Headers** for `/ads.txt`: `Content-Type: text/plain; charset=utf-8` and `Cache-Control: public, max-age=3600`.

- **Deploy**  
  - Redeploy so production serves the updated `ads.txt` and headers.

## 6. If ForeMedia still does not confirm

- Confirm in ForeMedia that the **domain** is **contentanonymity.com** (not www).
- Try their check again after **24–48 hours**.
- Open `https://contentanonymity.com/ads.txt` in a **private/incognito** window and confirm you see **only text**, no HTML.
- If you use another host (e.g. Netlify), ensure that host serves `public/ads.txt` at the root and does not rewrite `/ads.txt` to the SPA.
