/**
 * Shared niche URL slug helpers for prerender + link-audit.
 * Public niche URLs must be /niches/{slug}, never Convex _id or UUID.
 */

export const VALID_NICHE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Convex document ids often look like this in the wild */
export const OPAQUE_CONVEX_ID_RE = /^[a-z0-9]{20,}$/i;

export function slugifyNicheName(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

export function isOpaqueNicheParam(param) {
  const p = String(param || '').trim();
  if (!p) return true;
  if (UUID_RE.test(p)) return true;
  if (p.startsWith('m') && OPAQUE_CONVEX_ID_RE.test(p) && !p.includes('-')) return true;
  // Convex ids are typically 32 chars alphanumeric without hyphens
  if (!p.includes('-') && p.length >= 20 && /^[a-z0-9]+$/i.test(p)) return true;
  return false;
}

export function nichePublicSlug(n) {
  if (n?.slug && VALID_NICHE_SLUG_RE.test(n.slug) && !isOpaqueNicheParam(n.slug)) {
    return n.slug;
  }
  const fromName = slugifyNicheName(n?.nicheName || n?.niche_name || n?.name);
  if (fromName && VALID_NICHE_SLUG_RE.test(fromName)) return fromName;
  return null;
}

export function isOpaqueNichePath(pathname) {
  const m = String(pathname || '').match(/^\/niches\/([^/]+)\/?$/);
  if (!m) return false;
  return isOpaqueNicheParam(m[1]);
}
