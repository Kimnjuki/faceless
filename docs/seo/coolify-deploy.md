# Coolify deploy notes (SEO)

**Date:** 2026-11-23  
**Latest SEO push:** `a3d6b2e` on `main` (T5.1/T6.1) — force rebuild after pull.

## What was wrong in the 18:28 deploy

1. Coolify built **`Kimnjuki/faceless:main`** at `44da266` — **not** the `seo/overhaul` branch.
2. That commit’s `Dockerfile` ran **`npm run build:quick` only** → SPA shell, no per-route HTML.
3. Coolify **skipped the Docker rebuild** (“image found with the same Git Commit SHA”) and rolled an old image.

## Required Coolify settings

| Setting | Value |
|---------|--------|
| Git branch | `main` |
| Dockerfile | repo root `Dockerfile` |
| Build command | *(none — Dockerfile `RUN` does it)* |
| Critical build ARG / env | **`VITE_CONVEX_URL`** must be set at **build** time so `prerender-routes.mjs` can fetch articles/guides |
| After push | **Force rebuild** (do not rely on SHA cache if Dockerfile/scripts changed) |

## Correct build pipeline (current Dockerfile)

```
npm run build:seo
  → vite build
  → node scripts/prerender-routes.mjs   # Convex → dist/<route>/index.html
  → node scripts/seo-check.mjs
```

No Chromium / react-snap in the Coolify path (faster, more reliable).

## Post-deploy checks (Windows: use `curl.exe`)

```bash
curl.exe -sA "Googlebot" https://contentanonymity.com/blog/faceless-youtube-channel-guide-2026 | findstr /i "<title>"
# expect article title, NOT homepage title

curl.exe -sA "Googlebot" https://contentanonymity.com/blog/faceless-youtube-channel-guide-2026 | findstr /i "BlogPosting"
# expect BlogPosting JSON-LD

curl.exe -o NUL -s -w "%{http_code}" https://contentanonymity.com/this-does-not-exist-xyz
# expect 404

curl.exe -sIL -o NUL -w "%{num_redirects} %{url_effective}" http://www.contentanonymity.com/
# expect 1 hop → https://contentanonymity.com/
```

## TODO(HUMAN)

- [ ] In Coolify: confirm `VITE_CONVEX_URL` is a **build-time** variable, then **Redeploy with rebuild**.
- [ ] Fix Cloudflare www→apex to a **single** hop if still 2.
- [ ] Approve cluster redirects in `docs/seo/cluster-decisions.md` before applying merges.
