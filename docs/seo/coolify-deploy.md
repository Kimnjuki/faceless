# Coolify deploy notes (SEO)

**Date:** 2026-11-23  

## What was wrong in the 18:28 deploy

1. Coolify built **`Kimnjuki/faceless:main`** at `44da266` — **not** the `seo/overhaul` branch.
2. That commit’s `Dockerfile` ran **`npm run build:quick` only** → SPA shell, no per-route HTML.
3. Coolify **skipped the Docker rebuild** (“image found with the same Git Commit SHA”) and rolled an old image.

## Required Coolify settings

| Setting | Value |
|---------|--------|
| Git branch | `main` (after merging `seo/overhaul`) |
| Dockerfile | repo root `Dockerfile` |
| Build command | *(none — Dockerfile `RUN` does it)* |
| Critical build ARG / env | **`VITE_CONVEX_URL`** must be set at **build** time so `prerender-routes.mjs` can fetch articles/guides |
| After merge | **Force rebuild** (do not rely on SHA cache if Dockerfile/scripts changed) |

## Correct build pipeline (current Dockerfile)

```
npm run build:seo
  → vite build
  → node scripts/prerender-routes.mjs   # Convex → dist/<route>/index.html
  → node scripts/verify-prerender.mjs
```

No Chromium / react-snap in the Coolify path (faster, more reliable).

## Post-deploy checks

```bash
curl -sA 'Googlebot' https://contentanonymity.com/blog/faceless-youtube-channel-guide-2026 | grep -i '<title>'
# expect article title, NOT homepage title

curl -o /dev/null -s -w '%{http_code}\n' https://contentanonymity.com/this-does-not-exist-xyz
# expect 404

curl -sIL -o /dev/null -w '%{num_redirects} %{url_effective}\n' http://www.contentanonymity.com/
# expect 1 hop → https://contentanonymity.com/
```

## TODO(HUMAN)

- [ ] Merge `seo/overhaul` → `main` and push.
- [ ] In Coolify: confirm `VITE_CONVEX_URL` is a **build-time** variable, then **Redeploy with rebuild** (clear image cache if needed).
- [ ] Fix Cloudflare www→apex to a **single** hop if still 2.
