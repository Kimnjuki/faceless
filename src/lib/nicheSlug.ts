/**
 * Public niche URLs must be /niches/{slug}, never Convex _id or UUID.
 */
export const VALID_NICHE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function slugifyNicheName(name: string): string {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

export function isOpaqueNicheParam(param: string): boolean {
  const p = String(param || '').trim();
  if (!p) return true;
  if (UUID_RE.test(p)) return true;
  if (!p.includes('-') && p.length >= 20 && /^[a-z0-9]+$/i.test(p)) return true;
  return false;
}

export function nichePublicPath(niche: {
  slug?: string;
  id?: string;
  niche_name?: string;
  nicheName?: string;
}): string {
  if (niche.slug && VALID_NICHE_SLUG_RE.test(niche.slug) && !isOpaqueNicheParam(niche.slug)) {
    return `/niches/${niche.slug}`;
  }
  if (niche.id && VALID_NICHE_SLUG_RE.test(niche.id) && !isOpaqueNicheParam(niche.id)) {
    return `/niches/${niche.id}`;
  }
  const fromName = slugifyNicheName(niche.niche_name || niche.nicheName || '');
  if (fromName) return `/niches/${fromName}`;
  return '/resources/niches';
}
