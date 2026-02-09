# Fix: Coolify Deployment Failed (exit code 127)

## What went wrong

Error from logs:

```text
/artifacts/build-time.env: line 5: prod:fabulous-roadrunner-783: command not found=eyJ2MiI6...: command not found
```

**Cause:** A Convex **deploy key** was added as an environment variable in Coolify.  
The value contains a **pipe** (`|`). When Coolify writes env vars into `build-time.env` and the build script sources that file, the shell treats `|` as a pipe, so it tries to run `prod:fabulous-roadrunner-783` and the rest as separate commands → **command not found** and failed build.

The **deploy key is for CLI only** (e.g. `npx convex deploy`). The **frontend build does not need it** and must not be set in Coolify.

---

## Fix (do this in Coolify)

### 1. Remove the deploy key from Coolify

1. Open **Coolify** → your application → **Environment Variables**.
2. Find any variable whose **value** is the Convex deploy key, e.g.:
   - `prod:fabulous-roadrunner-783|eyJ2MiI6ImQyOGYyYTFmNTUxZDQzODhhMWExM2IwNzNmNDJhNzI5In0=`
3. **Delete** that variable (or clear its value and save).
4. Do **not** add the deploy key again as a build-time env var.

### 2. Use only the Convex URL

Add **only** this variable (no deploy key):

- **Name:** `VITE_CONVEX_URL`
- **Value:** `https://fabulous-roadrunner-783.convex.cloud`

No spaces, no trailing slash, no quotes in the Coolify UI unless it explicitly requires them.

### 3. Rebuild

Save the env vars and **rebuild** the application in Coolify.

---

## Summary

| In Coolify | Use it? | Notes |
|------------|--------|--------|
| `VITE_CONVEX_URL=https://fabulous-roadrunner-783.convex.cloud` | Yes | Required for frontend. Safe (no `\|`) |
| Deploy key `prod:fabulous-roadrunner-783\|eyJ...` | No | Contains `\|` → breaks build. CLI only, not for Coolify env |

After removing the deploy key and setting only `VITE_CONVEX_URL`, the deployment should succeed.
