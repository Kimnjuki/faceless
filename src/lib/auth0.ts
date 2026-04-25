/**
 * Auth0 React SDK expects `domain` as the tenant hostname only, e.g. `dev-abc.us.auth0.com`.
 * Common misconfiguration: full URL with `https://` or Management API path `/api/v2/`.
 */
export function normalizeAuth0Domain(raw: string | undefined): string {
  if (!raw) return "";
  let d = raw.trim();
  d = d.replace(/^https?:\/\//i, "");
  const slash = d.indexOf("/");
  if (slash !== -1) d = d.slice(0, slash);
  return d.trim();
}

export function isAuth0Configured(): boolean {
  const domain = normalizeAuth0Domain(import.meta.env.VITE_AUTH0_DOMAIN);
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim() ?? "";
  return Boolean(domain && clientId);
}
