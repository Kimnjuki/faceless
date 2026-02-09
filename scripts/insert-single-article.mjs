/**
 * Insert a single article into Convex.
 *
 * Usage:
 *   node scripts/insert-single-article.mjs
 *
 * Requires CONVEX_URL or VITE_CONVEX_URL in .env.local
 */
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: join(root, ".env") });
  dotenv.config({ path: join(root, ".env.local") });
} catch (_) {}

const CONVEX_URL = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Set CONVEX_URL or VITE_CONVEX_URL in .env.local");
  process.exit(1);
}

// Convex uses milliseconds; input 1738786430 is Unix seconds
const ts = 1738786430 * 1000;

const article = {
  title: "The Complete Guide to Building a Profitable Faceless YouTube Channel in 2026",
  slug: "complete-guide-faceless-youtube-2026",
  status: "published",
  content: `Listen, if you've been thinking about starting a YouTube channel but the thought of being on camera makes you anxious, you're in the right place. The faceless content model has exploded in 2026—and for good reason. You can build a scalable, anonymous YouTube empire using AI tools, strategic niche selection, and high-RPM automation workflows.

## Why Faceless YouTube Works in 2026

The faceless content model has become increasingly viable due to several key factors. First, AI tools have reached a level of sophistication that allows creators to produce high-quality content at scale without extensive technical skills. Voice cloning technology, automated video editing, and AI script generation have eliminated many traditional barriers.

Second, audience preferences have shifted toward content that focuses on value and entertainment rather than personality-driven content. Viewers are seeking information, stories, and insights—not necessarily personal connections with creators.

Third, the monetization landscape has expanded significantly. Multiple revenue streams are available including YouTube ad revenue, affiliate marketing, digital products, and community memberships.

## Getting Started: Your First Steps

Begin by selecting a profitable niche that aligns with your interests and has proven monetization potential. Research successful channels in your chosen niche to understand what content performs well. Develop a content calendar that ensures consistent posting—aim for at least 3–5 videos per week to build algorithm momentum.

Invest in essential tools: a good microphone for voiceovers, video editing software like CapCut (free and powerful), and access to stock footage libraries. Create a brand identity through consistent visuals and voice style. Set up your channel with optimized SEO: compelling titles, eye-catching thumbnails, and detailed descriptions with relevant keywords.

## High-RPM Niches and Automation

Focus on niches with strong CPM potential: finance, tech, health, and true crime consistently perform well. Use AI tools for script generation, voice cloning for consistent narration, and automated scheduling to maintain consistent posting. Build systems for every aspect: content research, script writing, video editing, and promotion.

## Monetization Strategies

Beyond ad revenue, diversify with affiliate marketing, digital products, and community memberships. The key is to test multiple revenue streams and double down on what works for your specific niche and audience.

Start creating and publishing consistently. The barrier to entry has never been lower—and the opportunity has never been greater.`,
  excerpt: "Discover how to build a scalable, anonymous YouTube empire in 2026 using AI tools, strategic niche selection, and high-RPM automation workflows.",
  metaDescription: "Master faceless YouTube automation in 2026. Learn about high-RPM niches, AI content workflows, and SEO strategies for anonymous growth.",
  seoTitle: "Faceless YouTube Channel Guide 2026: From Zero to Profitable",
  targetPlatforms: ["YouTube", "YouTube Shorts"],
  featuredImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop",
  wordCount: 1245,
  readTime: 8,
  viewCount: 0,
  shareCount: 0,
  createdAt: ts,
  updatedAt: ts,
  publishedAt: ts,
};

async function main() {
  const { ConvexHttpClient } = await import("convex/browser");
  const { api } = await import("../convex/_generated/api.js");

  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("Inserting article:", article.title);
  console.log("Slug:", article.slug);

  try {
    const id = await client.mutation(api.articles.importArticle, { doc: article });
    console.log("Success! Article ID:", id);
  } catch (e) {
    console.error("Error:", e.message || e);
    process.exit(1);
  }
}

main();
