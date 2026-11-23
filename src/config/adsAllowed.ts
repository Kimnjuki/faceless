/**
 * AdSense placement allowlist (T6.1).
 * Script + units load only on these surfaces — not auth, dashboard, legal, or thin stubs.
 */
export const ADSENSE_CLIENT = 'ca-pub-9278124025449370';

const ADS_ALLOWED_EXACT = new Set(['/', '/blog']);

const ADS_ALLOWED_PREFIXES = ['/blog/', '/platform-guides'];

/** Paths where ads must never load (even if a component is mounted). */
const ADS_DENIED_PREFIXES = [
  '/auth',
  '/dashboard',
  '/creator-studio',
  '/checkout',
  '/privacy-policy',
  '/terms',
  '/affiliate-disclosure',
];

export function isAdsAllowed(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname || '/';

  for (const prefix of ADS_DENIED_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return false;
  }

  if (ADS_ALLOWED_EXACT.has(path)) return true;
  return ADS_ALLOWED_PREFIXES.some((p) => path.startsWith(p));
}
