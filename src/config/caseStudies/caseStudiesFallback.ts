import {
  MD_YOUTUBE_FINANCE,
  MD_TIKTOK_PRODUCTIVITY,
  MD_INSTAGRAM_REELS,
  MD_PINTEREST_TRAFFIC,
  MD_LINKEDIN_B2B,
  MD_NEWSLETTER_CROSS,
  MD_FACEBOOK_REELS,
} from "./caseStudiesMarkdown";
import {
  EXPAND_YOUTUBE_FINANCE,
  EXPAND_TIKTOK_PRODUCTIVITY,
  EXPAND_INSTAGRAM_REELS,
  EXPAND_PINTEREST,
  EXPAND_LINKEDIN,
  EXPAND_NEWSLETTER,
  EXPAND_FACEBOOK,
} from "./caseStudiesMarkdownExpand";
import {
  EXPAND2_YOUTUBE,
  EXPAND2_TIKTOK,
  EXPAND2_INSTAGRAM,
  EXPAND2_PINTEREST,
  EXPAND2_LINKEDIN,
  EXPAND2_NEWSLETTER,
  EXPAND2_FACEBOOK,
} from "./caseStudiesMarkdownExpand2";
import {
  EXPAND3_YOUTUBE,
  EXPAND3_TIKTOK,
  EXPAND3_INSTAGRAM,
  EXPAND3_PINTEREST,
  EXPAND3_LINKEDIN,
  EXPAND3_NEWSLETTER,
  EXPAND3_FACEBOOK,
} from "./caseStudiesMarkdownExpand3";

function combine(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join("\n\n");
}

export interface CaseStudyItem {
  slug: string;
  id: string;
  title: string;
  creator: string;
  niche: string;
  platform: string;
  timeline: string;
  revenue: string;
  subscribers?: string;
  followers?: string;
  strategy: string;
  keyPoints: string[];
  content: string;
  excerpt: string;
}

export const CASE_STUDIES_FALLBACK: CaseStudyItem[] = [
  {
    slug: "youtube-faceless-finance-search-driven-growth",
    id: "youtube-faceless-finance-search-driven-growth",
    title: "Faceless YouTube Finance: Search-Led Growth to Sustainable Ad & Affiliate Income",
    creator: "Composite anonymous creator pattern",
    niche: "Finance education",
    platform: "YouTube",
    timeline: "7 months",
    revenue: "$8K–$12K",
    subscribers: "100K+",
    strategy: "Long-form SEO + Shorts repurposing + playlist retention engineering",
    keyPoints: [
      "Two long videos per week with search-intent titles",
      "Three Shorts weekly from a single insight per long video",
      "Affiliate and ads only after trust and watch-time baselines",
    ],
    excerpt:
      "How a faceless finance channel compounded watch time with playlists, intro rewrites, and ethical monetization—plus a 90-day roadmap beginners can copy.",
    content: combine(
      MD_YOUTUBE_FINANCE,
      EXPAND_YOUTUBE_FINANCE,
      EXPAND2_YOUTUBE,
      EXPAND3_YOUTUBE
    ),
  },
  {
    slug: "tiktok-productivity-digital-products",
    id: "tiktok-productivity-digital-products",
    title: "Faceless TikTok Productivity: High-Frequency Posting to Template & Course Revenue",
    creator: "Composite anonymous creator pattern",
    niche: "Productivity & focus",
    platform: "TikTok",
    timeline: "4–5 months",
    revenue: "$4K–$7K",
    followers: "400K+",
    strategy: "Three posts daily early, then stabilize; comment-to-content loop; digital templates first",
    keyPoints: [
      "Batched scripts weekly; voice in one session",
      "Reply window in first hour to fuel next videos",
      "Monetization: templates → lightweight course",
    ],
    excerpt:
      "Short-form productivity content that wins saves and profile visits—methods, stack, and how to sustain without burning out.",
    content: combine(
      MD_TIKTOK_PRODUCTIVITY,
      EXPAND_TIKTOK_PRODUCTIVITY,
      EXPAND2_TIKTOK,
      EXPAND3_TIKTOK
    ),
  },
  {
    slug: "instagram-reels-saves-brand-deals",
    id: "instagram-reels-saves-brand-deals",
    title: "Faceless Instagram Reels & Carousels: Saves, Shares, and Aligned Sponsorships",
    creator: "Composite anonymous creator pattern",
    niche: "Small business & design education",
    platform: "Instagram",
    timeline: "6 months",
    revenue: "$6K–$10K",
    followers: "180K+",
    strategy: "Reels + carousels + Stories polls; cohesive visual system; bio lead magnet",
    keyPoints: [
      "Text-first Reels for muted viewing",
      "Carousels as micro-lessons; Reels as demos",
      "Partnerships with tools that offer free tiers",
    ],
    excerpt:
      "How save-worthy tutorials and a strict visual style built a faceless IG brand that brands wanted to sponsor.",
    content: combine(
      MD_INSTAGRAM_REELS,
      EXPAND_INSTAGRAM_REELS,
      EXPAND2_INSTAGRAM,
      EXPAND3_INSTAGRAM
    ),
  },
  {
    slug: "pinterest-seo-affiliate-blog",
    id: "pinterest-seo-affiliate-blog",
    title: "Pinterest + Blog SEO: Evergreen Traffic for Faceless Affiliate Revenue",
    creator: "Composite anonymous creator pattern",
    niche: "DIY & budget lifestyle",
    platform: "Pinterest",
    timeline: "8–10 months",
    revenue: "$5K–$9K",
    subscribers: "Sessions-led",
    strategy: "Batch vertical pins, keyworded descriptions, long-form articles with FAQ schema",
    keyPoints: [
      "Ten pins per week from reusable Canva templates",
      "Internal linking and content updates on top posts",
      "Affiliate + ads after traffic compounding",
    ],
    excerpt:
      "Search-driven Pinterest workflows paired with a faceless blog—how traffic compounds and how beginners avoid thin content traps.",
    content: combine(
      MD_PINTEREST_TRAFFIC,
      EXPAND_PINTEREST,
      EXPAND2_PINTEREST,
      EXPAND3_PINTEREST
    ),
  },
  {
    slug: "linkedin-faceless-b2b-leads",
    id: "linkedin-faceless-b2b-leads",
    title: "Faceless LinkedIn Thought Leadership for B2B Leads (No Video Face)",
    creator: "Composite anonymous creator pattern",
    niche: "Operations & freelancing",
    platform: "LinkedIn",
    timeline: "5–7 months",
    revenue: "$7K–$12K",
    followers: "35K+",
    strategy: "Document posts + carousels; DM follow-up; newsletter lead magnet",
    keyPoints: [
      "Three posts weekly: framework, story, checklist",
      "Featured section + SOP lead magnet",
      "Depth over daily noise",
    ],
    excerpt:
      "Slower follower growth, higher conversion—how faceless B2B creators turn frameworks into booked calls.",
    content: combine(
      MD_LINKEDIN_B2B,
      EXPAND_LINKEDIN,
      EXPAND2_LINKEDIN,
      EXPAND3_LINKEDIN
    ),
  },
  {
    slug: "newsletter-cross-platform-flywheel",
    id: "newsletter-cross-platform-flywheel",
    title: "Cross-Platform Flywheel: YouTube, Shorts, TikTok → Owned Email Revenue",
    creator: "Composite anonymous creator pattern",
    niche: "Creator systems",
    platform: "Newsletter + multi-platform",
    timeline: "9 months",
    revenue: "$10K–$18K",
    subscribers: "Email-led",
    strategy: "One research block → long video, Shorts, social, weekly email; product ladder",
    keyPoints: [
      "Lead magnet matches video promise exactly",
      "One CTA per email; subject lines from best hooks",
      "Digital product after repeated demand signals",
    ],
    excerpt:
      "Why email reduced algorithm risk and how repurposing discipline replaced burnout with leverage.",
    content: combine(
      MD_NEWSLETTER_CROSS,
      EXPAND_NEWSLETTER,
      EXPAND2_NEWSLETTER,
      EXPAND3_NEWSLETTER
    ),
  },
  {
    slug: "facebook-reels-group-monetization",
    id: "facebook-reels-group-monetization",
    title: "Facebook Reels + Private Group: Community-Led Growth for Faceless Niches",
    creator: "Composite anonymous creator pattern",
    niche: "Family budgeting & DIY",
    platform: "Facebook",
    timeline: "6 months",
    revenue: "$3K–$6K",
    followers: "Group + Reels reach",
    strategy: "Reels for reach; group for depth; guides and pinned resources; ethical affiliate in guides",
    keyPoints: [
      "Two Reels weekly with comment-driving questions",
      "Moderation and clear rules reduce burnout",
      "Membership tier after trust matured",
    ],
    excerpt:
      "How Reels discovery and a well-run group create retention that single-feed posting cannot match.",
    content: combine(
      MD_FACEBOOK_REELS,
      EXPAND_FACEBOOK,
      EXPAND2_FACEBOOK,
      EXPAND3_FACEBOOK
    ),
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudyItem | undefined {
  return CASE_STUDIES_FALLBACK.find((c) => c.slug === slug);
}
