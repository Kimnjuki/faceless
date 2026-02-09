/**
 * App-wide configuration and constants.
 * Single source of truth for site URL, feature flags, and limits.
 */

export const APP_CONFIG = {
  /** Canonical site URL (no trailing slash) */
  siteUrl: "https://contentanonymity.com",
  /** Site name for meta and UI */
  siteName: "ContentAnonymity",
  /** Default meta description length limit for SEO */
  metaDescriptionMaxLength: 160,
  /** Max items to fetch in list views (pagination limit) */
  defaultListLimit: 50,
  /** Enable Convex connection status in UI (dev only) */
  showConnectionStatus: import.meta.env.DEV,
} as const;

export const ROUTES = {
  home: "/",
  blog: "/blog",
  gettingStarted: "/getting-started",
  tools: "/tools/all",
  learningPaths: "/learning-paths",
  platformGuides: "/platform-guides",
  resources: "/resources/templates",
  community: "/community/members",
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    callback: "/auth/callback",
  },
  dashboard: "/dashboard",
  health: "/health",
} as const;
