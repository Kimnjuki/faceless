/**
 * Static templates for /resources/templates when Convex is empty or merged by slug.
 * Each entry includes long-form Markdown (900+ words combined from base + long additions).
 */
import type { Template } from "@/types";
import {
  BODY_TIKTOK_FACELESS_VIRAL_SCRIPT,
  BODY_YOUTUBE_LONG_FORM_FACELESS,
  BODY_INSTAGRAM_REELS_FACELESS,
  BODY_YOUTUBE_SHORTS_BATCH,
  BODY_INSTAGRAM_CAROUSEL,
  BODY_CONTENT_CALENDAR_30,
  BODY_TIKTOK_HOOK_BANK,
  BODY_BRAND_VOICE_FRAMEWORK,
} from "./templateBodies";
import {
  LONG_TIKTOK_FACELESS_VIRAL_SCRIPT,
  LONG_YOUTUBE_LONG_FORM_FACELESS,
  LONG_INSTAGRAM_REELS_FACELESS,
  LONG_YOUTUBE_SHORTS_BATCH,
  LONG_INSTAGRAM_CAROUSEL,
  LONG_CONTENT_CALENDAR_30,
  LONG_TIKTOK_HOOK_BANK,
  LONG_BRAND_VOICE_FRAMEWORK,
} from "./templateLongAdditions";
import {
  LONG_B_INSTAGRAM_REELS,
  LONG_B_YOUTUBE_SHORTS,
  LONG_B_INSTAGRAM_CAROUSEL,
  LONG_B_CONTENT_CALENDAR,
  LONG_B_TIKTOK_HOOK_BANK,
  LONG_B_BRAND_VOICE,
  LONG_B_YOUTUBE_LONG_FORM_TOPUP,
} from "./templateLongAdditionsB";
import {
  LONG_C_INSTAGRAM_REELS,
  LONG_C_YOUTUBE_SHORTS,
  LONG_C_INSTAGRAM_CAROUSEL,
  LONG_C_CONTENT_CALENDAR,
  LONG_C_TIKTOK_HOOK_BANK,
  LONG_C_BRAND_VOICE,
} from "./templateLongAdditionsC";
import {
  LONG_D_YOUTUBE_SHORTS,
  LONG_D_INSTAGRAM_CAROUSEL,
  LONG_D_CONTENT_CALENDAR,
  LONG_D_TIKTOK_HOOK_BANK,
  LONG_D_BRAND_VOICE,
  LONG_E_INSTAGRAM_CAROUSEL,
  LONG_E_CONTENT_CALENDAR,
  LONG_E_BRAND_VOICE,
  LONG_E_TIKTOK_HOOK_BANK,
} from "./templateLongAdditionsD";

function combine(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join("\n\n");
}

export interface TemplateFallback extends Template {
  slug: string;
  content: string;
}

export const TEMPLATES_LIBRARY_FALLBACK: TemplateFallback[] = [
  {
    slug: "tiktok-faceless-viral-script-2026",
    id: "fallback-tiktok-faceless-viral-script-2026",
    title: "TikTok Faceless Viral Script System (2026)",
    platform: "tiktok",
    type: "script",
    difficulty: "beginner",
    file_format: "google_docs",
    fileFormat: "google_docs",
    description:
      "A complete faceless TikTok script framework: hook, credibility, teaching beat, proof, and CTA—optimized for retention, saves, and in-app search.",
    tags: [
      "TikTok script",
      "faceless TikTok",
      "viral hook formula",
      "short-form script",
      "anonymous creator",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(BODY_TIKTOK_FACELESS_VIRAL_SCRIPT, LONG_TIKTOK_FACELESS_VIRAL_SCRIPT),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "youtube-long-form-faceless-script-2026",
    id: "fallback-youtube-long-form-faceless-script-2026",
    title: "YouTube Long-Form Faceless Script (8–15 Minutes)",
    platform: "youtube",
    type: "script",
    difficulty: "intermediate",
    file_format: "google_docs",
    fileFormat: "google_docs",
    description:
      "Retention-first long-form outline for faceless channels: intro architecture, framework teaching, mistakes chapter, B-roll discipline, and SEO description patterns.",
    tags: [
      "YouTube script template",
      "faceless YouTube",
      "YouTube SEO",
      "long-form outline",
      "anonymous YouTube channel",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_YOUTUBE_LONG_FORM_FACELESS,
      LONG_YOUTUBE_LONG_FORM_FACELESS,
      LONG_B_YOUTUBE_LONG_FORM_TOPUP
    ),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "instagram-reels-faceless-script-2026",
    id: "fallback-instagram-reels-faceless-script-2026",
    title: "Instagram Reels Faceless Script & Shot Plan",
    platform: "instagram",
    type: "script",
    difficulty: "beginner",
    file_format: "canva",
    fileFormat: "canva",
    description:
      "Hook-to-CTA Reels structure with shot notes, caption SEO, and muted-viewer accessibility—built for faceless educators and niche brands.",
    tags: [
      "Instagram Reels script",
      "faceless Instagram",
      "Reels SEO",
      "short video template",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_INSTAGRAM_REELS_FACELESS,
      LONG_INSTAGRAM_REELS_FACELESS,
      LONG_B_INSTAGRAM_REELS,
      LONG_C_INSTAGRAM_REELS
    ),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "youtube-shorts-batch-scripting-2026",
    id: "fallback-youtube-shorts-batch-scripting-2026",
    title: "YouTube Shorts Batch Scripting Matrix (10 Videos)",
    platform: "youtube",
    type: "hook",
    difficulty: "intermediate",
    file_format: "pdf",
    fileFormat: "pdf",
    description:
      "Batch-create Shorts from one research session: idea matrix, hook bank, skeleton timings, and title SEO—without repeating yourself into oblivion.",
    tags: [
      "YouTube Shorts",
      "batch scripting",
      "faceless Shorts",
      "content system",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_YOUTUBE_SHORTS_BATCH,
      LONG_YOUTUBE_SHORTS_BATCH,
      LONG_B_YOUTUBE_SHORTS,
      LONG_C_YOUTUBE_SHORTS,
      LONG_D_YOUTUBE_SHORTS
    ),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "instagram-carousel-faceless-education-2026",
    id: "fallback-instagram-carousel-faceless-education-2026",
    title: "Instagram Carousel: Faceless Educational Series",
    platform: "instagram",
    type: "carousel",
    difficulty: "beginner",
    file_format: "canva",
    fileFormat: "canva",
    description:
      "Slide-by-slide outline for save-worthy carousels: cover, mistake slides, recap, CTA, plus pinned-comment SEO and Reels repurposing.",
    tags: [
      "Instagram carousel template",
      "faceless Instagram",
      "carousel SEO",
      "educational carousel",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_INSTAGRAM_CAROUSEL,
      LONG_INSTAGRAM_CAROUSEL,
      LONG_B_INSTAGRAM_CAROUSEL,
      LONG_C_INSTAGRAM_CAROUSEL,
      LONG_D_INSTAGRAM_CAROUSEL,
      LONG_E_INSTAGRAM_CAROUSEL
    ),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "faceless-content-calendar-30-day",
    id: "fallback-faceless-content-calendar-30-day",
    title: "30-Day Faceless Content Calendar (Cross-Platform)",
    platform: "general",
    type: "outro",
    difficulty: "beginner",
    file_format: "notion",
    fileFormat: "notion",
    description:
      "Weekly rhythm, monthly SEO themes, repurposing chains, and sustainability guardrails—so posting stays strategic instead of chaotic.",
    tags: [
      "content calendar",
      "faceless creator workflow",
      "cross-platform strategy",
      "posting system",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_CONTENT_CALENDAR_30,
      LONG_CONTENT_CALENDAR_30,
      LONG_B_CONTENT_CALENDAR,
      LONG_C_CONTENT_CALENDAR,
      LONG_D_CONTENT_CALENDAR,
      LONG_E_CONTENT_CALENDAR
    ),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "tiktok-hook-bank-25-variants-2026",
    id: "fallback-tiktok-hook-bank-25-variants-2026",
    title: "TikTok Hook Bank + Stress-Test Guide (25+ Variants)",
    platform: "tiktok",
    type: "hook",
    difficulty: "beginner",
    file_format: "pdf",
    fileFormat: "pdf",
    description:
      "Fill-in-the-blank hooks plus ethical stress-testing, A/B habits, and audience language mining—so you never run out of strong opens.",
    tags: [
      "TikTok hooks",
      "viral hook examples",
      "faceless TikTok",
      "short-form hooks",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_TIKTOK_HOOK_BANK,
      LONG_TIKTOK_HOOK_BANK,
      LONG_B_TIKTOK_HOOK_BANK,
      LONG_C_TIKTOK_HOOK_BANK,
      LONG_D_TIKTOK_HOOK_BANK,
      LONG_E_TIKTOK_HOOK_BANK
    ),
    download_count: 0,
    rating: 5,
  },
  {
    slug: "brand-voice-framework-faceless-2026",
    id: "fallback-brand-voice-framework-faceless-2026",
    title: "Brand Voice Framework for Faceless Creators",
    platform: "general",
    type: "script",
    difficulty: "intermediate",
    file_format: "google_docs",
    fileFormat: "google_docs",
    description:
      "Traits, rules, vocabulary lists, editing passes, and sensitive-niche tone guidance—so your anonymous brand still feels unmistakably human.",
    tags: [
      "brand voice",
      "faceless branding",
      "creator positioning",
      "script tone",
    ],
    downloadUrl: "",
    download_url: "",
    content: combine(
      BODY_BRAND_VOICE_FRAMEWORK,
      LONG_BRAND_VOICE_FRAMEWORK,
      LONG_B_BRAND_VOICE,
      LONG_C_BRAND_VOICE,
      LONG_D_BRAND_VOICE,
      LONG_E_BRAND_VOICE
    ),
    download_count: 0,
    rating: 5,
  },
];

export function getFallbackTemplateBySlug(slug: string): TemplateFallback | undefined {
  return TEMPLATES_LIBRARY_FALLBACK.find((t) => t.slug === slug);
}
